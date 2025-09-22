// prisma/seed.ts
import prisma from "../src/lib/prisma";
import { adminAuth, firebaseAdmin } from "../src/lib/firebase";

async function main() {
  try {
    // Replace with your actual Firebase Auth UID from console
    const firebaseUID = "p8Sz2QSBnHhIMgHQINT8oLcWFYx1"; // Your actual UID here

    // Fetch user data from Firebase Auth using helper function
    console.log("Fetching user data from Firebase Auth...");
    const firebaseUser = await firebaseAdmin.getUserByUID(firebaseUID);

    console.log("Firebase user data:", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
    });

    // Check if user already exists in Prisma (check both firebaseUID and email)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ firebaseUID: firebaseUID }, { email: firebaseUser.email || "" }],
      },
    });

    if (existingUser) {
      console.log("User exists, updating with Firebase Auth data...");

      // Update existing user with Firebase Auth metadata
      const updatedUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          firebaseUID: firebaseUser.uid, // Link to Firebase Auth
          email: firebaseUser.email || existingUser.email,
          name: firebaseUser.displayName || existingUser.name,
          image: firebaseUser.photoURL || existingUser.image, // Note: using 'image' field
          emailVerified: firebaseUser.emailVerified
            ? new Date()
            : existingUser.emailVerified,
          updatedAt: new Date(),
        },
      });

      console.log("User updated:", updatedUser);
    } else {
      console.log("Creating new user with Firebase Auth data...");

      // Create new user with Firebase Auth metadata
      const user = await prisma.user.create({
        data: {
          firebaseUID: firebaseUser.uid,
          email: firebaseUser.email || `${firebaseUser.uid}@example.com`,
          name: firebaseUser.displayName || "Firebase User",
          image: firebaseUser.photoURL || null, // Note: using 'image' field
          emailVerified: firebaseUser.emailVerified ? new Date() : null, // Note: DateTime format
          password: null, // No password for Firebase Auth users
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log("User created:", user);

      // Optionally create an Account record for Firebase provider
      await prisma.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: "firebase",
          providerAccountId: firebaseUser.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log("Firebase Account record created");
    }

    // Optional: Sync all Firebase Auth users
    // await syncAllFirebaseUsers()
  } catch (error) {
    console.error("Error seeding user:", error);
    throw error;
  }
}

// Optional function to sync all Firebase Auth users
async function syncAllFirebaseUsers() {
  console.log("Syncing all Firebase Auth users...");

  try {
    const allUsers = await firebaseAdmin.listAllUsers();

    for (const firebaseUser of allUsers) {
      const existingUser = await prisma.user.findUnique({
        where: {
          firebaseUID: firebaseUser.uid,
        },
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: {
            firebaseUID: firebaseUser.uid,
            email: firebaseUser.email || `${firebaseUser.uid}@example.com`,
            name: firebaseUser.displayName || "Firebase User",
            image: firebaseUser.photoURL || null,
            emailVerified: firebaseUser.emailVerified ? new Date() : null,
            password: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Create Account record
        await prisma.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "firebase",
            providerAccountId: firebaseUser.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(`Synced user: ${firebaseUser.uid}`);
      }
    }
  } catch (error) {
    console.error("Error syncing Firebase users:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed successfully!");
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
