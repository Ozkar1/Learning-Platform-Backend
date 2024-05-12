const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/AssignmentController');

router.post('/create', AssignmentController.createAssignment);

// Route to submit an assignment
//router.post('/submit', AssignmentController.submitAssignment);

module.exports = router;