const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, unique: true, required: true },
  clicks: { type: Number, default: 0 },
  uniqueVisitors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShareLink', shareLinkSchema);
