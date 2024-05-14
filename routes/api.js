var express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
var router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');



router.get('/profile', authenticateToken, async (req, res) => {
  const { UserID } = req.user; 
  const user = await User.findByPk(UserID);
  if (!user) {
      return res.status(404).send('User not found');
  }
  res.json({ FirstName: user.FirstName, LastName: user. LastName, role: user.Role });
});

module.exports = router;