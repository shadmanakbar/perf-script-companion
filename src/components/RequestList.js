// RequestList.js
import React, { useState, useEffect } from 'react';

import { Typography, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Collapse, Paper } from '@mui/material';


const RequestList = ({ requests, showRepeatedRequests, filteredRequests }) => {
  const [expandedRequestBody, setExpandedRequestBody] = useState(null);
  const [repeatedRequestCounts, setRepeatedRequestCounts] = useState({});
  const [showTimeDifferences, setShowTimeDifferences] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedRepeatedRequestPath, setSelectedRepeatedRequestPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const staticResourceExtensions = ['.png', '.js', '.jpeg', '.json', '.css','.css','.woff','.jpg'];




  // New state variables for visibility toggles
  const [showFilteredRequestCounts, setShowFilteredRequestCounts] = useState(true);
  const [showRepeatedRequestCounts, setShowRepeatedRequestCounts] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); // New state variable

  const [showResponseBody, setShowResponseBody] = useState(false);
  const [showSearchedResponseBody, setShowSearchedResponseBody] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);



  const handleSearchResultClick = (index) => {
    // Set the selected request
    const selectedRequest = searchResults[index];
    setSelectedRequest(selectedRequest);
  };

  const toggleResponseBody = () => {
    setShowResponseBody((prev) => !prev);
  };

  const toggleSearchedResponseBody = () => {
    setShowSearchedResponseBody((prev) => !prev);
  };

  useEffect(() => {
    // Calculate repeated request counts only if requests is an array
    if (Array.isArray(requests) && requests.length > 0) {
      const requestCounts = {};
      requests.forEach((request) => {
        const key = JSON.stringify({
          method: request.request.method,
          path: getPathWithoutBaseUrl(request.request.url),
        });
        requestCounts[key] = (requestCounts[key] || 0) + 1;
      });
      setRepeatedRequestCounts(requestCounts);

      // Set the start time when the first request is present
      setStartTime(new Date(requests[0].startedDateTime));
    }
  }, [requests]);

  const toggleRequestBody = (index) => {
    setExpandedRequestBody((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleTimeDifferences = () => {
    setShowTimeDifferences((prev) => !prev);
  };

  const toggleFilteredRequestCounts = () => {
    setShowFilteredRequestCounts((prev) => !prev);
  };

  const toggleRepeatedRequestCounts = () => {
    setShowRepeatedRequestCounts((prev) => !prev);
  };

  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter requests based on the search term
    const filteredResults = requests.filter((request) => {
      const responseText = request.response?.content?.text || '';
      return responseText.includes(term);
    });

    setSearchResults(filteredResults);
  };

  const getPathWithoutBaseUrl = (url) => {
    // Assuming base URL is at the beginning of the path
    const baseUrl = 'http://example.com'; // Replace with your base URL
    const urlObject = new URL(url);
    const basePath = urlObject.pathname + urlObject.search + urlObject.hash;
    return basePath.startsWith(baseUrl) ? basePath.slice(baseUrl.length) : basePath;
  };

  const calculateTimeDifference = (request) => {
    if (!startTime) {
      return 0;
    }

    const startTimeCurrent = new Date(request.startedDateTime);

    return startTimeCurrent - startTime; // Time difference in milliseconds
  };

  const handleRepeatedRequestPathClick = (path) => {
    setSelectedRepeatedRequestPath((prevPath) => (prevPath === path ? null : path));
  };

  const getRequestsForRepeatedPath = (path) => {
    return requests.filter((request) => getPathWithoutBaseUrl(request.request.url) === path);
  };

  

  return (
    <div>
 
      <div>
        <button onClick={toggleRepeatedRequestCounts}>
          {showRepeatedRequestCounts ? 'Hide Repeated Request Counts' : 'Show Repeated Request Counts'}
        </button>
      </div>


     
      {/* Display Filtered Request Counts if enabled */}
      {showFilteredRequestCounts && filteredRequests ? (
          <Typography variant="h5" gutterBottom>Filtered Request Counts</Typography>
      ) : null}

      {/* Display Repeated Request Counts if enabled */}
      {showRepeatedRequestCounts ? (
  <List>
    {Object.entries(repeatedRequestCounts)
      .filter(([key, _]) => {
        const url = JSON.parse(key).path.toLowerCase();
        return !staticResourceExtensions.some(extension => url.includes(extension));
      })
      .map(([key, count]) => (
        <ListItem key={key} disablePadding>
          <Button onClick={() => handleRepeatedRequestPathClick(JSON.parse(key).path)}>
            <Typography>
              {JSON.parse(key).method} - {JSON.parse(key).path}: {count} times
            </Typography>
          </Button>
          {selectedRepeatedRequestPath === JSON.parse(key).path && (
            <List>
              {getRequestsForRepeatedPath(selectedRepeatedRequestPath).map((request, index) => (
                <ListItem key={index} disablePadding>
                  <Typography>
                    {index + 1}: {calculateTimeDifference(request)} milliseconds
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </ListItem>
      ))}
  </List>
) : null}


      {/* Display All Requests */}
      <ol>
  <Typography variant="h5" gutterBottom>Request List</Typography>
  {Array.isArray(requests) &&
    requests
      // Filter out requests with static resource file extensions
      .filter(request => {
        const url = request.request.url.toLowerCase();
        return !staticResourceExtensions.some(extension => url.includes(extension));
      })
      .map((request, index) => (
        <List key={index}>
          <ListItem button onClick={() => toggleRequestBody(index)}>
            <ListItemText primary={`${request.request.method} - ${getPathWithoutBaseUrl(request.request.url)}`} />
          </ListItem>
        </List>
      ))}
</ol>
 {/* Search Box */}
 <TextField
        id="searchTerm"
        label="Search Term"
        value={searchTerm}
        onChange={handleSearchTermChange}
        variant="outlined"
        margin="normal"
        fullWidth
      />

      <Typography variant="h6" gutterBottom>Search Results:</Typography>
    

<List>
  {searchResults
    .filter(result => {
      const url = result.request.url.toLowerCase();
      const staticResourceExtensions = ['.png', '.js', '.jpeg', '.json', '.css'];
      return !staticResourceExtensions.some(extension => url.includes(extension));
    })
    .map((result, index) => (
      <React.Fragment key={index}>
        <ListItem>
          <ListItemText
            primary={`${result.request.method} - ${getPathWithoutBaseUrl(result.request.url)}`}
            onClick={() => toggleRequestBody(index)}
            style={{ cursor: 'pointer' }}
          />
        </ListItem>
        {expandedRequestBody === index && (
          <ListItem>
            <ListItemText
              primary={`Response Body: ${JSON.stringify(result.response?.content?.text, null, 2)}`}
            />
          </ListItem>
        )}
      </React.Fragment>
    ))}
</List>


      {/* ... (other code) */}

      {/* Display Complete Response */}
      {selectedRequest && (
            <div>
            <Typography variant="h6" gutterBottom>Complete Response:</Typography>
            <Paper variant="outlined">
              <pre>{JSON.stringify(selectedRequest.response, null, 2)}</pre>
            </Paper>
          </div>
      )}
    </div>
  );
};

export default RequestList;