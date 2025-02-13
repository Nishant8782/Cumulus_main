const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ip: { type: String },
  location: { type: String },
  country: { type: String },
  deviceId: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
});
sessionSchema.pre('save', function (next) {
  this.lastActivityAt = new Date();
  next();
});
const Session = mongoose.model('Session', sessionSchema);
const activitySchema = new mongoose.Schema({
  toEmail: {
    type: String,
  },
  fileActivities: [
    {
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
      action: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],  
  voiceActivities: [
    {
      voiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voice' },
      action: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Activity = mongoose.model('Activity', activitySchema);
module.exports = { Session, Activity };