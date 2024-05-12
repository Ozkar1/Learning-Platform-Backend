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

// Define relationships
User.hasMany(Classroom, { foreignKey: 'OwnerID' });
Classroom.belongsTo(User, { foreignKey: 'OwnerID' });

User.belongsToMany(Classroom, { through: UserClassroom, foreignKey: 'UserID', otherKey: 'ClassroomID' });
Classroom.belongsToMany(User, { through: UserClassroom, foreignKey: 'ClassroomID', otherKey: 'UserID' });

Assignment.belongsTo(Classroom, { foreignKey: 'ClassroomID' });
Classroom.hasMany(Assignment, { foreignKey: 'ClassroomID' });

module.exports = {
  sequelize,
  User,
  Classroom,
  UserClassroom,
  Assignment
};