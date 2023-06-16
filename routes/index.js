const express = require('express');
const router = express.Router();
const nanoid = require('nanoid');
const Url = require('../models/url');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'URL Shortener' });
});

// GET shortened url.
router.get('/shorten', function(req, res, next) {
  res.render('shorten-form', { title: 'URL Shortener' });
});

// POST create short URL
router.post('/shorten', async (req, res) => {
  const { url } = req.body;

  // Validate URL
  const urlregcheck = /^(https:\/\/|http:\/\/)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{1,5}(?:\/[a-zA-Z0-9-\/]+)?$/
  if (!urlregcheck.test(url)) {
    return res.status(400).json({ msg: 'Invalid URL' });
  }

  try {
    // Check if URL allready exists in database
    let dbUrl = await Url.findOne({ url });

    if (dbUrl) {
      return res.render( 'shorten', { shortUrl: dbUrl.shortUrl});
    } else {
      // Create short URL
      const shortId =  nanoid(7);
      const shortUrl = `${process.env.BASE_URL}/${shortId}`;
      console.log(shortId);
      console.log(shortUrl);

      dbUrl = new Url({
        url: url,
        shortUrl: shortUrl,
        urlCode: shortId,
        date: new Date()
      });

      await dbUrl.save();

      res.render('shorten', { shortUrl:  dbUrl.shortUrl });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error2' });
  }
});


module.exports = router;
