import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import checkRoutes from "./routes/checkRoutes.js";
import trackedRoutes from "./routes/trackedRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(MONGO_URI);

// Spoj na bazu i spremanje u app.locals (da rute mogu koristiti db)
async function connectDB() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    app.locals.db = db;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
}

await connectDB();

// Test ruta
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Mount routera
app.use("/check", checkRoutes);
app.use("/tracked", trackedRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});