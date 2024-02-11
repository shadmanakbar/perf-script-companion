import React from 'react';
import { Box, TextField, Typography } from '@mui/material'; // Import Material-UI components

const UrlInput = () => {
  const handleUrlChange = (event) => {
    const value = event.target.value;
    // Handle URL change
  };

  return (
    <Box mb={3}>
      <Typography variant="h4" gutterBottom>Base URL:</Typography>
      <TextField id="urlInput" label="Enter URL" variant="outlined" onChange={handleUrlChange} />
    </Box>
  );
};

export default UrlInput;
