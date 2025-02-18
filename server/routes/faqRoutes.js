const express = require('express');
const router = express.Router();
const FAQTopic = require('../models/faqModel'); 

//adding topics
router.post('/faq/add-topics', async (req, res) => {
    try {
      const { topic } = req.body;
  
 
      if (!topic) {
        return res.status(400).json({
          message: 'Topic name is required',
        });
      }
      const newTopic = new FAQTopic({
        topic,
        questions: [], 
      });

      const savedTopic = await newTopic.save();

      res.status(201).json({
        message: 'Topic added successfully',
        topic: savedTopic,
      });
    } catch (err) {
      res.status(400).json({
        message: 'Error adding topic',
        error: err.message,
      });
    }
  });
  


// Add questions and answers to an existing topic
router.post('/faq/topics/add-questions', async (req, res) => {
    try {
      const { topic_id, question, answer } = req.body;
  
      if (!topic_id || !question || !answer) {
        return res.status(400).json({
          message: 'Topic ID, question, and answer are required',
        });
      }

      const topic = await FAQTopic.findById(topic_id);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      topic.questions.push({ question, answer });
      const updatedTopic = await topic.save();
  
      res.status(200).json({
        message: 'Question added successfully',
        topic: updatedTopic,
      });
    } catch (err) {
      res.status(400).json({
        message: 'Error adding question',
        error: err.message,
      });
    }
  });
  
// Get all topics
router.get('/faq/topics', async (req, res) => {
    try {
      const topics = await FAQTopic.find({}, 'topic _id'); 
      res.status(200).json({
        message: 'Topics fetched successfully',
        topics,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error fetching topics',
        error: err.message,
      });
    }
  });

  
  // Get questions and answers for a specific topic
router.post('/faq/topics/questions', async (req, res) => {
    try {
      const { topic_id } = req.body;
  
      if (!topic_id) {
        return res.status(400).json({
          message: 'Topic ID is required',
        });
      }
  
      const topic = await FAQTopic.findById(topic_id, 'topic questions');
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
  
      res.status(200).json({
        message: 'Questions and answers fetched successfully',
        topic,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error fetching questions and answers',
        error: err.message,
      });
    }
  });


  module.exports = router;