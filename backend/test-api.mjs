import fetch from 'node-fetch';

// Test configuration
const API_URL = 'http://localhost:3000';
const TOKEN = ''; // Replace with a valid token if needed

// Function to test the leave applications endpoint with different status filters
async function testLeaveApplicationsAPI() {
  const statuses = ['pending', 'approved', 'rejected', null]; // null for no status filter
  
  console.log('=== TESTING LEAVE APPLICATIONS API ===');
  
  for (const status of statuses) {
    try {
      const endpoint = '/api/leave-management/leave-applications';
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const url = `${API_URL}${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
      
      console.log(`\nTesting endpoint: ${endpoint}`);
      console.log(`Status filter: ${status || 'none (all)'}`);
      console.log(`Full URL: ${url}`);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
      }
      
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      console.log(`Status code: ${response.status}`);
      console.log(`Response type: ${typeof data}`);
      console.log(`Is array: ${Array.isArray(data)}`);
      
      if (Array.isArray(data)) {
        console.log(`Results count: ${data.length}`);
        
        if (data.length > 0) {
          console.log('Status values in results:');
          const statusCounts = {};
          
          data.forEach(item => {
            const itemStatus = (item.status || '').toLowerCase();
            statusCounts[itemStatus] = (statusCounts[itemStatus] || 0) + 1;
          });
          
          console.log(statusCounts);
          
          // Print the first result for inspection
          if (data.length > 0) {
            console.log('\nFirst result:');
            console.log(`ID: ${data[0].id}`);
            console.log(`Status: ${data[0].status}`);
            console.log(`Employee: ${data[0].employee?.fullName || 'N/A'}`);
          }
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Response data:', data);
      }
      
    } catch (error) {
      console.error(`Error testing status '${status || 'all'}':`, error.message);
    }
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

// Run the test
testLeaveApplicationsAPI();
