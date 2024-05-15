const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkTeacher = require('../middleware/checkTeacher');
const validateClassroomData = require('../middleware/validateClassroomData');
const ClassroomController = require('../controllers/ClassroomController');
const { Classroom, UserClassroom, User } = require('../models');  // Adjust paths as necessary

//Apply JWT authentication to all classroom routes.
router.use(authenticateToken);

//Create a new classroom (Teachers only)
router.post('/create', validateClassroomData, ClassroomController.createClassroom);

//Delete classroom
router.delete('/delete/:id', ClassroomController.deleteClassroom);

//Get the students classrooms
router.get('/student', ClassroomController.getClassroomsForStudent)


//Get teachers classrooms.
router.get('/teacher', ClassroomController.getClassroomsForTeacher)

//Enroll student into classroom
router.post('/enroll', ClassroomController.enrollInClassroom)

router.post('/leave', ClassroomController.leaveClassroom)
  

module.exports = router;