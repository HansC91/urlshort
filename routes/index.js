const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const nanoid = require('nanoid');
const Url = require('../models/url');
const Counter = require('../models/counter');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST create short URL
router.post('/', async (req, res) => {
  const { url } = req.body;

  // Validate URL
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ msg: 'Invalid URL' });
  }

  try {
    // Check if URL already exists in database
    let dbUrl = await Url.findOne({ url });

    if (dbUrl) {
      res.json({ hash: dbUrl.hash});
    } else {
      // Create short URL
      const shortId =  nanoid(7);
      const shortUrl = `http://localhost:3000/\${shortId}`;
      console.log(shortId);

      dbUrl = new Url({
        url,
        shortUrl,
        urlCode: shortId,
        date: new Date()
      });

      await dbUrl.save();

      res.json(dbUrl);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Test MongoDB connection
router.get('/test', async (req, res) => {
  try {
    // Check if we can connect to MongoDB
    await Counter.findOne();

    res.json({ msg: 'MongoDB connection successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'MongoDB connection error' });
  }
});

module.exports = router;
