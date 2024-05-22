const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || '35edfa8e50a7dc05da523cb3bbe99b7e1ee4852adc6532a458bdfd2361a8c1e9';

function generateToken(userId) {
  return jwt.sign({ UserID: userId }, JWT_SECRET, { expiresIn: '1h' });
}

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Username, Password } = req.body;
    const user = await User.findOne({ where: { Username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.UserID);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        UserID: user.UserID,
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Role: user.Role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Username, Email, FirstName, LastName, Password, ProfilePictureURL, Role } = req.body;

    const existingUser = await User.findOne({ where: { [Op.or]: [{ Email }, { Username }] } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username.' });
    }

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
      message: 'User created successfully',
      user: {
        id: user.UserID,
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
};
