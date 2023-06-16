const express = require('express');
const router = express.Router();
const Url = require('../models/url');

router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      res.render('statscode', { title: 'Short URL Stats', url: url });
    } else {
      return res.status(404).json({ msg: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  res.render('stats', { title: 'Short URL Stats' })
})


module.exports = router;