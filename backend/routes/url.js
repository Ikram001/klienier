import express from "express";
import {
  handleGenerateShortURL,
  handleGetShortURL,
  handleGetAnalytics,
} from "../controllers/url.js";
const router = express.Router();

router.post("/", handleGenerateShortURL);
router.get("/:shortId", handleGetShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);

export default router;
