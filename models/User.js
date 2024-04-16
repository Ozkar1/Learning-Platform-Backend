const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  Username: { type: DataTypes.STRING, unique: true, allowNull: false },
  Email: { type: DataTypes.STRING, unique: true, allowNull: false },
  FirstName: { type: DataTypes.STRING, allowNull: false },
  LastName: { type: DataTypes.STRING, allowNull: false },
  Password: { type: DataTypes.STRING, allowNull: false },
  ProfilePictureURL: { type: DataTypes.STRING },
  Role: { type: DataTypes.ENUM('student', 'teacher'), allowNull: false },
  Created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, onUpdate: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'Users'
});

// Hash the password before saving it to the database
User.beforeSave(async (user, options) => {
  if (user.changed('Password')) {
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(user.Password, salt);
  }
});

module.exports = User;