const mongoose = require("mongoose");

const NomineeSchema = new mongoose.Schema({
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to_email_id: { 
    type: String, 
    required: true, 
    ref: "Designee" 
  }, 
  files: [{ 
      file_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "File", 
        required: true 
      },
      access: { 
        type: String, 
        default: null
      }
    }],
    voices: [
      {
        voice_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Voice",
          required: true,
        },
        access: {
          type: String,
          default: null,
        },
      },
    ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Nominee", NomineeSchema);
