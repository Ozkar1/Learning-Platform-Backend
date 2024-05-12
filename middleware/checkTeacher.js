// Middleware to check if the user is a teacher
function checkTeacher(req, res, next) {
    if (req.user.role !== 'Teacher') {
        return res.status(403).send('Access denied: Only teachers can perform this action.');
    }
    next();
}

module.exports = checkTeacher;