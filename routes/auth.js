const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { Op } = require('sequelize');


router.post('/login', async (req, res) => {
  try {
      const { Username, Password } = req.body;
      const user = await User.findOne({ where: { Username } });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id); // Generate JWT
      res.json({ token, user: { id: user.id, Username: user.Username, Role: user.Role } });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  const { Username, Email, FirstName, LastName, Password, ProfilePictureURL, Role } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ where: {
      [Op.or]: [{ Email }, { Username }]
    }
  });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create new user
    const user = await User.create({
      Username,
      Email,
      FirstName,
      LastName,
      Password,
      ProfilePictureURL,
      Role
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        Username: user.Username,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Role: user.Role,
        ProfilePictureURL: user.ProfilePictureURL
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
