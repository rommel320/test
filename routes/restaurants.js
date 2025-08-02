const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { Restaurant, User, MenuItem } = require('../models');

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    let query = { isActive: true };
    
    // If location provided, find nearby restaurants
    if (latitude && longitude) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }
    
    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email phone')
      .select('-menu'); // Exclude menu for list view
      
    res.json({ restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID with menu
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone');
      
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/restaurants
// @desc    Create new restaurant
// @access  Private (Restaurant owners)
router.post('/', authenticate, authorize('restaurant'), async (req, res) => {
  try {
    const restaurantData = {
      ...req.body,
      owner: req.user._id
    };
    
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    
    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
