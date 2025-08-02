import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Restaurants = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Restaurant Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Restaurant management features coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Restaurants;
