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

// ✅ Fetch all scan results
router.get("/", async (req, res) => {
  try {
    const results = await prisma.scanResult.findMany({
      orderBy: { createdAt: "desc" }, // optional: newest first
    });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ✅ Delete a scan result by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Check if the record exists before attempting to delete
    const existingResult = await prisma.scanResult.findUnique({
      where: { id },
    });

    if (!existingResult) {
      return res.status(404).json({ error: "Scan result not found" });
    }

    const deleted = await prisma.scanResult.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Scan result deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
