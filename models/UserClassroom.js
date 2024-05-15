const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserClassroom = sequelize.define('UserClassroom', {
    UserID: DataTypes.INTEGER,
    ClassroomID: DataTypes.INTEGER
  }, {
    tableName: 'UserClassrooms'
  });

  return UserClassroom;
};