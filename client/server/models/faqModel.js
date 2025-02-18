const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
  },
});


const faqTopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Topic name is required'],
    unique: true,
    trim: true,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FAQTopic = mongoose.model('FAQTopic', faqTopicSchema);

module.exports = FAQTopic;
