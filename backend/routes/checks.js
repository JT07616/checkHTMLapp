import express from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../db.js";

const router = express.Router();

router.get("/:urlId", async (req, res) => {
  const { urlId } = req.params;

  try {
    const db = await connectToDatabase();
    const checks = db.collection("checks");

    const result = await checks
      .find({ urlId: new ObjectId(urlId) })
      .sort({ checkedAt: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid URL ID" });
  }
});

export default router;
