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
    TargetString: DataTypes.STRING,
    MemoryResult: DataTypes.STRING,
    RegisterResult: DataTypes.STRING,
  }, {
    tableName: 'Assignments'
  });

  return Assignment;
};