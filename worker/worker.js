import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import trackedRoutes from "./routes/trackedRoutes.js";
import checkRoutes from "./routes/checkRoutes.js";


dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// MongoDB klijent
const client = new MongoClient(MONGO_URI);

/*
  Helper funkcija – ista logika kao u API-ju,
  ali bez HTTP sloja
*/
async function analyzeUrl(url) {
  const startTime = Date.now();

  const response = await fetch(url);
  const body = await response.text();

  return {
    statusCode: response.status,
    responseTimeMs: Date.now() - startTime,
    responseSizeBytes: Buffer.byteLength(body, "utf8"),
    lastCheckedAt: new Date().toISOString()
  };
}

/*
  Worker se izvršava jednom:
  - pročita sve tracked URL-ove
  - provjeri ih
  - spremi zadnje stanje u bazu
*/
async function runOnce() {
  await client.connect();
  const db = client.db(DB_NAME);
  const tracked = db.collection("tracked_sites");

  const sites = await tracked.find({}).toArray();
  console.log(`Worker: found ${sites.length} tracked site(s).`);

  for (const site of sites) {
    try {
      const result = await analyzeUrl(site.url);

      await tracked.updateOne(
        { _id: site._id },
        { $set: result }
      );

      console.log(
        `OK  ${site.url} -> ${result.statusCode}, ${result.responseTimeMs}ms`
      );
    } catch (err) {
      // u slučaju greške spremamo "fail stanje"
      await tracked.updateOne(
        { _id: site._id },
        {
          $set: {
            lastStatusCode: 0,
            lastResponseTimeMs: 0,
            lastResponseSizeBytes: 0,
            lastCheckedAt: new Date().toISOString(),
            lastError: err.message
          }
        }
      );

      console.log(`ERR ${site.url} -> ${err.message}`);
    }
  }

  await client.close();
}

// Pokretanje workera (jedan ciklus)
runOnce();