import { Router } from "express";
import prisma from "../lib/prisma";
import { adminAuth } from "../lib/firebase";

const router = Router();

router.put("/update/:uid", async (req, res) => {
  const { uid } = req.params; // Firebase UID
  const { name, email, photoURL, emailVerified } = req.body;

  try {
    // 1️⃣ Update Firebase Auth metadata
    const firebaseUser = await adminAuth.updateUser(uid, {
      displayName: name,
      email: email,
      photoURL: photoURL,
      emailVerified: emailVerified,
    });

    // 2️⃣ Update Prisma User
    const prismaUser = await prisma.user.update({
      where: { firebaseUID: uid },
      data: {
        name: name,
        email: email,
        image: photoURL,
        emailVerified: emailVerified ? new Date() : null,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      firebaseUser,
      prismaUser,
    });
  } catch (error: any) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
