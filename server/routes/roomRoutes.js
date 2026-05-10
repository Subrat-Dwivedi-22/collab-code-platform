const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  joinRoom,
  getMyRooms,
  getRoomById,
  deleteRoom,
  saveRoomCode,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/create", protect, createRoom);

router.post("/join", protect, joinRoom);

router.get("/my-rooms", protect, getMyRooms);

router.get("/:roomId", protect, getRoomById);

router.delete("/:id", protect, deleteRoom);

router.put("/save-code", protect, saveRoomCode);

module.exports = router;
