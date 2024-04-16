const Sequelize = require('sequelize');

// Set up the connection (Adjust these parameters with your MySQL configuration)
const sequelize = new Sequelize('local_db', 'boskar', 'Vct73wje123', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = { sequelize };

const User = require('./User');
const Classroom = require('./Classroom');
const ClassroomMembership = require('./ClassroomMembership');
const Assignment = require('./Assignment');

// Define relationships
Classroom.belongsTo(User, { foreignKey: 'TeacherID' });
User.hasMany(Classroom, { foreignKey: 'TeacherID' });

ClassroomMembership.belongsTo(Classroom, { foreignKey: 'ClassroomID' });
ClassroomMembership.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(ClassroomMembership, { foreignKey: 'UserID' });

Assignment.belongsTo(Classroom, { foreignKey: 'ClassroomID' });
Classroom.hasMany(Assignment, { foreignKey: 'ClassroomID' });

module.exports = {
  User,
  Classroom,
  ClassroomMembership,
  Assignment,
  sequelize
};