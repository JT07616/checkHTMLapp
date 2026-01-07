import express from "express";
import { connectToDatabase } from "../db.js";
import { runCheck } from "../utils/runCheck.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const urls = db.collection("urls");

    const result = await urls.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const db = await connectToDatabase();
    const urls = db.collection("urls");
    const checksCollection = db.collection("checks");

    const result = await urls.insertOne({
      url,
      isActive: true,
      createdAt: new Date(),
    });

    // INSTANT CHECK
    const checkResult = await runCheck(url);

    await checksCollection.insertOne({
      urlId: result.insertedId,
      ...checkResult,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const urlsCollection = db.collection("urls");
    const checksCollection = db.collection("checks");

    const urlId = new ObjectId(req.params.id);

    // Obriši checkove
    await checksCollection.deleteMany({ urlId });

    // Obriši URL
    const result = await urlsCollection.deleteOne({ _id: urlId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "URL and related checks deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete URL" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const urlsCollection = db.collection("urls");

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await urlsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { url } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "URL updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update URL" });
  }
});

export default router;
