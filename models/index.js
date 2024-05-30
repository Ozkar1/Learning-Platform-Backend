const Sequelize = require('sequelize');


// Set up the connection (Adjust these parameters with your actual MySQL configuration)
const sequelize = new Sequelize('local_db', 'boskar', 'Vct73wje123', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = require('./User')(sequelize);
const Classroom = require('./Classroom')(sequelize);
const UserClassroom = require('./UserClassroom')(sequelize);
const Assignment = require('./Assignment')(sequelize);
const CompletedAssignment = require('./CompletedAssignment')(sequelize);

// Define relationships
User.hasMany(Classroom, { foreignKey: 'OwnerID', as: 'OwnedClassrooms' });
Classroom.belongsTo(User, { foreignKey: 'OwnerID', as: 'Owner' });

User.belongsToMany(Classroom, { through: UserClassroom, foreignKey: 'UserID', otherKey: 'ClassroomID', as: 'EnrolledClassrooms' });
Classroom.belongsToMany(User, { through: UserClassroom, foreignKey: 'ClassroomID', otherKey: 'UserID', as: 'EnrolledUsers' });

Classroom.hasMany(UserClassroom, { foreignKey: 'ClassroomID' });
UserClassroom.belongsTo(Classroom, { foreignKey: 'ClassroomID' });

Assignment.belongsTo(Classroom, { foreignKey: 'ClassroomID' });
Classroom.hasMany(Assignment, { foreignKey: 'ClassroomID' });

User.belongsToMany(Assignment, { through: CompletedAssignment, foreignKey: 'UserID', otherKey: 'AssignmentID' });
Assignment.belongsToMany(User, { through: CompletedAssignment, foreignKey: 'AssignmentID', otherKey: 'UserID' });

CompletedAssignment.belongsTo(User, { foreignKey: 'UserID' });
CompletedAssignment.belongsTo(Assignment, { foreignKey: 'AssignmentID' });

module.exports = {
  sequelize,
  User,
  Classroom,
  UserClassroom,
  Assignment,
  CompletedAssignment
};