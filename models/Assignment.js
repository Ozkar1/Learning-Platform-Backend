const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Assignment = sequelize.define('Assignment', {
    AssignmentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ClassroomID: DataTypes.INTEGER,
    Title: DataTypes.STRING,
    Description: DataTypes.STRING,
    DueDate: DataTypes.DATE,
    ExpectedInput: DataTypes.STRING,
    ExpectedMemory: DataTypes.STRING,
    ExpectedRegister: DataTypes.STRING,
  }, {
    tableName: 'Assignments'
  });

  return Assignment;
};