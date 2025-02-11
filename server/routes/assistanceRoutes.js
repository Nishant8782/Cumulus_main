const express = require("express");
const router = express.Router();
const Query = require("../models/assistanceModel");

router.post('/queries', async (req, res) => {
    try {
   
      const newQuery = new Query({
        username: req.body.username,
        email: req.body.email,
        selectQuery: req.body.selectQuery,
        describeQuery: req.body.describeQuery,
      });
  
    
      const savedQuery = await newQuery.save();
      res.status(201).json({
        message: 'Query submitted successfully',
        query: savedQuery,
      });
    } catch (err) {
 
      res.status(400).json({
        message: 'Error submitting query',
        error: err.message,
      });
    }
  });


module.exports = router;
