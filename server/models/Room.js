const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },

  status: {
    type: String,
    enum: ["approved", "pending"],
    default: "approved",
  },
});


const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    roomName: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "javascript",
    },

    code: {
      type: String,
      default: "",
    },

    participants: [participantSchema],
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Room", roomSchema);