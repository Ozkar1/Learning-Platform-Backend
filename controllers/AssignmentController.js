const { Assignment, CompletedAssignment } = require('../models/index');

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

