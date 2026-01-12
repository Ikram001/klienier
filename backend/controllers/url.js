import { nanoid } from "nanoid";
import URL from "../models/url.js";

export async function handleGenerateShortURL(req, res) {
  const body = req.body;
  const shortId = nanoid(8);
  if (!body.url) return res.status(400).json({ error: "url is required" });
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  res.json({ id: shortId });
}

export async function handleGetShortURL(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  // Safety check to prevent server crash
  if (!result) {
    return res.status(404).json({ error: "Short ID not found" });
  }
  res.redirect(result.redirectURL);
}

export async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
