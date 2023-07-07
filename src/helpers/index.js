import axios from "axios";


function getHeaders(headerName = null, headerValue = null) {    
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
    if (headerName && headerValue) headers[headerName] = headerValue;    
    return headers
  }
  
  async function makeRequest(url, method, body = null, headers = null) {
    headers = headers || getHeaders();
    const config = {
      headers,
      method,
      url: url
    };
  
    if (method.toLowerCase() === 'get') {
      config.params = body;
    } else {
      config.data = body;
    }
  
    const response = await axios(config);
    return response;
  }

  export {makeRequest, getHeaders}