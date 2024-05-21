const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.post('/login', [
  body('Username').notEmpty().withMessage('Username is required'),
  body('Password').notEmpty().withMessage('Password is required')
], AuthController.login);

router.post('/register', [
  body('Username')
    .isLength({ min: 3 })
    .withMessage('Username is required'),
  body('Email')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(), 
  body('FirstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('LastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('Password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('Role')
    .isIn(['student', 'teacher'])
    .withMessage('Role must be either student or teacher')
], AuthController.register);

module.exports = router;
