const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Restaurants',
      key: 'id',
    },
  },
  riderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'picked_up',
      'on_the_way',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'pending',
  },
  deliveryAddress: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'cash', 'digital_wallet'),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  transactionId: {
    type: DataTypes.STRING,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
  },
  actualDeliveryTime: {
    type: DataTypes.DATE,
  },
  preparationTime: {
    type: DataTypes.INTEGER, // in minutes
  },
  specialInstructions: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  cancellationReason: {
    type: DataTypes.TEXT,
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  hooks: {
    beforeCreate: async (order) => {
      if (!order.orderNumber) {
        const count = await Order.count();
        order.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
      }
    },
  },
});

module.exports = Order;
