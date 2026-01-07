import axios from "axios";
import { connectToDatabase } from "./db.js";

const CHECK_INTERVAL = Number(process.env.CHECK_INTERVAL) || 60000;

async function runChecks() {
  console.log("Worker: starting check cycle");

  try {
    const db = await connectToDatabase();
    const urlsCollection = db.collection("urls");
    const checksCollection = db.collection("checks");

    const urls = await urlsCollection.find({ isActive: true }).toArray();

    for (const urlDoc of urls) {
      // 🔎 Provjeri zadnji check za ovaj URL
      const lastCheck = await checksCollection.findOne(
        { urlId: urlDoc._id },
        { sort: { checkedAt: -1 } }
      );

      if (lastCheck) {
        const diff = Date.now() - new Date(lastCheck.checkedAt).getTime();
        if (diff < CHECK_INTERVAL) {
          console.log(`⏭ Skipping ${urlDoc.url} (checked recently)`);
          continue; // ✅ OVDJE je continue DOZVOLJEN
        }
      }

      try {
        const response = await axios.get(urlDoc.url, {
          timeout: 10000,
        });

        const html = response.data;
        const linkCount = (html.match(/<a /g) || []).length;

        await checksCollection.insertOne({
          urlId: urlDoc._id,
          statusCode: response.status,
          htmlSize: html.length,
          linkCount,
          checkedAt: new Date(),
        });

        console.log(`✔ Checked ${urlDoc.url}`);
      } catch (err) {
        console.error(`✖ Error checking ${urlDoc.url}:`, err.message);

        await checksCollection.insertOne({
          urlId: urlDoc._id,
          statusCode: err.response?.status || 500,
          htmlSize: 0,
          linkCount: 0,
          checkedAt: new Date(),
        });
      }
    }

    console.log("Worker: cycle finished");
  } catch (err) {
    console.error("Worker fatal error:", err.message);
  }
}

// 1️⃣ Pokreni odmah
runChecks();

// 2️⃣ I ponavljaj periodički
setInterval(runChecks, CHECK_INTERVAL);
