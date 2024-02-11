import React from 'react';
import { Box, Button, Typography } from '@mui/material'; // Import Material-UI components

const FileInput = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onUpload(file);
  };

  return (
    <Box mb={3}>
      <Typography variant="h4" gutterBottom>Upload HAR File:</Typography>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <label htmlFor="fileInput">
        <Button variant="contained" component="span">
          Choose File
        </Button>
      </label>
    </Box>
  );
};

export default FileInput;
