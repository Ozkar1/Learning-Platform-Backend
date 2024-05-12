const { generateJoinCode } = require('../utils');
//const Classroom = require('../models/Classroom');
const { Classroom } = require('../models/index');

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