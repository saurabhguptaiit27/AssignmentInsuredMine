const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
