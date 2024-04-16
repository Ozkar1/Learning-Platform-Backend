var express = require('express');
var router = express.Router();

// GET home page
router.get('/data', function(req, res, next) {
  res.json({ message: 'Hello from your Express API!', data: [1, 2, 3, 4] });
});

// POST data and echo back
router.post('/data', function(req, res, next) {
  res.status(201).json({ success: true, data: req.body });
});

module.exports = router;