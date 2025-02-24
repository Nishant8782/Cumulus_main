const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Session, Activity } = require('../models/activityModel'); // Adjust the path accordingly
const { File } = require("../models/userUpload");
const Voice = require("../models/uservoiceUpload");
const { authenticateToken } = require("../routes/userRoutes");

const router = express.Router();

// API to fetch session and related activity details
// API to fetch all session history and related activity details
router.get('/history-details', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id; // Extracted from token via middleware
        // Fetch all sessions for the user
        const sessions = await Session.find({ userId });
        // Fetch all activity logs
        const activities = await Activity.find({});
        // Store merged data in a single array
        let history = [];
        // Add session details to the history array
        sessions.forEach(session => {
            history.push({
                type: 'session',
                userId: session.userId,
                ip: session.ip,
                location: session.location,
                country: session.country,
                deviceId: session.deviceId,
                createdAt: session.createdAt, // Used for sorting
                lastActivityAt: session.lastActivityAt
            });
        });
        // Extract all unique fileIds and voiceIds from activities
        const fileIds = new Set();
        const voiceIds = new Set();
        activities.forEach(activity => {
            activity.fileActivities.forEach(fa => fileIds.add(fa.fileId.toString()));
            activity.voiceActivities.forEach(va => voiceIds.add(va.voiceId.toString()));
        });
        // Fetch existing files & voices
        const userFiles = await File.find({ _id: { $in: Array.from(fileIds) }, user_id: userId });
        const userVoices = await Voice.find({ _id: { $in: Array.from(voiceIds) }, user_id: userId });
        const userFileIds = new Set(userFiles.map(file => file._id.toString()));
        const userVoiceIds = new Set(userVoices.map(voice => voice._id.toString()));
        // 🔹 Allow deleted file/voice activities to be shown
        activities.forEach(activity => {
            let validFileActivities = activity.fileActivities.map(fa => ({
                fileId: fa.fileId,
                action: fa.action,
                timestamp: fa.timestamp,
                toEmail: activity.toEmail,
                deleted: !userFileIds.has(fa.fileId.toString()) // 🔹 Mark as deleted if file not found
            }));
            let validVoiceActivities = activity.voiceActivities.map(va => ({
                voiceId: va.voiceId,
                action: va.action,
                timestamp: va.timestamp,
                toEmail: activity.toEmail,
                deleted: !userVoiceIds.has(va.voiceId.toString()) // 🔹 Mark as deleted if voice not found
            }));
            if (validFileActivities.length > 0 || validVoiceActivities.length > 0) {
                history.push({
                    type: 'activity',
                    fileActivities: validFileActivities,
                    voiceActivities: validVoiceActivities,
                    createdAt: activity.createdAt // Used for sorting
                });
            }
        });
        // Sort the merged history array by createdAt (latest first)
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.json({ history });
    } catch (error) {
        console.error('Error fetching session and activity history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post("/activity-details", async (req, res) => {
    try {
      const { fileId, voiceId } = req.body;
  
      if (!fileId && !voiceId) {
        return res.status(400).json({ message: "Either fileId or voiceId is required" });
      }
  
      let query = {};
      if (fileId && voiceId) {
        query = {
          $or: [
            { "fileActivities.fileId": new mongoose.Types.ObjectId(fileId) },
            { "voiceActivities.voiceId": new mongoose.Types.ObjectId(voiceId) },
          ],
        };
      } else if (fileId) {
        query = { "fileActivities.fileId": new mongoose.Types.ObjectId(fileId) };
      } else if (voiceId) {
        query = { "voiceActivities.voiceId": new mongoose.Types.ObjectId(voiceId) };
      }
  
      let activityDetails = await Activity.find(query)
        .populate({
          path: "fileActivities.fileId",
          model: "File",
          select: "-iv_file_name -iv_file_link -iv_aws_file_link",
        })
        .populate({
          path: "voiceActivities.voiceId",
          model: "Voice",
          select: "-iv_voice_name",
        })
        .select("toEmail fileActivities voiceActivities")
        .lean();
  
      if (!activityDetails.length) {
        return res.status(404).json({ message: "No activity found for the given ID(s)" });
      }
      let fileDetails = null;
      let voiceDetails = null;
      let activities = [];
  
activityDetails.forEach(activity => {
  if (fileId) {
    activity.fileActivities.forEach(fileActivity => {
      if (fileActivity.fileId && fileActivity.fileId._id.toString() === fileId) {
        const file = fileActivity.fileId;
        fileDetails = {
          ...file,
          file_name: file.file_name && file.iv_file_name ? decryptField(file.file_name, file.iv_file_name) : file.file_name,
          aws_file_link: file.aws_file_link && file.iv_file_link ? decryptField(file.aws_file_link, file.iv_file_link) : file.aws_file_link,
        };
        activities.push({
          userEmail: activity.toEmail,
          action: fileActivity.action,
          timestamp: fileActivity.timestamp,
          type: "file",
        });
      }
    });
  }
  if (voiceId) {
    activity.voiceActivities.forEach(voiceActivity => {
      if (voiceActivity.voiceId && voiceActivity.voiceId._id.toString() === voiceId) {
        voiceDetails = voiceActivity.voiceId;
        activities.push({
          userEmail: activity.toEmail,
          action: voiceActivity.action,
          timestamp: voiceActivity.timestamp,
          type: "voice",
        });
      }
    });
  }
});
  
      if (!fileDetails && !voiceDetails) {
        return res.status(404).json({ message: "No details found for the given file/voice ID(s)" });
      }
  
      res.status(200).json({
        fileDetails,
        voiceDetails, 
        activities,
      });
  
    } catch (error) {
      console.error("Error fetching activity details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


module.exports = router;
