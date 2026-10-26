const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
