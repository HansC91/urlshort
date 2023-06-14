const express = require('express');
const router = express.Router();
const Url = require('../models/url');

router.get('/', async (req, res) => {
  res.render()
})

router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      res.json({ url, clicks: url.clicks });
    } else {
      return res.status(404).json({ msg: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;