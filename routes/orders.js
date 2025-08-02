const express = require('express');
const { authenticate } = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customer: req.user._id
    };
    
    const order = new Order(orderData);
    await order.save();
    
    await order.populate('restaurant', 'name address phone');
    await order.populate('customer', 'name phone');
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image address')
      .sort({ createdAt: -1 });
      
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image address phone')
      .populate('customer', 'name phone')
      .populate('rider', 'name phone vehicle');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
