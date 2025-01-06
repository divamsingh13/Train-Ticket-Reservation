// routes/contact.js

const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/contactquery.js');

// Endpoint to save contact queries
router.post('/submit-query', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Validate input data
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Save query to the database
    const newQuery = new ContactQuery({ name, email, message });
    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact query:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
