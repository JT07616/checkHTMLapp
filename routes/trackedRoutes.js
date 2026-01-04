import express from "express";

const router = express.Router();

/*
  POST /tracked
  Dodaje URL u tracked_sites (bez duplikata)
*/
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  if (!db) return res.status(503).json({ error: "Database not ready" });

  const { url } = req.body;
  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({ error: "Morate poslati ispravan 'url'." });
  }

  const cleanUrl = url.trim();

  try {
    const collection = db.collection("tracked_sites");

    const existing = await collection.findOne({ url: cleanUrl });
    if (existing) {
      return res.status(409).json({ error: "URL već postoji.", url: cleanUrl });
    }

    const newSite = { url: cleanUrl, createdAt: new Date().toISOString() };
    const result = await collection.insertOne(newSite);

    res.status(201).json({ _id: result.insertedId, ...newSite });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

/*
  GET /tracked
*/
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  if (!db) return res.status(503).json({ error: "Database not ready" });

  try {
    const sites = await db.collection("tracked_sites").find({}).toArray();
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

/*
  DELETE /tracked?url=...
*/
router.delete("/", async (req, res) => {
  const db = req.app.locals.db;
  if (!db) return res.status(503).json({ error: "Database not ready" });

  const url = req.query.url;
  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({
      error: "Morate poslati 'url' kao query parametar."
    });
  }

  const cleanUrl = url.trim();

  try {
    const result = await db.collection("tracked_sites").deleteOne({ url: cleanUrl });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "URL nije pronađen." });
    }

    res.json({ message: "Stranica je uklonjena.", url: cleanUrl });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;