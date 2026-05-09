require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────
// Firebase Admin Init
// ─────────────────────────────────────────────────────────────
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ─────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Rate Limiters
// ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use(limiter);

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many password attempts. Please wait 15 minutes.",
  },
});

// ─────────────────────────────────────────────────────────────
// Multer Config
// ─────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 12 * 1024 * 1024, // 12MB per file
  },
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function cleanText(value) {
  if (!value) return "";
  return String(value).trim();
}

function capitalizeFirst(text = "") {
  const trimmed = cleanText(text);
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function getBaseFolder() {
  return process.env.CLOUDINARY_FOLDER || "birthday-app";
}

function getCloudinaryPhotoFolder(collectionName = "photos") {
  return `${getBaseFolder()}/${collectionName}`;
}

function getCloudinaryAiFolder(collectionName = "photos") {
  return `${getBaseFolder()}/${collectionName}_ai`;
}

function getMusicFolder(type = "birthday") {
  return `${getBaseFolder()}/music/${type}`;
}

function toDocId(publicId) {
  return Buffer.from(publicId).toString("base64url");
}

function isAllowedImage(file) {
  if (!file) return false;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  return allowedTypes.includes(file.mimetype);
}

function isAllowedAudio(file) {
  if (!file) return false;

  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/mp4",
    "audio/x-m4a",
    "audio/m4a",
  ];

  return allowedTypes.includes(file.mimetype);
}

function uploadImageToCloudinary(file, folderName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      },
    );

    stream.end(file.buffer);
  });
}

function uploadAudioToCloudinary(file, folderName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "video", // Cloudinary stores audio using video resource type
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      },
    );

    stream.end(file.buffer);
  });
}

function timestampToMillis(value) {
  if (!value) return 0;

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────
// Health Routes
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🎂 Birthday App Backend is running successfully!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "🎂 Birthday App Backend is running!",
  });
});

// ─────────────────────────────────────────────────────────────
// Upload Photo: Normal Photo + Optional AI Photo
// ─────────────────────────────────────────────────────────────
app.post(
  "/api/photos/upload",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aiPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const collectionName = cleanText(req.body.collectionName) || "photos";
      const note = capitalizeFirst(req.body.note || "");
      const description = capitalizeFirst(req.body.description || "");
      const dress = capitalizeFirst(req.body.dress || "");
      const ageRange = cleanText(req.body.ageRange || "");

      const photoFile = req.files?.photo?.[0];
      const aiPhotoFile = req.files?.aiPhoto?.[0];

      if (!photoFile) {
        return res.status(400).json({
          message: "Main photo is required.",
        });
      }

      if (!isAllowedImage(photoFile)) {
        return res.status(400).json({
          message: "Main photo must be JPG, PNG, WEBP, or GIF.",
        });
      }

      if (aiPhotoFile && !isAllowedImage(aiPhotoFile)) {
        return res.status(400).json({
          message: "AI photo must be JPG, PNG, WEBP, or GIF.",
        });
      }

      const photoFolder = getCloudinaryPhotoFolder(collectionName);
      const aiFolder = getCloudinaryAiFolder(collectionName);

      const uploadedPhoto = await uploadImageToCloudinary(
        photoFile,
        photoFolder,
      );

      let uploadedAiPhoto = null;

      if (aiPhotoFile) {
        uploadedAiPhoto = await uploadImageToCloudinary(aiPhotoFile, aiFolder);
      }

      const metadataDocId = toDocId(uploadedPhoto.public_id);

      await db
        .collection("photo_metadata")
        .doc(metadataDocId)
        .set({
          publicId: uploadedPhoto.public_id,
          imageUrl: uploadedPhoto.secure_url,
          aiPublicId: uploadedAiPhoto?.public_id || "",
          aiImageUrl: uploadedAiPhoto?.secure_url || "",
          note,
          description,
          dress,
          ageRange,
          collectionName,
          name: photoFile.originalname,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          cloudinaryCreatedAt: uploadedPhoto.created_at,
        });
      return res.status(200).json({
        message: "Photo uploaded successfully",
        photo: {
          publicId: uploadedPhoto.public_id,
          imageUrl: uploadedPhoto.secure_url,
          aiPublicId: uploadedAiPhoto?.public_id || "",
          aiImageUrl: uploadedAiPhoto?.secure_url || "",
          name: photoFile.originalname,
          width: uploadedPhoto.width,
          height: uploadedPhoto.height,
          createdAt: uploadedPhoto.created_at,
          collectionName,
          note,
          description,
          dress,
          ageRange,
        },
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      return res.status(500).json({
        message: "Photo upload failed.",
      });
    }
  },
);

// ─────────────────────────────────────────────────────────────
// Get Photos
// ─────────────────────────────────────────────────────────────
app.get("/api/photos", async (req, res) => {
  try {
    const collectionName = cleanText(req.query.collectionName) || "photos";
    const folderName = getCloudinaryPhotoFolder(collectionName);

    const cloudinaryResult = await cloudinary.search
      .expression(`folder:${folderName}`)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    const metadataSnapshot = await db
      .collection("photo_metadata")
      .where("collectionName", "==", collectionName)
      .get();

    const metadataMap = new Map();

    metadataSnapshot.forEach((doc) => {
      const data = doc.data();
      metadataMap.set(data.publicId, data);
    });

    const photos = cloudinaryResult.resources.map((item) => {
      const metadata = metadataMap.get(item.public_id) || {};

      return {
        publicId: item.public_id,
        imageUrl: item.secure_url,
        name: metadata.name || item.filename,
        width: item.width,
        height: item.height,
        createdAt: item.created_at,
        collectionName,
        note: metadata.note || "",
        description: metadata.description || "",
        dress: metadata.dress || "",
        ageRange: metadata.ageRange || "",
        aiPublicId: metadata.aiPublicId || "",
        aiImageUrl: metadata.aiImageUrl || "",
      };
    });

    return res.status(200).json({
      photos,
    });
  } catch (error) {
    console.error("Photo fetch error:", error);
    return res.status(500).json({
      message: "Failed to fetch photos.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Update Photo Heading
// ─────────────────────────────────────────────────────────────
app.patch("/api/photos/heading", async (req, res) => {
  try {
    const publicId = cleanText(req.body.publicId);
    const note = capitalizeFirst(req.body.note || "");

    if (!publicId) {
      return res.status(400).json({
        message: "publicId is required.",
      });
    }

    const docId = toDocId(publicId);
    const docRef = db.collection("photo_metadata").doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        message: "Photo metadata not found.",
      });
    }

    await docRef.update({
      note,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Heading updated successfully",
      note,
    });
  } catch (error) {
    console.error("Heading update error:", error);
    return res.status(500).json({
      message: "Heading update failed.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Delete Photo
// Deletes normal image, optional AI image, and Firestore metadata
// ─────────────────────────────────────────────────────────────
app.delete("/api/photos", async (req, res) => {
  try {
    const publicId = cleanText(req.body.publicId);

    if (!publicId) {
      return res.status(400).json({
        message: "publicId is required.",
      });
    }

    const docId = toDocId(publicId);
    const docRef = db.collection("photo_metadata").doc(docId);
    const docSnap = await docRef.get();

    let aiPublicId = "";

    if (docSnap.exists) {
      aiPublicId = docSnap.data().aiPublicId || "";
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (aiPublicId) {
      await cloudinary.uploader.destroy(aiPublicId, {
        resource_type: "image",
      });
    }

    if (docSnap.exists) {
      await docRef.delete();
    }

    return res.status(200).json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Photo delete error:", error);
    return res.status(500).json({
      message: "Failed to delete photo.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Upload Music
// type = birthday OR pic
// Actual audio stored in Cloudinary.
// Metadata stored in Firestore.
// ─────────────────────────────────────────────────────────────
app.post("/api/music/upload", upload.single("audio"), async (req, res) => {
  try {
    const type = cleanText(req.body.type) || "birthday";

    if (!["birthday", "pic"].includes(type)) {
      return res.status(400).json({
        message: "Invalid music type.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Audio file is required.",
      });
    }

    if (!isAllowedAudio(req.file)) {
      return res.status(400).json({
        message: "Only MP3, WAV, M4A, and OGG audio files are allowed.",
      });
    }

    const folderName = getMusicFolder(type);
    const uploadedAudio = await uploadAudioToCloudinary(req.file, folderName);

    const docRef = await db.collection("music").add({
      publicId: uploadedAudio.public_id,
      url: uploadedAudio.secure_url,
      title: cleanText(req.body.title) || req.file.originalname,
      type,
      resourceType: "video",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      cloudinaryCreatedAt: uploadedAudio.created_at,
    });

    return res.status(200).json({
      message: "Music uploaded successfully",
      music: {
        id: docRef.id,
        publicId: uploadedAudio.public_id,
        url: uploadedAudio.secure_url,
        title: cleanText(req.body.title) || req.file.originalname,
        type,
      },
    });
  } catch (error) {
    console.error("Music upload error:", error);
    return res.status(500).json({
      message: "Music upload failed.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Get Music
// /api/music?type=birthday
// /api/music?type=pic
// ─────────────────────────────────────────────────────────────
app.get("/api/music", async (req, res) => {
  try {
    const type = cleanText(req.query.type) || "birthday";

    if (!["birthday", "pic"].includes(type)) {
      return res.status(400).json({
        message: "Invalid music type.",
      });
    }

    const snapshot = await db
      .collection("music")
      .where("type", "==", type)
      .get();

    let music = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    music = music.sort(
      (a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt),
    );

    return res.status(200).json({
      music,
    });
  } catch (error) {
    console.error("Get music error:", error);
    return res.status(500).json({
      message: "Failed to fetch music.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Delete Music
// Optional route, useful later if you add delete button
// ─────────────────────────────────────────────────────────────
app.delete("/api/music", async (req, res) => {
  try {
    const id = cleanText(req.body.id);

    if (!id) {
      return res.status(400).json({
        message: "Music document id is required.",
      });
    }

    const docRef = db.collection("music").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        message: "Music not found.",
      });
    }

    const data = docSnap.data();

    if (data.publicId) {
      await cloudinary.uploader.destroy(data.publicId, {
        resource_type: "video",
      });
    }

    await docRef.delete();

    return res.status(200).json({
      message: "Music deleted successfully",
    });
  } catch (error) {
    console.error("Delete music error:", error);
    return res.status(500).json({
      message: "Failed to delete music.",
    });
  }
});

app.patch("/api/photos/description", async (req, res) => {
  try {
    const publicId = cleanText(req.body.publicId || "");
    const description = capitalizeFirst(req.body.description || "");

    if (!publicId) {
      return res.status(400).json({ message: "publicId is required" });
    }

    const metadataDocId = encodeURIComponent(publicId);

    await db.collection("photo_metadata").doc(metadataDocId).set(
      {
        description,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: "Description updated successfully",
      publicId,
      description,
    });
  } catch (error) {
    console.error("Description update error:", error);
    res.status(500).json({ message: "Description update failed" });
  }
});

// ─────────────────────────────────────────────────────────────
// Verify Private Page Password
// ─────────────────────────────────────────────────────────────
app.post("/api/verify-password", passwordLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password is required.",
      });
    }

    const configDoc = await db.collection("config").doc("private_page").get();

    if (!configDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Password not configured yet.",
      });
    }

    const { hashedPassword } = configDoc.data();
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      return res.json({
        success: true,
        message: "🔓 Access granted!",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Incorrect password. Try again 💜",
    });
  } catch (error) {
    console.error("Password verify error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Set / Update Private Page Password
// ─────────────────────────────────────────────────────────────
app.post("/api/set-password", async (req, res) => {
  try {
    const { password, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        error: "Forbidden.",
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 4 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection("config").doc("private_page").set({
      hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      success: true,
      message: "Password set successfully!",
    });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Get Private Memories
// ─────────────────────────────────────────────────────────────
app.post("/api/private-content", passwordLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password required.",
      });
    }

    const configDoc = await db.collection("config").doc("private_page").get();

    if (!configDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Not configured.",
      });
    }

    const isValid = await bcrypt.compare(
      password,
      configDoc.data().hashedPassword,
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password.",
      });
    }

    const snapshot = await db
      .collection("private_memories")
      .orderBy("createdAt", "desc")
      .get();

    const memories = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    return res.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error("Private content error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error.",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎂 Birthday App Backend running on port ${PORT}`);
});
