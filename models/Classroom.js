const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Classroom = sequelize.define('Classroom', {
    ClassroomID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    OwnerID: DataTypes.INTEGER,
    ClassroomName: DataTypes.STRING,
    Description: DataTypes.STRING,
    JoinCode: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    tableName: 'Classrooms'
  });

  return Classroom;
};