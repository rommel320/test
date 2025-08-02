const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', authenticate, async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // If this is the default address, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0
    });
    
    await user.save();
    
    res.json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ addresses: user.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
