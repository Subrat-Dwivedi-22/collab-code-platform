const { v4: uuidv4 } = require("uuid");

const Room = require("../models/Room");

// CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).json({
        message: "Room name is required",
      });
    }

    const roomId = uuidv4();

    const room = await Room.create({
      roomId,

      roomName,

      participants: [
        {
          user: req.user._id,
          role: "admin",
          status: "approved",
        },
      ],
    });

    res.status(201).json(room);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// JOIN ROOM
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check already joined
    const alreadyJoined = room.participants.find(
      (p) => p.user.toString() === req.user._id.toString(),
    );

    if (!alreadyJoined) {
      room.participants.push({
        user: req.user._id,
        role: "member",
        status: "approved",
      });

      await room.save();
    }

    res.status(200).json(room);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET MY ROOMS
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      "participants.user": req.user._id,
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// GET SINGLE ROOM
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(room);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // FIND CURRENT USER PARTICIPATION
    const participant = room.participants.find(
      (p) => p.user.toString() === req.user._id.toString(),
    );

    // CHECK ADMIN
    if (!participant || participant.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete room",
      });
    }

    await room.deleteOne();

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// SAVE ROOM CODE
const saveRoomCode = async (req, res) => {
  try {

    const { roomId, code } = req.body;

    await Room.findOneAndUpdate(
      { roomId },
      { code }
    );

    res.status(200).json({
      message: "Code saved",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Save failed",
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getMyRooms,
  getRoomById,
  deleteRoom,
  saveRoomCode,
};
