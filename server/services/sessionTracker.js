const { Session } = require("../models/activityModel");
const axios = require("axios");
const getLocationFromIP = async (ip) => {
  try {
    if (!ip || ip.startsWith("192.") || ip.startsWith("10.") || ip === "127.0.0.1" || ip === "::1") {
      return { city: "Local Network", region: "Local Network", country: "Local" };
    }
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const { city = "Unknown City", region = "Unknown Region", country = "Unknown Country" } = response.data;
    
    return { city, region, country };
  } catch (err) {
    console.error("Error getting location:", err);
    return { city: "Unknown City", region: "Unknown Region", country: "Unknown Country" };
  }
};
const sessionTracker = async (userId, req) => {
  try {
    console.log("Session tracker function invoked");
    if (!userId) {
      console.log("No user ID provided");
      return;
    }
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    
    if (ip.includes(",")) ip = ip.split(",")[0];
    ip = ip.replace("::ffff:", "").trim(); 
    console.log("Client IP retrieved:", ip);
    const { city, region, country } = await getLocationFromIP(ip);
    console.log("Location retrieved:", city, region, country);
    const userAgent = req.headers["user-agent"];
    const deviceId = userAgent + ip;
    console.log("Device ID:", deviceId);
    console.log("Creating new session...");
    const newSession = new Session({
      userId,
      ip,
      location: `${city}, ${region}, ${country}`,
      deviceId,
    });
    await newSession.save();
    console.log("New session created:", newSession);
  } catch (err) {
    console.error("Error in session tracker function:", err);
  }
};
module.exports = sessionTracker;