const { generateJoinCode } = require('../utils');
const ClassroomModel = require('../models/ClassroomModel');

exports.createClassroom = async (req, res) => {
    try {
        const { classroomName, description } = req.body;
        const ownerID = req.user.UserID; // Assuming the JWT includes UserID
        
        let isUnique = false;
        let joinCode;
        while (!isUnique) {
            joinCode = generateJoinCode();
            // Check if join code already exists
            const codeExists = await ClassroomModel.findOne({ where: { joinCode } });
            if (!codeExists) {
                isUnique = true;
            }
        }

        const newClassroom = await ClassroomModel.create({
            ownerID,
            classroomName,
            description,
            joinCode
        });
        res.status(201).send(newClassroom);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
};