const { generateJoinCode } = require('../utils');
//const Classroom = require('../models/Classroom');
const { User, UserClassroom, Classroom } = require('../models/index');

exports.createClassroom = async (req, res) => {
    try {
        const { ClassroomName, Description } = req.body;
        const OwnerID = req.user.UserID; // Assuming the JWT includes UserID
        
        let isUnique = false;
        let JoinCode;
        while (!isUnique) {
            JoinCode = generateJoinCode();
            console.log("Generated Join Code:", JoinCode); // Add this line
            // Check if join code already exists
            const codeExists = await Classroom.findOne({ where: { JoinCode } });
            if (!codeExists) {
                isUnique = true;
            }
        }

        const newClassroom = await Classroom.create({
            OwnerID,
            ClassroomName,
            Description,
            JoinCode
        });
        res.status(201).send(newClassroom);
    } catch (error) {
        console.error("Error creating classroom:", error);
        res.status(500).send('Server error: ' + error.message);
    }
};

exports.deleteClassroom = async (req, res) => {
    const { id } = req.params;
    const { UserID } = req.user; 

    try {
        const classroom = await Classroom.findByPk(id);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        if (classroom.OwnerID !== UserID) {
            return res.status(403).json({ message: 'Unauthorized to delete this classroom' });
        }

        await classroom.destroy();
        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting classroom: ' + error.message });
    }
};

exports.getClassroomsForStudent = async (req, res) => {
    const { studentId } = req.user.UserID;
  
    try {
        const studentClassrooms = await UserClassroom.findAll({
            where: { UserID: studentId },
            include: [{
                model: Classroom,
                include: [{
                    model: User,
                    as: 'Owner',
                    attributes: ['Username', 'Email']
                }]
            }]
        });
  
        const classrooms = studentClassrooms.map(uc => uc.Classroom);
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classrooms: ' + error.message });
    }
};

exports.getClassroomsForTeacher = async (req, res) => {
    const { teacherId } = req.user.UserID;
  
    try {
        const classrooms = await Classroom.findAll({
            where: { OwnerID: teacherId },
            include: [{
                model: User,
                as: 'Owner',
                attributes: ['Username', 'Email']
            }]
        });
  
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classrooms: ' + error.message });
    }
};

exports.enrollInClassroom = async (req, res) => {
    const { joinCode } = req.body;
    const { UserID } = req.user;
  
    try {
        const user = await User.findByPk(UserID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        const classroom = await Classroom.findOne({ where: { JoinCode: joinCode } });
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found with provided join code.' });
        }
  
        const isEnrolled = await UserClassroom.findOne({
            where: {
                UserID,
                ClassroomID: classroom.ClassroomID
            }
        });
        if (isEnrolled) {
            return res.status(409).json({ message: 'User is already enrolled in this classroom.' });
        }
  
        await UserClassroom.create({
            UserID,
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
        console.error("Error enrolling:", error);
        res.status(500).json({ message: 'Error enrolling user: ' + error.message });
    }
};

exports.leaveClassroom = async (req, res) => {
    const { classroomID } = req.body; 
    const { UserID } = req.user;

    try {
        // Check if the student is currently enrolled in the classroom
        const userClassroom = await UserClassroom.findOne({
            where: {
                UserID,
                ClassroomID: classroomID
            }
        });

        if (!userClassroom) {
            return res.status(404).json({ message: 'Enrollment not found or student is not in this classroom' });
        }

        // Delete the UserClassroom association
        await userClassroom.destroy();
        res.status(200).json({ message: 'Student has successfully left the classroom' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving classroom: ' + error.message });
    }
};