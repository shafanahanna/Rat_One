const axios = require('axios');

// Function to test the leave balance population endpoint
async function testLeaveBalancePopulation() {
  try {
    console.log('Testing leave balance population endpoint...');
    
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Make a POST request to the leave balance population endpoint
    const response = await axios.post(
      `http://localhost:4000/api/leave-balances/populate?year=${currentYear}`,
      {},
      {
        headers: {
          // You'll need to replace this with a valid JWT token for an HR or Director user
          'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
        }
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error testing leave balance population:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Instructions for manual testing
console.log(`
=== Leave Balance Population Test ===

This script provides a function to test the leave balance population endpoint.

To use this script:
1. Make sure the backend server is running
2. Replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token for an HR or Director user
3. Run the script with Node.js

You can also test the endpoint manually using a tool like Postman:
- URL: http://localhost:4000/api/leave-balances/populate?year=YYYY
- Method: POST
- Headers: 
  - Authorization: Bearer YOUR_JWT_TOKEN_HERE
- No request body needed

The endpoint will populate leave balances for all active employees based on the global leave configuration for the specified year.
`);
