const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');

const Classroom = sequelize.define('Classroom', {
  TeacherID: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  Name: { type: DataTypes.STRING, allowNull: false },
  Description: { type: DataTypes.TEXT },
  Created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, onUpdate : DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'Classrooms'
});

module.exports = Classroom;