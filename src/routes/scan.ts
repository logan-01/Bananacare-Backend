import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { address, percentage, result, resultArr, imgUrl } = req.body;

    if (!address || !percentage || !result || !resultArr || !imgUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const saved = await prisma.scanResult.create({
      data: { address, percentage, result, resultArr, imgUrl },
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
