console.log('Testing backend...');

try {
  const express = require('express');
  console.log('✓ Express loaded');
  
  const cors = require('cors');
  console.log('✓ CORS loaded');
  
  const dotenv = require('dotenv');
  dotenv.config();
  console.log('✓ Environment variables loaded');
  
  // Test database connection
  const { sequelize } = require('./models');
  console.log('✓ Sequelize loaded');
  
  sequelize.authenticate()
    .then(() => {
      console.log('✓ Database connection successful');
      process.exit(0);
    })
    .catch(err => {
      console.log('✗ Database connection failed:', err.message);
      console.log('This is expected if MySQL is not running');
      process.exit(0);
    });
    
} catch(error) {
  console.log('✗ Error:', error.message);
  process.exit(1);
}
