//lib/firebase.ts
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Parse Firebase service account JSON from .env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

// Ensure private_key has proper newlines
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

// Initialize Firebase Admin SDK only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Export Firebase Admin services
export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export const adminStorage = admin.storage();
export const adminMessaging = admin.messaging();

// Export the admin app instance
export const adminApp = admin.app();

// Helper functions for common operations
export const firebaseAdmin = {
  // Auth helpers
  async getUserByEmail(email: string) {
    try {
      return await adminAuth.getUserByEmail(email);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  },

  async getUserByUID(uid: string) {
    try {
      return await adminAuth.getUser(uid);
    } catch (error) {
      console.error("Error fetching user by UID:", error);
      throw error;
    }
  },

  async createUser(userData: {
    email: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
  }) {
    try {
      return await adminAuth.createUser(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async updateUser(
    uid: string,
    userData: {
      email?: string;
      displayName?: string;
      photoURL?: string;
      emailVerified?: boolean;
    }
  ) {
    try {
      return await adminAuth.updateUser(uid, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async deleteUser(uid: string) {
    try {
      await adminAuth.deleteUser(uid);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async listAllUsers(maxResults: number = 1000) {
    try {
      const listUsersResult = await adminAuth.listUsers(maxResults);
      return listUsersResult.users;
    } catch (error) {
      console.error("Error listing users:", error);
      throw error;
    }
  },

  async setCustomClaims(uid: string, customClaims: object) {
    try {
      await adminAuth.setCustomUserClaims(uid, customClaims);
      return true;
    } catch (error) {
      console.error("Error setting custom claims:", error);
      throw error;
    }
  },

  async verifyIdToken(idToken: string) {
    try {
      return await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw error;
    }
  },

  // Firestore helpers
  async getDocument(collection: string, docId: string) {
    try {
      const doc = await adminFirestore.collection(collection).doc(docId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  },

  async setDocument(collection: string, docId: string, data: object) {
    try {
      await adminFirestore.collection(collection).doc(docId).set(data);
      return true;
    } catch (error) {
      console.error("Error setting document:", error);
      throw error;
    }
  },

  async updateDocument(collection: string, docId: string, data: object) {
    try {
      await adminFirestore.collection(collection).doc(docId).update(data);
      return true;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  async deleteDocument(collection: string, docId: string) {
    try {
      await adminFirestore.collection(collection).doc(docId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Storage helpers
  getBucket(bucketName?: string) {
    return adminStorage.bucket(bucketName);
  },

  async uploadFile(
    bucketName: string,
    fileName: string,
    fileBuffer: Buffer,
    metadata?: object
  ) {
    try {
      const bucket = adminStorage.bucket(bucketName);
      const file = bucket.file(fileName);

      await file.save(fileBuffer, {
        metadata: metadata || {},
      });

      return `gs://${bucketName}/${fileName}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  async deleteFile(bucketName: string, fileName: string) {
    try {
      const bucket = adminStorage.bucket(bucketName);
      await bucket.file(fileName).delete();
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  // Messaging helpers
  async sendMessage(message: admin.messaging.Message) {
    try {
      return await adminMessaging.send(message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  //   async sendMulticastMessage(message: admin.messaging.MulticastMessage) {
  //     try {
  //       return await adminMessaging(message);
  //     } catch (error) {
  //       console.error("Error sending multicast message:", error);
  //       throw error;
  //     }
  //   },
};

// Type definitions for better TypeScript support
export type FirebaseUser = admin.auth.UserRecord;
export type FirebaseDecodedIdToken = admin.auth.DecodedIdToken;

// Validation helper
export const validateFirebaseConfig = () => {
  if (
    !serviceAccount.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    throw new Error(
      "Invalid Firebase service account configuration. Check your FIREBASE_SERVICE_ACCOUNT environment variable."
    );
  }
  console.log("✅ Firebase Admin SDK initialized successfully");
  console.log(`📧 Project: ${serviceAccount.project_id}`);
  console.log(`👤 Service Account: ${serviceAccount.client_email}`);
};

// Initialize validation
validateFirebaseConfig();
