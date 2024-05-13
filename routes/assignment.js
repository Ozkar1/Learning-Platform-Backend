const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/AssignmentController');
const authenticateToken = require('../middleware/authenticateToken');



router.use(authenticateToken);

//Create assignment
router.post('/create', AssignmentController.createAssignment);

// Delete assignment
router.delete('/delete/:assignmentID', AssignmentController.deleteAssignment);

// Get assignments in classroom
router.get('/:classroomID', AssignmentController.getAssignmentsForClassroom)

// Route to submit an assignment
router.post('/submit', AssignmentController.submitAssignment);
// Route to submit an assignment
//router.post('/submit', AssignmentController.submitAssignment);

module.exports = router;