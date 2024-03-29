import React, { useState } from 'react';
import FileInput from './components/FileInput';
import UrlInput from './components/UrlInput';
import RequestList from './components/RequestList';
import { parseHarFile, filterRequests, countRepeatedRequests } from './requestFilter';
import { Container, Typography, Button, Grid } from '@mui/material';
import './App.css'; 

function App() {
  const [harData, setHarData] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');
  const [showFilteredRequests, setShowFilteredRequests] = useState(false);
  const [showRepeatedRequests, setShowRepeatedRequests] = useState(false);
  const [submissionOccurred, setSubmissionOccurred] = useState(false);

  const handleFileUpload = async (file) => {
    try {
      const parsedData = await parseHarFile(file);
      setHarData(parsedData);
    } catch (error) {
      console.error('Error parsing HAR file:', error);
    }
  };

  const handleBaseUrlChange = (value) => {
    setBaseUrl(value);
  };

  const handleRequestListSubmit = () => {
    setSubmissionOccurred(true);
    setShowFilteredRequests(true);
    setShowRepeatedRequests(true);
  };

  const filteredRequests = harData ? filterRequests(harData, baseUrl) : [];
  const repeatedRequestCounts = harData ? countRepeatedRequests(harData) : [];

  const toggleFilteredRequests = () => {
    setShowFilteredRequests((prev) => !prev);
    // Hide repeated requests when filtered requests are shown
    setShowRepeatedRequests(false);
  };

  const toggleRepeatedRequests = () => {
    setShowRepeatedRequests((prev) => !prev);
    // Hide filtered requests when repeated requests are shown
    setShowFilteredRequests(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom>HAR File Analyzer</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FileInput onUpload={handleFileUpload} />
        </Grid>
        <Grid item xs={12}>
          <UrlInput onChange={handleBaseUrlChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleRequestListSubmit}>
            Analyze HAR
          </Button>
        </Grid>
      </Grid>
      <br/><br/>
      {submissionOccurred && (
        <RequestList
          requests={showFilteredRequests ? filteredRequests : repeatedRequestCounts}
          filteredRequests={showFilteredRequests}
        />
      )}
    </Container>
  );
}

export default App;
