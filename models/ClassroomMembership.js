const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Classroom = require('./Classroom');

const ClassroomMembership = sequelize.define('ClassroomMembership', {
  ClassroomID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Classroom,
      key: 'id'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  Joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'ClassroomMemberships'
});

module.exports = ClassroomMembership;