import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const inquiriesRouter = Router();

//Create Inquiries
inquiriesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, priority } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required." });
    }

    const newMessage = await prisma.inquiryMessage.create({
      data: {
        name,
        email,
        phone,
        message,
        priority: priority || "low",
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Message received.", data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 📥 Get all inquiries
inquiriesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiryMessage.findMany({
      orderBy: { createdAt: "desc" }, // newest first
    });

    res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 📥 Get a single inquiry by ID
inquiriesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiryMessage.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Delete a a single inquiry by ID
inquiriesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete inquiry with ID: ${id}`);

    // Check if inquiry exists first
    const existingInquiry = await prisma.inquiryMessage.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    // Delete the inquiry
    const deletedInquiry = await prisma.inquiryMessage.delete({
      where: { id },
    });

    console.log(`Successfully deleted inquiry: ${id}`);

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
      data: deletedInquiry,
    });
  } catch (err: any) {
    console.error("Delete inquiry error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    res.status(500).json({ error: "Internal server error." });
  }
});

// Update a a single inquiry by ID
inquiriesRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, replied, reply } = req.body;

    console.log(`Updating inquiry ${id} with data:`, {
      status,
      replied,
      reply,
    });

    // Validate the status if provided
    if (status && !["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Build update data object dynamically
    const updateData: any = {};

    if (status) updateData.status = status;
    if (typeof replied === "boolean") updateData.replied = replied;
    if (typeof reply === "string") {
      updateData.reply = reply;
      updateData.replied = true;
      updateData.repliedAt = new Date();
    }

    console.log("Update data:", updateData);

    const updatedInquiry = await prisma.inquiryMessage.update({
      where: { id },
      data: updateData,
    });

    console.log("Successfully updated inquiry:", updatedInquiry);

    res.status(200).json({
      success: true,
      message: "Inquiry updated successfully.",
      data: updatedInquiry,
    });
  } catch (err: any) {
    console.error("Update inquiry error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    res.status(500).json({ error: "Internal server error." });
  }
});

export default inquiriesRouter;
