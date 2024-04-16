const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Classroom = require('./Classroom');

const Assignment = sequelize.define('Assignment', {
  ClassroomID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Classroom,
      key: 'id'
    }
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  DueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'Assignments'
});

module.exports = Assignment;