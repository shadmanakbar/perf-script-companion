// requestFilter.js

export const filterRequests = (harData, baseUrl) => {
    return harData.log.entries.filter(entry => entry.request.url.includes(baseUrl));
  };
  
  export const parseHarFile = async (file) => {
    const text = await file.text();
    return JSON.parse(text);
  };
  
  export const countRepeatedRequests = (harData) => {
    const requests = harData?.log?.entries || [];
    const repeatedRequests = {};
  
    requests.forEach((entry) => {
      const { request } = entry;
      const url = request.url;
      const method = request.method;
  
      // Check if the URL and method combination is already recorded
      if (!repeatedRequests[url]) {
        repeatedRequests[url] = {};
      }
  
      if (!repeatedRequests[url][method]) {
        repeatedRequests[url][method] = 1;
      } else {
        repeatedRequests[url][method]++;
      }
    });
  
    return repeatedRequests;
  };