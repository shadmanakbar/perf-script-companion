// UrlInput.js
import React from 'react';

const UrlInput = ({ onChange }) => {
  const handleUrlChange = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  return (
    <div>
      <label htmlFor="urlInput">Base URL:</label>
      <input type="text" id="urlInput" onChange={handleUrlChange} />
    </div>
  );
};

export default UrlInput;
