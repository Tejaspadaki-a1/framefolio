const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

app.post("/sendBookingNotification", async (req, res) => {
  const {photographerId, userName, date, time, notes} = req.body;

  try {
    const photographerRef = db.collection("users").doc(photographerId);
    const photographerDoc = await photographerRef.get();

    if (!photographerDoc.exists) {
      return res.status(404).send("Photographer not found");
    }

    const photographerEmail = photographerDoc.data().email;

    // Replace this with actual email sending logic
    console.log(
      "Send email to: " + photographerEmail +
      "\nFrom: " + userName +
      "\nDate: " + date + " Time: " + time +
      "\nNotes: " + notes
    );

    res.status(200).send("Notification sent");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Error sending notification");
  }
});

// ⭐ Store Ratings/Reviews
app.post("/submitReview", async (req, res) => {
  const {photographerId, userId, rating, review} = req.body;

  try {
    const reviewRef = db.collection("reviews").doc();
    await reviewRef.set({
      photographerId,
      userId,
      rating,
      review,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("Review submitted");
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).send("Error submitting review");
  }
});

// 🚀 Export the Cloud Function
exports.api = functions.https.onRequest(app);
