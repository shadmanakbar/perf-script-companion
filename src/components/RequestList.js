// RequestList.js
import React, { useState, useEffect } from 'react';
import './RequestList.css';

const RequestList = ({ requests, showRepeatedRequests, filteredRequests }) => {
  const [expandedRequestBody, setExpandedRequestBody] = useState(null);
  const [repeatedRequestCounts, setRepeatedRequestCounts] = useState({});
  const [showTimeDifferences, setShowTimeDifferences] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedRepeatedRequestPath, setSelectedRepeatedRequestPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      <div>
        <button onClick={toggleTimeDifferences}>
          {showTimeDifferences ? 'Hide Time Differences' : 'Show Time Differences'}
        </button>
      </div>

     
      {/* Display Filtered Request Counts if enabled */}
      {showFilteredRequestCounts && filteredRequests ? (
        <h2>Filtered Request Counts:</h2>
      ) : null}

      {/* Display Repeated Request Counts if enabled */}
      {showRepeatedRequestCounts ? (
        <ul>
          {Object.entries(repeatedRequestCounts).map(([key, count]) => (
            <li key={key}>
              <button onClick={() => handleRepeatedRequestPathClick(JSON.parse(key).path)}>
                {JSON.parse(key).method} - {JSON.parse(key).path}: {count} times
              </button>
              {selectedRepeatedRequestPath === JSON.parse(key).path && (
                <ul>
                  {getRequestsForRepeatedPath(selectedRepeatedRequestPath).map(
                    (request, index) => (
                      <li key={index}>
                        {index + 1}: {calculateTimeDifference(request)} milliseconds
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Display All Requests */}
      <ol>
        <h1>All Request</h1>
        {Array.isArray(requests) &&
          requests.map((request, index) => (
            <li key={index}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => toggleRequestBody(index)}
              >
                <strong></strong>{' '}
                {getPathWithoutBaseUrl(request.request.url)} | <strong>Method:</strong>{' '}
                {request.request.method}
              </div>
              {expandedRequestBody === index && (
                <div>
                  <strong>Request Body:</strong>
                  <pre>{JSON.stringify(request.request.postData?.text, null, 2)}</pre>
                </div>
              )}
              {showTimeDifferences && (
                <div>
                  <strong>Time Elapsed since Start:</strong>{' '}
                  {calculateTimeDifference(request)} milliseconds
                </div>
              )}
            </li>
          ))}
      </ol>
 {/* Search Box */}
 <div>
        <label htmlFor="searchTerm">Search Term:</label>
        <input type="text" id="searchTerm" value={searchTerm} onChange={handleSearchTermChange} />
      </div>

      <div>
        <h2>Search Results:</h2>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}   style={{ cursor: 'pointer' }} onClick={() => setSelectedSearchResult(index)}>
              {/* Display relevant information about the search result */}
              {result.request.method} - {getPathWithoutBaseUrl(result.request.url)}

              {/* Display Response Body only for the selected search result */}
              {selectedSearchResult === index && (
                <div>
                  <strong>Response Body:</strong>
                  <pre>{JSON.stringify(result.response?.content?.text, null, 2)}</pre>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ... (other code) */}

      {/* Display Complete Response */}
      {selectedRequest && (
        <div>
          <h2>Complete Response:</h2>
          {/* Display the complete response based on your data structure */}
          <pre>{JSON.stringify(selectedRequest.response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RequestList;