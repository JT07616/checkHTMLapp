import express from "express";

const router = express.Router();

/*
  Helper za instant provjeru URL-a:
  - statusCode
  - responseTimeMs
  - responseSizeBytes
*/
async function analyzeUrl(url) {
  const startTime = Date.now();

  const response = await fetch(url);
  const body = await response.text();

  return {
    url,
    statusCode: response.status,
    responseTimeMs: Date.now() - startTime,
    responseSizeBytes: Buffer.byteLength(body, "utf8"),
    checkedAt: new Date().toISOString()
  };
}

/*
  POST /check
  Instant provjera (bez spremanja u bazu)
*/
router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({ error: "Morate poslati ispravan 'url'." });
  }

  const cleanUrl = url.trim();

  try {
    const result = await analyzeUrl(cleanUrl);
    res.json(result);
  } catch (error) {
    res.json({
      url: cleanUrl,
      statusCode: 0,
      responseTimeMs: 0,
      responseSizeBytes: 0,
      checkedAt: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;