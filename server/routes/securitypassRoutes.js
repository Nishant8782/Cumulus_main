const express = require("express");
const { Userlogin } = require("../models/userModel");
const { authenticateToken } = require("../routes/userRoutes"); 
const router = express.Router();


router.get("/check-social-pass", authenticateToken, async (req, res) => {
    try {
      const user = await Userlogin.findById(req.user.user_id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      return res.status(200).json({ 
        socialSecurityPassExists: !!user.socialSecurityPass 
      });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.post("/set-social-info", authenticateToken, async (req, res) => {
    try {
      const { socialSecurityPass, socialSecurityNumber, homeAddress } = req.body;
  
      if (!socialSecurityPass && (!socialSecurityNumber || !homeAddress)) {
        return res.status(400).json({ message: "Provide at least one required field" });
      }
  
      const user = await Userlogin.findById(req.user.user_id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Step 1: Set social security password if provided
      if (socialSecurityPass) {
        if (user.socialSecurityPass) {
          return res.status(400).json({ message: "Password is already set" });
        }
        user.socialSecurityPass = socialSecurityPass;
      }
  
      // Step 2: Set social security details if provided
      if (socialSecurityNumber && homeAddress) {
        if (!user.socialSecurityPass) {
          return res.status(400).json({ message: "Set password first" });
        }
        user.socialSecurityNumber = socialSecurityNumber;
        user.homeAddress = homeAddress;
      }
  
      await user.save();
      return res.status(200).json({ message: "Social info updated successfully" });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

  router.post("/verify-social-pass", authenticateToken, async (req, res) => {
      try {
        const { socialSecurityPass } = req.body;
        const user = await Userlogin.findById(req.user.user_id);
    
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.socialSecurityPass) return res.status(400).json({ message: "No social security password found" });
    
        if (user.socialSecurityPass !== socialSecurityPass) {
          return res.status(401).json({ message: "Incorrect password" });
        }
    
        return res.status(200).json({ message: "Password verified. You can now update details." });
    
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
  });

  
router.post("/update-social-details", authenticateToken, async (req, res) => {
    try {
      const { socialSecurityNumber, homeAddress } = req.body;
      const user = await Userlogin.findById(req.user.user_id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (socialSecurityNumber) user.socialSecurityNumber = socialSecurityNumber;
      if (homeAddress) user.homeAddress = homeAddress;
  
      await user.save();
      return res.status(200).json({ message: "Details updated successfully" });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // GET User's SSN and Home Address (Protected Route)
router.get("/user/details", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // Extracted from authMiddleware

    // Find the user and select only necessary fields
    const user = await Userlogin.findById(userId, "socialSecurityNumber homeAddress");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      socialSecurityNumber: user.socialSecurityNumber,
      homeAddress: user.homeAddress,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  
module.exports = router;