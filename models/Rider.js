const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rider = sequelize.define('Rider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  vehicleType: {
    type: DataTypes.ENUM('motorcycle', 'scooter', 'bicycle', 'car'),
    allowNull: false,
  },
  vehicleMake: {
    type: DataTypes.STRING,
  },
  vehicleModel: {
    type: DataTypes.STRING,
  },
  vehicleYear: {
    type: DataTypes.INTEGER,
  },
  licensePlate: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  vehicleColor: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  earningsTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  earningsWeekly: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  earningsMonthly: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  ratingAverage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  driversLicense: {
    type: DataTypes.STRING,
  },
  vehicleRegistration: {
    type: DataTypes.STRING,
  },
  proofOfInsurance: {
    type: DataTypes.STRING,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastSeen: {
    type: DataTypes.DATE,
  },
});

module.exports = Rider;

