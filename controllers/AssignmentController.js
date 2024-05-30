const { and } = require('sequelize');
const { Assignment, CompletedAssignment, Classroom, UserClassroom, User} = require('../models/index');

exports.createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, classroomId, expectedInput, expectedMemory, expectedRegister } = req.body;
        const newAssignment = await Assignment.create({
            Title: title,
            Description: description,
            DueDate: dueDate,
            ClassroomID: classroomId,
            ExpectedInput: expectedInput,
            ExpectedMemory: expectedMemory,
            ExpectedRegister: expectedRegister
        });

        res.status(201).json(newAssignment);
    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).send('Server error: ' + error.message);
    }
};

exports.deleteAssignment = async (req, res) => {
    const { assignmentID } = req.params;
    const { UserID } = req.user; // UserID set by authentication middleware

    try {
        // Verify the assignment exists and belongs to a classroom managed by the teacher
        const assignment = await Assignment.findOne({
            where: { AssignmentID: assignmentID },
            include: [{
                model: Classroom,
                where: { OwnerID: UserID }
            }]
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or you do not have permission to delete it." });
        }

        // Delete the assignment
        await Assignment.destroy({
            where: { AssignmentID: assignmentID }
        });

        res.status(200).json({ message: "Assignment deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment: ' + error.message });
    }
};

exports.getAssignmentsForClassroom = async (req, res) => {
    const { classroomID } = req.params;
    const { UserID } = req.user; // Assuming user info is set by authentication middleware

    try {
        // Check if user is enrolled in the requested classroom
        const isEnrolled = await UserClassroom.findOne({
            where: {
                UserID,
                ClassroomID: classroomID
            }
        });

        const isOwner = await Classroom.findOne({
            where: {
                OwnerID: UserID,
                ClassroomID: classroomID
            }
        })

        if (!isEnrolled && !isOwner) {
            return res.status(403).json({ message: 'You are not enrolled in this classroom.' });
        }

        // Fetch all assignments for the classroom
        const assignments = await Assignment.findAll({
            where: { ClassroomID: classroomID }
        });

        if (assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found for this classroom.' });
        }

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments: ' + error.message });
    }
};

exports.submitAssignment = async (req, res) => {
    const { AssignmentID, input, memory, register } = req.body;
    const { UserID } = req.user;

    try {
        const assignment = await Assignment.findByPk(AssignmentID);
        if (!assignment) {
            return res.status(404).send('Assignment not found.');
        }

        // Check if the user has already completed the assignment
        const existingCompletion = await CompletedAssignment.findOne({
            where: {
                AssignmentID,
                UserID
            }
        });

        if (existingCompletion) {
            return res.status(400).json({ message: "You have already completed this assignment." });
        }

        // Check if the submission matches the expected results
        const isCorrect = (assignment.ExpectedInput === input ||
                           assignment.ExpectedMemory === memory ||
                           assignment.ExpectedRegister === register);

        if (isCorrect) {
            // Create a completed assignment entry
            await CompletedAssignment.create({
                AssignmentID,
                UserID
            });
            res.status(200).json({ message: "Assignment completed successfully!" });
        } else {
            res.status(400).json({ message: "Submission does not match the expected results." });
        }
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
};

exports.getCompletionStatus = async (req, res) => {
    const { assignmentID } = req.params;
    const { UserID } = req.user; // Assuming user info is set by authentication middleware

    try {
        // Fetch the assignment to get the ClassroomID and verify existence
        const assignment = await Assignment.findOne({
            where: { AssignmentID: assignmentID }
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }

        // Check if the user is the owner of the classroom associated with the assignment
        const classroom = await Classroom.findOne({
            where: {
                ClassroomID: assignment.ClassroomID,
                OwnerID: UserID
            }
        });

        if (!classroom) {
            return res.status(403).json({ message: 'You do not have permission to view this information.' });
        }

        // Get the users who have completed the assignment
        const completions = await CompletedAssignment.findAll({
            where: { AssignmentID: assignmentID },
            include: [{ model: User, attributes: ['UserID', 'Username', 'FirstName', 'LastName'] }]
        });

        const completedUsers = completions.map(completion => completion.User);

        res.status(200).json(completedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completion status: ' + error.message });
    }
};

