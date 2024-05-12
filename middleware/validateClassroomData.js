function validateClassroomData(req, res, next) {
    const { ClassroomName, Description } = req.body;
    if (!ClassroomName || !Description) {
        return res.status(400).send('Missing required fields: classroom name and description are required.');
    }
    next();
}

module.exports = validateClassroomData;