import express from "express";
import { firestore } from "../firebase.js";

const router = express.Router();

const roomCollection = firestore.collection("rooms");

async function roomExists(roomId) {
  const roomSnapshot = await roomCollection.doc(roomId).get();
  return roomSnapshot.exists;
}

// Create a new room
router.post("/", async (req, res) => {
  const room = req.body;
  try {
    const newRoomRef = await roomCollection.add(room);
    const newRoomSnapshot = await newRoomRef.get();
    const newRoomData = { id: newRoomSnapshot.id, ...newRoomSnapshot.data() };
    res.json({ success: true, result: newRoomData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Get room by ID
router.get("/:id", async (req, res) => {
  try {
    const roomSnapshot = await roomCollection.doc(req.params.id).get();
    if (roomSnapshot.exists) {
      const roomData = { id: roomSnapshot.id, ...roomSnapshot.data() };
      res.json({ success: true, result: roomData });
    } else {
      res.json({ success: false, message: "Room not found" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update user by ID in a room
router.patch("/:roomId/user/:userId", async (req, res) => {
  const { roomId, userId } = req.params;
  const userData = req.body;

  if (!(await roomExists(roomId))) {
    return res.json({ success: false, message: "Room not found" });
  }

  try {
    const userRef = roomCollection.doc(roomId).collection("users").doc(userId);
    await userRef.update(userData);
    const updatedUserSnapshot = await userRef.get();
    const updatedUserData = {
      id: updatedUserSnapshot.id,
      ...updatedUserSnapshot.data(),
    };
    res.json({ success: true, result: updatedUserData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Delete user by ID in a room
router.delete("/:roomId/user/:userId", async (req, res) => {
  const { roomId, userId } = req.params;

  if (!(await roomExists(roomId))) {
    return res.json({ success: false, message: "Room not found" });
  }

  try {
    await roomCollection.doc(roomId).collection("users").doc(userId).delete();
    res.json({ success: true, result: { userId } });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Update story by ID in a room
router.patch("/:roomId/story/:storyId", async (req, res) => {
  const { roomId, storyId } = req.params;
  const storyData = req.body;

  if (!(await roomExists(roomId))) {
    return res.json({ success: false, message: "Room not found" });
  }

  try {
    const storyRef = roomCollection
      .doc(roomId)
      .collection("stories")
      .doc(storyId);
    await storyRef.update(storyData);
    const updatedStorySnapshot = await storyRef.get();
    const updatedStoryData = {
      id: updatedStorySnapshot.id,
      ...updatedStorySnapshot.data(),
    };
    res.json({ success: true, result: updatedStoryData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Delete story by ID in a room
router.delete("/:roomId/story/:storyId", async (req, res) => {
  const { roomId, storyId } = req.params;

  if (!(await roomExists(roomId))) {
    return res.json({ success: false, message: "Room not found" });
  }

  try {
    await roomCollection
      .doc(roomId)
      .collection("stories")
      .doc(storyId)
      .delete();
    res.json({ success: true, result: { storyId } });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

export default router;
