const axios = require('axios');

// Test configuration
const API_URL = 'http://localhost:3000';
const TOKEN = 'YOUR_AUTH_TOKEN'; // Replace with a valid token if needed

// Function to test the leave applications endpoint with different status filters
async function testLeaveApplicationsAPI() {
  const statuses = ['pending', 'approved', 'rejected', null]; // null for no status filter
  
  console.log('=== TESTING LEAVE APPLICATIONS API ===');
  
  for (const status of statuses) {
    try {
      const endpoint = '/api/leave-management/leave-applications';
      const params = status ? { status } : {};
      
      console.log(`\nTesting endpoint: ${endpoint}`);
      console.log(`Status filter: ${status || 'none (all)'}`);
      
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
          // Uncomment and use a valid token if authentication is required
          // 'Authorization': `Bearer ${TOKEN}`
        }
      });
      
      console.log(`Status code: ${response.status}`);
      console.log(`Response type: ${typeof response.data}`);
      console.log(`Is array: ${Array.isArray(response.data)}`);
      
      if (Array.isArray(response.data)) {
        console.log(`Results count: ${response.data.length}`);
        
        if (response.data.length > 0) {
          console.log('Status values in results:');
          const statusCounts = {};
          
          response.data.forEach(item => {
            const itemStatus = (item.status || '').toLowerCase();
            statusCounts[itemStatus] = (statusCounts[itemStatus] || 0) + 1;
          });
          
          console.log(statusCounts);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Response data:', response.data);
      }
      
    } catch (error) {
      console.error(`Error testing status '${status || 'all'}':`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

// Run the test
testLeaveApplicationsAPI();
