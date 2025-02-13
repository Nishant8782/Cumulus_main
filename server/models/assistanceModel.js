const mongoose = require('mongoose');


const querySchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    validate: {
      validator: function (value) {
       
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please enter a valid email address',
    },
  },
  selectQuery: {
    type: String,
    required: [true, 'Please select a query type'],
    enum: {
      values: ['Support', 'Sales', 'General Questions'],
      message: '{VALUE} is not a valid query type',
    },
  },
  describeQuery: {
    type: String,
    required: [true, 'Please describe your query'],
 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Query = mongoose.model('Query', querySchema);

module.exports = Query;
