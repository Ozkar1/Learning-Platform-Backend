function validateClassroomData(req, res, next) {
    const { classroomName, description } = req.body;
    if (!classroomName || !description) {
        return res.status(400).send('Missing required fields: classroom name and description are required.');
    }
    next();
}

module.exports = validateClassroomData;