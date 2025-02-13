const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { sendEmail } = require('../email/emailUtils');
const Subscription = require("../models/userSubscriptions");
const { authenticateToken } = require("../routes/userRoutes"); 
const { UserSharedFile, Designee, Userlogin } = require("../models/userModel");
const { File } = require("../models/userUpload");
const Voice = require("../models/uservoiceUpload");
const { decryptField } = require("../utilities/encryptionUtils");
const { decryptvoice } = require("../utilities/voiceencryptionUtils");
const multer = require("multer");
const s3 = require("../config/s3Client");
const fs = require("fs");
const path = require("path"); 
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { encryptField } = require("../utilities/encryptionUtils");
const { frontend_URL, backend_URL } = require('../config/apiConfig');


// const s3 = new S3Client({
//   region: process.env.AWS_REGION, // Your AWS region
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key ID
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret access key
//   },
//   // Adding custom timeout settings
//   requestTimeout: 30000, // Timeout in milliseconds (30 seconds)
//   maxAttempts: 3, // Number of retry attempts
//   retryMode: "standard", // Retry strategy
// });


// router.post("/add-designee", authenticateToken, async (req, res) => {
//   const user_id = req.user.user_id; 
//   const { designeeName, designeePhone, designeeEmail } = req.body;
//   if (!designeeEmail || !designeeName || !designeePhone) {
//     return res.status(400).json({ message: "Designee name, phone, and email are required." });
//   }
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(designeeEmail)) {
//     return res.status(400).json({ message: "Invalid email address format." });
//   }
//   try {
//     // Check if the designee already exists
//     let designee = await Designee.findOne({ email: designeeEmail });
//     // Check if the designee exists in the User schema
//     const user = await Userlogin.findOne({ email: designeeEmail });
//     // Set member field based on whether the user exists in the User schema
//     const memberStatus = user ? true : false;
//     if (!designee) {
//       let otp = Math.floor(100000 + Math.random() * 900000);
//       let body = `Hello ${designeeName}<br/><br/>Please click on the link below for registration with Cumulus.<br/><br/>`;
//       body += `<a href='http://localhost:3001/SharedFiles?email=${designeeEmail}&created_by=${user_id}'>http://localhost:3000/SharedFiles?email=${designeeEmail}&created_by=${user_id}</a>`;
//       body += "<br/>Your OTP is: " + otp;
//       body += "<br/><br/>Thanks<br/>Cumulus Team!";
//       const emailResponse = await sendEmail({
//         to: designeeEmail,
//         subject: "Member Registration Email",
//         body,
//       });
//       if (emailResponse.success) {
  
//         designee = new Designee({
//           from_user_id: [user_id],
//           name: designeeName,
//           phone_number: designeePhone,
//           email: designeeEmail,
//           password: otp, 
//           member: memberStatus, 
//         });
//         await designee.save();
//         return res.status(200).json({
//           message: "Designee created successfully. OTP sent.",
//           previewURL: emailResponse.previewURL,
//         });
//       } else {
//         return res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
//       }
//     } else {
//       if (designee.member) {
     
//         if (!designee.from_user_id.includes(user_id)) {
//           designee.from_user_id.push(user_id);
//         }
//         await designee.save();
//         return res.status(200).json({
//           message: "User ID added to existing designee.",
//           designee,
//         });
//       } else {
       
//         let otp = designee.password; 
//         let body = `Hello ${designeeName}<br/><br/>Please click on the link below for registration with Cumulus.<br/><br/>`;
//         body += `<a href='http://localhost:3000/SharedFiles?email=${designeeEmail}&created_by=${user_id}'>http://localhost:3000/SharedFiles?email=${designeeEmail}&created_by=${user_id}</a>`;
//         body += "<br/>Your OTP is: " + otp;
//         body += "<br/><br/>Thanks<br/>Cumulus Team!";
//         const emailResponse = await sendEmail({
//           to: designeeEmail,
//           subject: "Member Registration Email",
//           body,
//         });
//         if (emailResponse.success) {
          
//           if (!designee.from_user_id.includes(user_id)) {
//             designee.from_user_id.push(user_id);
//           }
//           await designee.save();
//           return res.status(200).json({
//             message: "User ID added to existing designee. OTP sent.",
//             previewURL: emailResponse.previewURL,
//           });
//         } else {
//           return res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error adding designee:", error);
//     res.status(500).json({ message: "Error adding designee.", error: error.message });
//   }
// });
// Ensure the 'uploads' directory exists
const uploadDirectory = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); // Create the 'uploads' directory if it doesn't exist
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Store images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique name
  },
});

const upload = multer({ storage: storage });

router.post("/add-designee", authenticateToken, upload.single("profilePicture"), async (req, res) => {
  const user_id = req.user.user_id;
  const { designeeName, designeePhone, designeeEmail } = req.body;
  const file = req.file;
  if (!designeeEmail || !designeeName || !designeePhone) {
    return res.status(400).json({ message: "Designee name, phone, and email are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(designeeEmail)) {
    return res.status(400).json({ message: "Invalid email address format." });
  }
  try {
    let designee = await Designee.findOne({ email: designeeEmail });
    const user = await Userlogin.findOne({ email: designeeEmail });
    const memberStatus = user ? true : false;
    let aws_file_link = null;
    if (file) {
      // if (!file.path) {
      //   return res.status(400).json({ message: "File path is missing." });
      // }
      const fileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const aws_file_key = `sharedprofilefolder/profilesphoto_shared/${fileName}`;
      aws_file_link = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${aws_file_key}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: aws_file_key,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
        ServerSideEncryption: "AES256",
        ACL: "public-read",
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      aws_file_link = encryptField(aws_file_link);
    }
    if (!designee) {
      let otp = crypto.randomBytes(5).toString('base64') // 5 bytes generate ~7.33 characters in Base64
      .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
      .slice(0, 10); 
      let body = `Hello ${designeeName}<br/><br/>Please click on the link below for registration with Cumulus.<br/><br/>`;
      body += `<a href='${frontend_URL}/SharedFiles?email=${designeeEmail}&created_by=${user_id}'>${frontend_URL}/SharedFiles?email=${designeeEmail}&created_by=${user_id}</a>`;
      body += "<br/>Your OTP is: " + otp;
      body += "<br/><br/>Thanks<br/>Cumulus Team!";
      const emailResponse = await sendEmail({
        to: designeeEmail,
        subject: "Member Registration Email",
        body,
      });
      if (emailResponse.success) {
        const designeeData = {
          from_user_id: [user_id],
          name: designeeName,
          phone_number: designeePhone,
          email: designeeEmail,
          password: otp,
          member: memberStatus,
        };

        if (aws_file_link) {
          designeeData.profile = {
            profilePicture: aws_file_link.encryptedData,
            iv: aws_file_link.iv,
          };
        }
        const newDesignee = new Designee(designeeData);
        await newDesignee.save();
        return res.status(200).json({
          message: "Designee created successfully. OTP sent.",
          previewURL: emailResponse.previewURL,
        });
      } else {
        return res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
      }
    } else {
      if (designee.member) {
        if (!designee.from_user_id.includes(user_id)) {
          designee.from_user_id.push(user_id);
        }
        if (aws_file_link) {
          designee.profile = {
            profilePicture: aws_file_link.encryptedData,
            iv: aws_file_link.iv,
          };
        }
        await designee.save();
        return res.status(200).json({
          message: "User ID added to existing designee.",
          designee,
        });
      } else {
        let otp = designee.password;
        let body = `Hello ${designeeName}<br/><br/>Please click on the link below for registration with Cumulus.<br/><br/>`;
        body += `<a href='${frontend_URL}/SharedFiles?email=${designeeEmail}&created_by=${user_id}'>${frontend_URL}/SharedFiles?email=${designeeEmail}&created_by=${user_id}</a>`;
        body += "<br/>Your OTP is: " + otp;
        body += "<br/><br/>Thanks<br/>Cumulus Team!";
        const emailResponse = await sendEmail({
          to: designeeEmail,
          subject: "Member Registration Email",
          body,
        });
        if (emailResponse.success) {
          if (!designee.from_user_id.includes(user_id)) {
            designee.from_user_id.push(user_id);
          }
          if (aws_file_link) {
            designee.profile = {
              profilePicture: aws_file_link.encryptedData,
              iv: aws_file_link.iv,
            };
          }
          await designee.save();
          return res.status(200).json({
            message: "User ID added to existing designee. OTP sent.",
            previewURL: emailResponse.previewURL,
          });
        } else {
          return res.status(500).json({ message: "Error sending OTP email.", error: emailResponse.error });
        }
      }
    }
  } catch (error) {
    console.error("Error adding designee:", error);
    res.status(500).json({ message: "Error adding designee.", error: error.message });
  }
});




router.post('/nc-designee-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the designee by email
    const designee = await Designee.findOne({ email });
    if (!designee) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Directly compare the entered password with the stored password
    if (designee.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // If successful, return a success message (you can also return a JWT token here)
    res.status(200).json({ message: 'Login successful', designee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.post('/assignments', authenticateToken, async (req, res) => {
//   const user_id = req.user.user_id; // Extract user_id from the decoded token
//   const { file_id, voice_id } = req.body;
//   // Initialize query object to always filter by user_id
//   let query = { from_user_id: user_id };
//   // If file_id is provided, add it to the query
//   if (file_id) {
//     query['files.file_id'] = file_id;
//   }
//   // If voice_id is provided, add it to the query
//   if (voice_id) {
//     query['voices.voice_id'] = voice_id;
//   }
//   // If neither file_id nor voice_id is provided, return a 400 Bad Request
//   if (!file_id && !voice_id) {
//     return res.status(400).json({ message: 'Either file_id or voice_id must be provided' });
//   }
//   try {
//     const userSharedFiles = await UserSharedFile.find(query)
//       .populate('files.file_id')
//       .populate('voices.voice_id');
//     if (userSharedFiles.length === 0) {
//       return res.status(404).json({ message: 'No assignments found for the provided file/voice' });
//     }
//     // Extract unique designee emails
//     const designeeEmails = userSharedFiles.map(sharedFile => sharedFile.to_email_id);
//     // Fetch designee details
//     const designees = await Designee.find({ email: { $in: designeeEmails } });
//     // Add access details to each designee for the specific file/voice
//     const responseData = designees.map(designee => {
//       const sharedFile = userSharedFiles.find(file => file.to_email_id === designee.email);
//       // Find access for the specific file_id or voice_id
//       const fileAccess = sharedFile.files
//         .filter(file => file.file_id && file.file_id._id.toString() === file_id)
//         .map(file => file.access);
//       const voiceAccess = sharedFile.voices
//         .filter(voice => voice.voice_id && voice.voice_id._id.toString() === voice_id)
//         .map(voice => voice.access);
//       return {
//         ...designee.toObject(), // Convert Mongoose document to plain object
//         access: fileAccess.length > 0 ? fileAccess[0] : voiceAccess[0], // Single access for the specific file or voice
//       };
//     });
//     res.status(200).json({
//       status: 'success',
//       data: responseData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



router.post("/share-files", authenticateToken, async (req, res) => {
  const { to_email_id, file_id, access, notify, message  } = req.body; 
  const from_user_id = req.user.user_id; 
  if (!to_email_id || !Array.isArray(to_email_id) || !file_id) {
    return res.status(400).json({ message: "Designee emails (array) and file ID are required." });
  }
  const results = [];
  for (const email of to_email_id) {
    try {
      // Check if the designee exists
      const designee = await Designee.findOne({ email });
      if (!designee) {
        results.push({ email, status: "failed", message: "Designee not found." });
        continue;
      }
      // Check if the user is authorized to share files with the designee
      if (!designee.from_user_id.includes(from_user_id)) {
        results.push({ email, status: "failed", message: "Not authorized to share files with this designee." });
        continue;
      }
      // Check if the file exists
      const fileExists = await File.findById(file_id);
      if (!fileExists) {
        results.push({ email, status: "failed", message: "Invalid file ID." });
        continue;
      }
      // Find or create a UserSharedFile entry
      let userSharedFile = await UserSharedFile.findOne({ from_user_id, to_email_id: email });
      if (!userSharedFile) {
        userSharedFile = new UserSharedFile({
          from_user_id,
          to_email_id: email,
          files: [],
        });
      }
      // Check if the file already exists in the files array
      const existingFile = userSharedFile.files.find(f => f.file_id.toString() === file_id);
      if (existingFile) {
        // Update access if the file already exists
        existingFile.access = access || existingFile.access;
      } else {
        // Add the new file to the files array
        userSharedFile.files.push({ file_id, access });
      }
      // Save the updated or new UserSharedFile
      await userSharedFile.save();
      // Send notification email if requested
      if (notify) {
        const otp = designee.password;
        const body = `
          Hello ${designee.name},<br/><br/>
          ${message ? `Message from the sender: <b>${message}</b><br/><br/>` : ''}
          Please click on the link below to access shared files on Cumulus.<br/><br/>
          <a href='${frontend_URL}/SharedFiles?email=${email}&created_by=${from_user_id}'>
            ${frontend_URL}/SharedFiles?email=${email}&created_by=${from_user_id}
          </a>
          <br/><br/>
          Your OTP is: ${otp}<br/><br/>
          Thanks,<br/>
          Cumulus Team!
        `;
        await sendEmail({
          to: email,
          subject: "File Sharing Invitation",
          body,
        });
        results.push({ email, status: "success", message: "File shared and email sent with OTP." });
      } else {
        results.push({ email, status: "success", message: "File shared successfully. No email sent." });
      }
    } catch (error) {
      console.error(`Error sharing file with ${email}:`, error);
      results.push({ email, status: "failed", message: "Error sharing file or sending email.", error: error.message });
    }
  }
  res.status(200).json({ message: "File sharing process completed.", results });
});


router.post("/share-files", authenticateToken, async (req, res) => {
  const { to_email_id, file_id, access, notify } = req.body; // file_id is now an array
  const from_user_id = req.user.user_id;

  if (!to_email_id || !Array.isArray(to_email_id) || !Array.isArray(file_id) || file_id.length === 0) {
    return res.status(400).json({ message: "Designee emails (array) and file IDs (array) are required." });
  }

  const results = [];

  // Process each email
  for (const email of to_email_id) {
    try {
      // Check if the designee exists
      const designee = await Designee.findOne({ email });
      if (!designee) {
        results.push({ email, status: "failed", message: "Designee not found." });
        continue;
      }

      // Check if the user is authorized to share files with the designee
      if (!designee.from_user_id.includes(from_user_id)) {
        results.push({ email, status: "failed", message: "Not authorized to share files with this designee." });
        continue;
      }

      // Find or create a UserSharedFile entry
      let userSharedFile = await UserSharedFile.findOne({ from_user_id, to_email_id: email });
      if (!userSharedFile) {
        userSharedFile = new UserSharedFile({
          from_user_id,
          to_email_id: email,
          files: [],
        });
      }

      // Process each file_id in the array
     // Process each file_id in the array
     for (const fileId of file_id) {
      try {
        // Convert the file_id to ObjectId
        const fileObjectId = mongoose.Types.ObjectId(fileId); // Convert to ObjectId
    
        console.log(`Checking file ID: ${fileObjectId}`);
    
        // Ensure the file exists in the database
        const fileExists = await File.findById(fileObjectId);
        if (!fileExists) {
          console.log(`File with ID ${fileObjectId} not found.`);
          results.push({ email, file_id: fileId, status: "failed", message: "Invalid file ID." });
          continue;
        }
    
        // Check if the file is already in the shared files array
        const existingFile = userSharedFile.files.find(f => f.file_id.toString() === fileObjectId.toString());
        if (existingFile) {
          console.log(`File ${fileObjectId} already shared. Updating access.`);
          existingFile.access = access || existingFile.access;  // Update access if needed
        } else {
          // File is not shared yet, add it to the shared files array
          console.log(`Adding file ${fileObjectId} to the shared files list.`);
          userSharedFile.files.push({ file_id: fileObjectId, access });
        }
    
        // Push the successful result for each file
        results.push({ email, file_id: fileObjectId, status: "success", message: "File shared successfully." });
      } catch (err) {
        console.error(`Error processing file ID ${fileId}:`, err);
        results.push({ email, file_id: fileId, status: "failed", message: "Error processing file.", error: err.message });
      }
    }
    
    // After the loop, log the final result
    console.log('File sharing results:', results);
    
    
    // After the loop, log the final result
    console.log('File sharing results:', results);
    


      // Save the updated or new UserSharedFile
      await userSharedFile.save();

      // Send notification email if requested
      if (notify) {
        const otp = designee.password;
        const body = `
          Hello ${designee.name},<br/><br/>
          Please click on the link below to access shared files on Cumulus.<br/><br/>
          <a href='${frontend_URL}/SharedFiles?email=${email}&created_by=${from_user_id}'>
            ${frontend_URL}/SharedFiles?email=${email}&created_by=${from_user_id}
          </a>
          <br/><br/>
          Your OTP is: ${otp}<br/><br/>
          Thanks,<br/>
          Cumulus Team!
        `;
        await sendEmail({
          to: email,
          subject: "File Sharing Invitation",
          body,
        });
        results.push({ email, status: "success", message: "Files shared and email sent with OTP." });
      } else {
        results.push({ email, status: "success", message: "Files shared successfully. No email sent." });
      }
    } catch (error) {
      console.error(`Error sharing files with ${email}:`, error);
      results.push({ email, status: "failed", message: "Error sharing files or sending email.", error: error.message });
    }
  }

  res.status(200).json({
    message: "File sharing process completed.",
    results,
  });
});




// API to get shared files for a particular designee (NON CUMULUS USER)
router.post("/get-shared-files-nc", async (req, res) => {
  try {
    const { to_email_id } = req.body;
    if (!to_email_id) {
      return res.status(400).json({ message: "Email is required." });
    }
    const sharedFiles = await UserSharedFile.find({ to_email_id })
      .populate("from_user_id", "username email")
      .populate({
        path: "files.file_id",
        select: "file_name aws_file_link iv_file_name iv_file_link",
      });
    if (!sharedFiles || sharedFiles.length === 0) {
      return res.status(404).json({ message: "No shared files found for this email." });
    }
    const decryptedSharedFiles = sharedFiles.map((sharedFile) => ({
      from_user: {
        username: sharedFile.from_user_id?.username || "Unknown User",
        email: sharedFile.from_user_id?.email || "Unknown Email",
        _id: sharedFile.from_user_id?._id || null,
      },
      created_at: sharedFile.created_at,
      shared_files: sharedFile.files
        .filter((file) => file.file_id) 
        .map((file) => {
          const fileName = decryptField(file.file_id.file_name, file.file_id.iv_file_name);
          const fileLink = decryptField(file.file_id.aws_file_link, file.file_id.iv_file_link);
          return {
            file_id: file.file_id._id,
            file_name: fileName,
            aws_file_link: fileLink,
            iv_file_link: file.file_id.iv_file_link,
            access: file.access,
          };
        }),
    }));
    res.status(200).json({ files: decryptedSharedFiles });
  } catch (error) {
    console.error("Error retrieving shared files:", error);
    res.status(500).json({ message: "Error retrieving shared files.", error: error.message });
  }
});
// API to get shared files for Cumulus user (logged-in user)
// router.post("/get-shared-files-cumulus", authenticateToken, async (req, res) => {
//   try {
//     const from_user_id = req.user.user_id;
//     const user = await Userlogin.findById(from_user_id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }
//     const to_email_id = user.email;
//     const sharedFiles = await UserSharedFile.find({ to_email_id })
//       .populate("from_user_id", "username email")
//       .populate({
//         path: "files.file_id",
//         select: "file_name aws_file_link iv_file_name iv_file_link",
//       });
//     if (!sharedFiles || sharedFiles.length === 0) {
//       return res.status(404).json({ message: "No shared files found for this email." });
//     }
//     const decryptedSharedFiles = sharedFiles.map((sharedFile) => ({
//       from_user: {
//         username: sharedFile.from_user_id?.username || "Unknown User",
//         email: sharedFile.from_user_id?.email || "Unknown Email",
//         _id: sharedFile.from_user_id?._id || null,
//       },
//       created_at: sharedFile.created_at,
//       shared_files: sharedFile.files
//         .filter((file) => file.file_id) // Ensure file_id is not null
//         .map((file) => {
//           const fileName = decryptField(file.file_id.file_name, file.file_id.iv_file_name);
//           const fileLink = decryptField(file.file_id.aws_file_link, file.file_id.iv_file_link);
//           return {
//             file_id: file.file_id._id,
//             file_name: fileName,
//             aws_file_link: fileLink,
//             iv_file_link: file.file_id.iv_file_link,
//             access: file.access,
//           };
//         }),
//     }));
//     res.status(200).json({ decryptedSharedFiles });
//   } catch (error) {
//     console.error("Error retrieving shared files:", error);
//     res.status(500).json({ message: "Error retrieving shared files.", error: error.message });
//   }
// });
router.post("/get", authenticateToken, async (req, res) => {
  // Extract user_id from the authenticated token
  const { user_id } = req.user; // Extract user_id from the authenticated token
console.log("useriddd",user_id);
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Fetch designee data linked to the user_id
    const designees = await Designee.find({ from_user_id: user_id }).populate({
      path: "from_user_id",
      select: "username email",
    });

    if (!designees || designees.length === 0) {
      return res.status(404).json({ message: "No designees found for the specified user." });
    }

    // Optionally fetch shared files for each designee
    const designeeData = await Promise.all(
      designees.map(async (designee) => {
        const sharedFiles = await UserSharedFile.find({ to_email_id: designee.email }).populate({
          path: "file_id",
          select: "filename filetype", // Include necessary file details
        });

        return {
          name: designee.name,
          email: designee.email,
          phone_number: designee.phone_number,
          member: designee.member,
          sharedFiles: sharedFiles.map((file) => ({
            filename: file.file_id.filename,
            filetype: file.file_id.filetype,
            access: file.access,
          })),
        };
      })
    );

    res.status(200).json({
      message: "Designee data retrieved successfully.",
      designeeData,
    });
  } catch (error) {
    console.error("Error fetching designee data:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

router.post("/auth-get", authenticateToken, async (req, res) => {
  const user_id = req.user.user_id;  // Extract user_id from the authenticated token
  console.log("Authenticated User ID:", user_id);

  try {
    
    const designees = await Designee.find({
      from_user_id: user_id,  
    }).populate("from_user_id", "username email") 
      .populate("member");  

    if (!designees || designees.length === 0) {
      return res.status(404).json({ message: "No designees found for the specified user." });
    }


    designees.forEach(designee => {
      if (designee.profile && designee.profile.profilePicture) {
        // Decrypt the profile picture link
        const decryptedLink = decryptField(designee.profile.profilePicture, designee.profile.iv);
        designee.profile.profilePicture = decryptedLink;
      }
    });


    res.status(200).json({
      message: "Designees retrieved successfully.",
      designees,  
    });
  } catch (error) {
    console.error("Error fetching designee data:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});


router.post("/share-voices", authenticateToken, async (req, res) => {
  const { to_email_id, voice_id, access, notify, message  } = req.body; 
  const from_user_id = req.user.user_id; 
  if (!to_email_id || !Array.isArray(to_email_id) || !voice_id) {
    return res.status(400).json({ message: "Designee emails (array) and voice ID are required." });
  }
  const results = [];
  for (const email of to_email_id) {
    try {
      const designee = await Designee.findOne({ email });
      if (!designee) {
        results.push({ email, status: "failed", message: "Designee not found." });
        continue;
      }
      if (!designee.from_user_id.includes(from_user_id)) {
        results.push({ email, status: "failed", message: "Not authorized to share voices with this designee." });
        continue;
      }
      const voiceExists = await Voice.findById(voice_id);
      if (!voiceExists) {
        results.push({ email, status: "failed", message: "Invalid voice ID." });
        continue;
      }
      let userSharedFile = await UserSharedFile.findOne({ from_user_id, to_email_id: email });
      if (!userSharedFile) {
        userSharedFile = new UserSharedFile({
          from_user_id,
          to_email_id: email,
          voices: [],
        });
      }
      const existingVoice = userSharedFile.voices.find(v => v.voice_id.toString() === voice_id);
      if (existingVoice) {
        existingVoice.access = access || existingVoice.access;
      } else {
        userSharedFile.voices.push({ voice_id, access });
      }
      await userSharedFile.save();
      if (notify) {
        const otp = designee.password;
        const body = `
          Hello ${designee.name},<br/><br/>
          ${message ? `Message from the sender: <b>${message}</b><br/><br/>` : ''}
          Please click on the link below to access shared voice memos on Cumulus.<br/><br/>
          <a href='${frontend_URL}/SharedVoices?email=${email}&created_by=${from_user_id}'>
            ${frontend_URL}/SharedVoices?email=${email}&created_by=${from_user_id}
          </a>
          <br/><br/>
          Your OTP is: ${otp}<br/><br/>
          Thanks,<br/>
          Cumulus Team!
        `;
        await sendEmail({
          to: email,
          subject: "Voice Sharing Invitation",
          body,
        });
        results.push({ email, status: "success", message: "Voice memo shared and email sent with OTP." });
      } else {
        results.push({ email, status: "success", message: "Voice memo shared successfully. No email sent." });
      }
    } catch (error) {
      console.error(`Error sharing voice memo with ${email}:`, error);
      results.push({ email, status: "failed", message: "Error sharing voice memo or sending email.", error: error.message });
    }
  }
  res.status(200).json({ message: "Voice sharing process completed.", results });
});

router.post("/get-shared-voices-nc", async (req, res) => {
  try {
    const { to_email_id } = req.body;
    if (!to_email_id) {
      return res.status(400).json({ message: "Email is required." });
    }
    // Fetch shared voices with populated voice details
    const sharedVoices = await UserSharedFile.find({ to_email_id })
      .populate("from_user_id", "username email")
      .populate({
        path: "voices.voice_id",
        select: "voice_name aws_file_link iv_voice_name iv_file_link duration file_size",
      });
    if (!sharedVoices || sharedVoices.length === 0) {
      return res.status(404).json({ message: "No shared voices found for this email." });
    }
    // Map and decrypt the shared voices
    const decryptedSharedVoices = sharedVoices.map((sharedVoice) => ({
      from_user: {
        username: sharedVoice.from_user_id?.username || "Unknown User",
        email: sharedVoice.from_user_id?.email || "Unknown Email",
        _id: sharedVoice.from_user_id?._id || null,
      },
      created_at: sharedVoice.created_at,
      shared_voices: sharedVoice.voices
        .filter((voice) => voice.voice_id) // Ensure voice_id exists
        .map((voice) => {
          const { voice_name, aws_file_link, iv_voice_name, iv_file_link, duration, file_size } =
            voice.voice_id;
          // Check for missing fields
          if (!voice_name || !iv_voice_name || !aws_file_link || !iv_file_link) {
            console.warn("Missing voice details for voice_id:", voice.voice_id._id);
            return null; // Skip this voice entry
          }
          // Decrypt fields
          const decryptedVoiceName = decryptvoice(voice_name, iv_voice_name);
          const decryptedVoiceLink = decryptvoice(aws_file_link, iv_file_link);
          return {
            voice_id: voice.voice_id._id,
            voice_name: decryptedVoiceName,
            aws_file_link: decryptedVoiceLink,
            duration,
            file_size,
            access: voice.access,
          };
        })
        .filter((voice) => voice !== null), // Remove null entries
    }));
    res.status(200).json({ voices: decryptedSharedVoices });
  } catch (error) {
    console.error("Error retrieving shared voices:", error);
    res.status(500).json({ message: "Error retrieving shared voices.", error: error.message });
  }
});

// router.post("/get-shared-voices-cumulus", authenticateToken, async (req, res) => {
//   try {
//     const from_user_id = req.user.user_id;
//     const user = await Userlogin.findById(from_user_id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }
//     const to_email_id = user.email;
//     const sharedVoices = await UserSharedFile.find({ to_email_id })
//       .populate("from_user_id", "username email")
//       .populate({
//         path: "voices.voice_id",
//         select: "voice_name aws_file_link iv_voice_name iv_file_link duration file_size",
//       });
//       if (!sharedVoices || sharedVoices.length === 0) {
//         return res.status(404).json({ message: "No shared voices found for this email." });
//       }
//       const decryptedSharedVoices = sharedVoices.map((sharedVoice) => ({
//         from_user: {
//           username: sharedVoice.from_user_id?.username || "Unknown User",
//           email: sharedVoice.from_user_id?.email || "Unknown Email",
//           _id: sharedVoice.from_user_id?._id || null,
//         },
//         created_at: sharedVoice.created_at,
//         shared_voices: sharedVoice.voices
//           .filter((voice) => voice.voice_id) 
//           .map((voice) => {
//             const { voice_name, aws_file_link, iv_voice_name, iv_file_link, duration, file_size } =
//               voice.voice_id;
  
         
//             if (!voice_name || !iv_voice_name || !aws_file_link || !iv_file_link) {
//               console.warn("Missing voice details for voice_id:", voice.voice_id._id);
//               return null; 
//             }
  
//             const decryptedVoiceName = decryptvoice(voice_name, iv_voice_name);
//             const decryptedVoiceLink = decryptvoice(aws_file_link, iv_file_link);
  
//             return {
//               voice_id: voice.voice_id._id,
//               voice_name: decryptedVoiceName,
//               aws_file_link: decryptedVoiceLink,
//               duration,
//               file_size,
//               access: voice.access,
//             };
//           })
//           .filter((voice) => voice !== null), // Remove null entries
//       }));
  
//       res.status(200).json({ voices: decryptedSharedVoices });
//   } catch (error) {
//     console.error("Error retrieving shared voices:", error);
//     res.status(500).json({ message: "Error retrieving shared voices.", error: error.message });
//   }
// });




router.post('/update-access', authenticateToken, async (req, res) => {
  const from_user_id = req.user.user_id;
  const { to_email_id, edit_access, file_id, voice_id } = req.body;

  if (!to_email_id || !edit_access) {
    return res.status(400).json({ message: 'to_email_id and edit_access are required.' });
  }

  try {
    const sharedRecord = await UserSharedFile.findOne({ from_user_id, to_email_id });

    if (!sharedRecord) {
      return res.status(404).json({ message: 'Shared record not found for the specified user and email.' });
    }

    let itemUpdated = false;

    if (!file_id && !voice_id) {
      sharedRecord.files.forEach(file => {
        file.access = edit_access;
      });
      sharedRecord.voices.forEach(voice => {
        voice.access = edit_access;
      });
      itemUpdated = true;
    } else {
      if (file_id) {
        const file = sharedRecord.files.find(f => f.file_id.toString() === file_id);
        if (file) {
          file.access = edit_access;
          itemUpdated = true;
        }
      }
      if (voice_id) {
        const voice = sharedRecord.voices.find(v => v.voice_id.toString() === voice_id);
        if (voice) {
          voice.access = edit_access;
          itemUpdated = true;
        }
      }
    }

    if (!itemUpdated) {
      return res.status(404).json({ message: 'Specified file_id or voice_id not found in the shared record.' });
    }

    await sharedRecord.save();

    res.status(200).json({ message: 'Access level updated successfully.' });
  } catch (error) {
    console.error('Error updating access level:', error);
    res.status(500).json({ message: 'An error occurred while updating access level.', error: error.message });
  }
});


router.post("/get-shared-cumulus", authenticateToken, async (req, res) => {
  try {
    const from_user_id = req.user.user_id;
    const user = await Userlogin.findById(from_user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const to_email_id = user.email;

    // Fetch shared files
    const sharedFiles = await UserSharedFile.find({ to_email_id })
      .populate("from_user_id", "username email")
      .populate({
        path: "files.file_id",
        select: "file_name aws_file_link iv_file_name iv_file_link",
      });

    // Decrypt shared files
    const decryptedSharedFiles = sharedFiles.map((sharedFile) => ({
      from_user: {
        username: sharedFile.from_user_id?.username || "Unknown User",
        email: sharedFile.from_user_id?.email || "Unknown Email",
        _id: sharedFile.from_user_id?._id || null,
      },
      created_at: sharedFile.created_at,
      shared_files: sharedFile.files
        .filter((file) => file.file_id) // Ensure file_id is not null
        .map((file) => {
          const fileName = decryptField(file.file_id.file_name, file.file_id.iv_file_name);
          const fileLink = decryptField(file.file_id.aws_file_link, file.file_id.iv_file_link);
          return {
            file_id: file.file_id._id,
            file_name: fileName,
            aws_file_link: fileLink,
            iv_file_link: file.file_id.iv_file_link,
            access: file.access,
          };
        }),
    }));

    // Fetch shared voices
    const sharedVoices = await UserSharedFile.find({ to_email_id })
      .populate("from_user_id", "username email")
      .populate({
        path: "voices.voice_id",
        select: "voice_name aws_file_link iv_voice_name iv_file_link duration file_size",
      });

    // Decrypt shared voices
    const decryptedSharedVoices = sharedVoices.map((sharedVoice) => ({
      from_user: {
        username: sharedVoice.from_user_id?.username || "Unknown User",
        email: sharedVoice.from_user_id?.email || "Unknown Email",
        _id: sharedVoice.from_user_id?._id || null,
      },
      created_at: sharedVoice.created_at,
      shared_voices: sharedVoice.voices
        .filter((voice) => voice.voice_id) // Ensure voice_id is not null
        .map((voice) => {
          const {
            voice_name,
            aws_file_link,
            iv_voice_name,
            iv_file_link,
            duration,
            file_size,
          } = voice.voice_id;

          if (!voice_name || !iv_voice_name || !aws_file_link || !iv_file_link) {
            console.warn("Missing voice details for voice_id:", voice.voice_id._id);
            return null;
          }

          const decryptedVoiceName = decryptvoice(voice_name, iv_voice_name);
          const decryptedVoiceLink = decryptvoice(aws_file_link, iv_file_link);

          return {
            voice_id: voice.voice_id._id,
            voice_name: decryptedVoiceName,
            aws_file_link: decryptedVoiceLink,
            duration,
            file_size,
            access: voice.access,
          };
        })
        .filter((voice) => voice !== null), // Remove null entries
    }));

    res.status(200).json({
      files: decryptedSharedFiles,
      voices: decryptedSharedVoices,
    });
  } catch (error) {
    console.error("Error retrieving shared data:", error);
    res.status(500).json({
      message: "Error retrieving shared data.",
      error: error.message,
    });
  }
});



router.get('/getting-all-shared-files', authenticateToken, async (req, res) => {
  try {
    const from_user_id = req.user.user_id;
    // 1. Find all designees where the from_user_id matches
    const designees = await Designee.find({ from_user_id });
    // 2. Find all shared files where the from_user_id matches
    const sharedFiles = await UserSharedFile.find({ from_user_id })
      .populate('files.file_id', null, null, { retainNullValues: true })
      .populate('voices.voice_id', null, null, { retainNullValues: true });
    // 3. Map through all designees and get shared files for each
    const result = await Promise.all(designees.map(async (designee) => {
      // Find shared files for this designee
      const sharedFile = sharedFiles.find(file => file.to_email_id === designee.email);
      // If no shared files exist, create an empty file and voice array
      if (!sharedFile) {
        return {
          to_email_id: designee.email,
          files: [],
          voices: [],
          designee: {
            name: designee.name,
            phone_number: designee.phone_number,
            profile_picture: designee.profile.profilePicture
              ? decryptField(designee.profile.profilePicture, designee.profile.iv)
              : null,
          }
        };
      }
      // Map shared files and voices
      return {
        to_email_id: sharedFile.to_email_id,
        files: sharedFile.files.map(file => ({
          file_id: file.file_id ? file.file_id._id : null, 
          file_name: file.file_id ? decryptField(file.file_id.file_name, file.file_id.iv_file_name) : null, 
          aws_file_link: file.file_id ? decryptField(file.file_id.aws_file_link, file.file_id.iv_file_link) : null, 
          access: file.access,
        })),
        voices: sharedFile.voices.map(voice => ({
          voice_id: voice.voice_id ? voice.voice_id._id : null,
          voice_name: voice.voice_id ? decryptvoice(voice.voice_id.voice_name, voice.voice_id.iv_voice_name) : null,
          aws_file_link: voice.voice_id ? decryptvoice(voice.voice_id.aws_file_link, voice.voice_id.iv_file_link) : null,  
          access: voice.access,
        })),
        designee: {
          name: designee.name,
          phone_number: designee.phone_number,
          profile_picture: designee.profile.profilePicture 
            ? decryptField(designee.profile.profilePicture, designee.profile.iv) 
            : null,
        },
      };
    }));
    // Return the final result
    res.json(result);
  } catch (err) {
    console.error('Error retrieving shared files:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/assignments', authenticateToken, async (req, res) => {
  const user_id = req.user.user_id; // Extract user_id from the decoded token
  const { file_id, voice_id } = req.body;

  // Initialize query object to always filter by user_id
  let query = { from_user_id: user_id };

  // If file_id is provided, add it to the query
  if (file_id) {
    query['files.file_id'] = file_id;
  }

  // If voice_id is provided, add it to the query
  if (voice_id) {
    query['voices.voice_id'] = voice_id;
  }

  // If neither file_id nor voice_id is provided, return a 400 Bad Request
  if (!file_id && !voice_id) {
    return res.status(400).json({ message: 'Either file_id or voice_id must be provided' });
  }

  try {
    const userSharedFiles = await UserSharedFile.find(query)
      .populate('files.file_id')
      .populate('voices.voice_id');

    if (userSharedFiles.length === 0) {
      return res.status(404).json({ message: 'No assignments found for the provided file/voice' });
    }

    // Extract unique designee emails
    const designeeEmails = userSharedFiles.map(sharedFile => sharedFile.to_email_id);

    // Fetch designee details
    const designees = await Designee.find({ email: { $in: designeeEmails } });

    // Add access details to each designee for the specific file/voice
    const responseData = designees.map(designee => {
      const sharedFile = userSharedFiles.find(file => file.to_email_id === designee.email);

      // Find access for the specific file_id or voice_id
      const fileAccess = sharedFile.files
        .filter(file => file.file_id && file.file_id._id.toString() === file_id)
        .map(file => file.access);

      const voiceAccess = sharedFile.voices
        .filter(voice => voice.voice_id && voice.voice_id._id.toString() === voice_id)
        .map(voice => voice.access);

      return {
        ...designee.toObject(), // Convert Mongoose document to plain object
        access: fileAccess.length > 0 ? fileAccess[0] : voiceAccess[0], // Single access for the specific file or voice
      };
    });

    res.status(200).json({
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





router.delete("/delete-shared-data", authenticateToken, async (req, res) => {
  try {
    const from_user_id = req.user.user_id;
    const { to_email_id } = req.body; 

    if (!to_email_id) {
      return res.status(400).json({ message: "to_email_id is required." });
    }

    const result = await UserSharedFile.deleteMany({ from_user_id, to_email_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No shared data found for the specified criteria." });
    }

    res.status(200).json({ message: "Shared data deleted successfully." });
  } catch (error) {
    console.error("Error deleting shared data:", error);
    res.status(500).json({
      message: "Error deleting shared data.",
      error: error.message,
    });
  }
});





router.delete("/delete-voice-file-data", authenticateToken, async (req, res) => {
  try {
    const from_user_id = req.user.user_id;
    const { to_email_id, file_id, voice_id } = req.body; 

    if (!to_email_id) {
      return res.status(400).json({ message: "to_email_id is required." });
    }

    const sharedRecord = await UserSharedFile.findOne({ from_user_id, to_email_id });

    if (!sharedRecord) {
      return res.status(404).json({ message: "Shared data not found for the specified user and email." });
    }

    // Deleting file if file_id is provided
    if (file_id) {
      const fileIndex = sharedRecord.files.findIndex(file => file.file_id.toString() === file_id);
      if (fileIndex !== -1) {
        sharedRecord.files.splice(fileIndex, 1); // Remove the file from the array
      } else {
        return res.status(404).json({ message: "File not found in the shared data." });
      }
    }

    // Deleting voice if voice_id is provided
    if (voice_id) {
      const voiceIndex = sharedRecord.voices.findIndex(voice => voice.voice_id.toString() === voice_id);
      if (voiceIndex !== -1) {
        sharedRecord.voices.splice(voiceIndex, 1); // Remove the voice from the array
      } else {
        return res.status(404).json({ message: "Voice not found in the shared data." });
      }
    }

    // Save the updated shared data
    await sharedRecord.save();

    res.status(200).json({ message: "Shared file or voice deleted successfully." });
  } catch (error) {
    console.error("Error deleting shared data:", error);
    res.status(500).json({
      message: "Error deleting shared data.",
      error: error.message,
    });
  }
});

module.exports = router;
