const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkTeacher = require('../middleware/checkTeacher');
const validateClassroomData = require('../middleware/validateClassroomData');
const ClassroomController = require('../controllers/ClassroomController');
const { Classroom, UserClassroom, User } = require('../models');  // Adjust paths as necessary

//Apply JWT authentication to all classroom routes.
router.use(authenticateToken);

// POST route to create a new classroom
router.post('/create', checkTeacher, validateClassroomData, ClassroomController.createClassroom);

router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const studentClassrooms = await UserClassroom.findAll({
        where: { UserID: studentId },
        include: [{
          model: Classroom,
          include: [{
            model: User,
            as: 'Owner',  // This depends on how you have defined the alias in your model associations
            attributes: ['Username', 'Email']  // You can adjust which attributes to show
          }]
        }]
      });
  
      const classrooms = studentClassrooms.map(uc => uc.Classroom);
      res.status(200).json(classrooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching classrooms: ' + error.message });
    }
  });

  router.get('/teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
  
    try {
      const classrooms = await Classroom.findAll({
        where: { OwnerID: teacherId },
        include: [{
          model: User,
          as: 'Owner',
          attributes: ['Username', 'Email']  // Adjust attributes as needed
        }]
      });
  
      res.status(200).json(classrooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching classrooms: ' + error.message });
    }
  });

  router.post('/enroll', async (req, res) => {
    const { userID, joinCode } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findByPk(userID);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the classroom with the provided JoinCode
      const classroom = await Classroom.findOne({ where: { JoinCode: joinCode } });
      if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found with provided join code.' });
      }
  
      // Check if the user is already enrolled
      const isEnrolled = await UserClassroom.findOne({
        where: {
          UserID: userID,
          ClassroomID: classroom.ClassroomID
        }
      });
      if (isEnrolled) {
        return res.status(409).json({ message: 'User is already enrolled in this classroom.' });
      }
  
      // Enroll the user in the classroom
      const enrollment = await UserClassroom.create({
        UserID: userID,
        ClassroomID: classroom.ClassroomID
      });
  
      res.status(201).json({
        message: 'Enrollment successful',
        classroom: {
          ClassroomID: classroom.ClassroomID,
          ClassroomName: classroom.ClassroomName,
          Description: classroom.Description
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling user: ' + error.message });
    }
  });
  
  

module.exports = router;