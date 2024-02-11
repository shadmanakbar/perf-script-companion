// FileInput.js
import React from 'react';

const FileInput = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onUpload(file);
  };

  return (
    <div>
      <label htmlFor="fileInput">Upload HAR File:</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />
    </div>
  );
};

export default FileInput;
