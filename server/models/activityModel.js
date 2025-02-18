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
const deleteOldSessions = async () => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    await Session.deleteMany({ createdAt: { $lt: fourteenDaysAgo } });
    console.log('Old sessions deleted successfully.');
  } catch (error) {
    console.error('Error deleting old sessions:', error);
  }
};
deleteOldSessions();
setInterval(deleteOldSessions, 24 * 60 * 60 * 1000);
const activitySchema = new mongoose.Schema({
  toEmail: { type: String },
  fileActivities: [
    {
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  voiceActivities: [
    {
      voiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voice' },
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Activity = mongoose.model('Activity', activitySchema);
const deleteOldActivities = async () => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    await Activity.updateMany(
      {},
      {
        $pull: {
          fileActivities: { timestamp: { $lt: fourteenDaysAgo } },
          voiceActivities: { timestamp: { $lt: fourteenDaysAgo } },
        },
      }
    );
    console.log('Old activities deleted successfully.');
  } catch (error) {
    console.error('Error deleting old activities:', error);
  }
};
deleteOldActivities();
setInterval(deleteOldActivities, 24 * 60 * 60 * 1000);
module.exports = { Session, Activity };