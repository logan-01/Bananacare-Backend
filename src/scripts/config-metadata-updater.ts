// scripts/config-metadata-updater.ts
import { firebaseAdmin } from "../lib/firebase";

// Configuration - Update these values as needed
const USER_UPDATES = [
  {
    // Option 1: Update by email
    email: "bananacare@gmail.com", // Replace with your Firebase user email
    displayName: "",
    photoURL: "",
    emailVerified: false,
  },
  // Add more users if needed
  // {
  //   uid: 'specific-firebase-uid', // Option 2: Update by UID
  //   displayName: 'Jane Smith',
  //   photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b04d0b2c?w=400&h=400&fit=crop&crop=face',
  //   emailVerified: true
  // }
];

// Sample photo URLs
const SAMPLE_PHOTOS = {
  male1:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  male2:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  male3:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  female1:
    "https://images.unsplash.com/photo-1494790108755-2616b04d0b2c?w=400&h=400&fit=crop&crop=face",
  female2:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  female3:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  avatar1:
    "https://ui-avatars.com/api/?name=John+Doe&size=400&background=4F46E5&color=fff",
  avatar2:
    "https://ui-avatars.com/api/?name=Jane+Smith&size=400&background=EF4444&color=fff",
};

async function updateUsersFromConfig() {
  console.log("⚙️ Config-based Firebase Metadata Updater\n");

  if (USER_UPDATES.length === 0) {
    console.log("❌ No user updates configured");
    console.log("💡 Edit the USER_UPDATES array in this script");
    return;
  }

  try {
    for (const config of USER_UPDATES) {
      console.log(
        `🔄 Processing user: ${config.email || config.displayName || "Unknown"}`
      );

      try {
        // Find the user
        let user;
        if (config.email) {
          user = await firebaseAdmin.getUserByEmail(config.email);
        } else if (config.email) {
          user = await firebaseAdmin.getUserByUID(config.email);
        } else {
          console.log("❌ No email or UID provided, skipping");
          continue;
        }

        // Prepare update data
        const updateData: any = {};
        if (config.displayName !== undefined)
          updateData.displayName = config.displayName;
        if (config.photoURL !== undefined)
          updateData.photoURL = config.photoURL;
        if (config.emailVerified !== undefined)
          updateData.emailVerified = config.emailVerified;

        // Update the user
        const updatedUser = await firebaseAdmin.updateUser(
          user.uid,
          updateData
        );

        console.log("✅ Updated successfully!");
        console.log(`   UID: ${updatedUser.uid}`);
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   Name: ${updatedUser.displayName}`);
        console.log(`   Photo: ${updatedUser.photoURL}`);
        console.log(`   Verified: ${updatedUser.emailVerified}`);
        console.log("");
      } catch (error: any) {
        console.error(`❌ Failed to update user: ${error.message}`);
        console.log("");
      }
    }

    console.log("🎉 All configured users processed!");
    console.log("\n📝 Next steps:");
    console.log("   1. Copy a UID from above");
    console.log("   2. Update your seed script with the UID");
    console.log("   3. Run: npm run db:seed");
  } catch (error) {
    console.error("❌ Update process failed:", error);
  }
}

// Quick setup for first user
async function quickSetupFirstUser() {
  console.log("⚡ Quick setup for first Firebase user\n");

  try {
    const users = await firebaseAdmin.listAllUsers(1);

    if (users.length === 0) {
      console.log("❌ No users found in Firebase Auth");
      console.log("💡 Create a user in Firebase Console first");
      return;
    }

    const user = users[0];
    console.log(`🎯 Setting up: ${user.email || user.uid}`);

    const updateData = {
      displayName: "Bananacare",
      photoURL:
        "https://res.cloudinary.com/dlcmbij94/image/upload/v1758490684/BananaCare_Logomark_hghmgp.png",
      emailVerified: false,
    };

    const updatedUser = await firebaseAdmin.updateUser(user.uid, updateData);

    console.log("✅ Quick setup completed!");
    console.log("📋 User ready for seeding:");
    console.log(`   UID: ${updatedUser.uid}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Name: ${updatedUser.displayName}`);
    console.log(`   Photo: ${updatedUser.photoURL}`);

    console.log(`\n📝 Copy this UID: ${updatedUser.uid}`);
  } catch (error) {
    console.error("❌ Quick setup failed:", error);
  }
}

// Show available photos
function showPhotos() {
  console.log("📸 Available photo URLs:\n");

  Object.entries(SAMPLE_PHOTOS).forEach(([key, url]) => {
    console.log(`${key}: ${url}`);
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "config";

  switch (command) {
    case "config":
      await updateUsersFromConfig();
      break;
    case "quick":
      await quickSetupFirstUser();
      break;
    case "photos":
      showPhotos();
      break;
    default:
      console.log("⚙️ Config-based Firebase Metadata Updater\n");
      console.log("Usage:");
      console.log(
        "  npx tsx scripts/config-metadata-updater.ts config   # Update from config"
      );
      console.log(
        "  npx tsx scripts/config-metadata-updater.ts quick    # Quick setup first user"
      );
      console.log(
        "  npx tsx scripts/config-metadata-updater.ts photos   # Show photo URLs"
      );
      console.log("");
      console.log(
        "💡 Edit USER_UPDATES array in this script to configure users"
      );
  }
}

main();
