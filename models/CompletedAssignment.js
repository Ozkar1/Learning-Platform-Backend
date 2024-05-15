const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CompletedAssignment = sequelize.define('CompletedAssignment', {
    // Automatically added ID column
    AssignmentID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Assignments', // This is a reference to another model
        key: 'AssignmentID',   // This is the column name of the referenced model
      }
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // This is a reference to another model
        key: 'UserID',   // This is the column name of the referenced model
      }
    }
  }, {
    tableName: 'CompletedAssignments'
  });

  return CompletedAssignment;
};