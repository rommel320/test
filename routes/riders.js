const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Rider = require('../models/Rider');
const Order = require('../models/Order');

const router = express.Router();

// @route   POST /api/riders/register
// @desc    Register as a rider
// @access  Private
router.post('/register', authenticate, authorize('rider'), async (req, res) => {
  try {
    const { vehicle } = req.body;
    
    // Check if rider already exists
    const existingRider = await Rider.findOne({ user: req.user._id });
    if (existingRider) {
      return res.status(400).json({ message: 'Rider profile already exists' });
    }
    
    const rider = new Rider({
      user: req.user._id,
      vehicle
    });
    
    await rider.save();
    
    res.status(201).json({
      message: 'Rider registered successfully',
      rider
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/riders/location
// @desc    Update rider location
// @access  Private (Riders only)
router.put('/location', authenticate, authorize('rider'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const rider = await Rider.findOneAndUpdate(
      { user: req.user._id },
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        lastSeen: new Date()
      },
      { new: true }
    );
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    
    res.json({
      message: 'Location updated successfully',
      location: rider.currentLocation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/riders/availability
// @desc    Toggle rider availability
// @access  Private (Riders only)
router.put('/availability', authenticate, authorize('rider'), async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const rider = await Rider.findOneAndUpdate(
      { user: req.user._id },
      { isAvailable },
      { new: true }
    );
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    
    res.json({
      message: `Rider is now ${isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: rider.isAvailable
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
