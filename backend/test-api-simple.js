const http = require('http');

// Test configuration
const API_HOST = 'localhost';
const API_PORT = 3000;
const API_PATH = '/api/leave-management/leave-applications';

// Function to make a simple HTTP request
function makeRequest(path, callback) {
  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        callback(null, parsedData);
      } catch (e) {
        callback(e, null);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    callback(e, null);
  });
  
  req.end();
}

// Test different status filters
function testStatusFilters() {
  const statusFilters = [
    { name: 'All (no filter)', path: API_PATH },
    { name: 'Pending', path: `${API_PATH}?status=pending` },
    { name: 'Approved', path: `${API_PATH}?status=approved` },
    { name: 'Rejected', path: `${API_PATH}?status=rejected` }
  ];
  
  let completedTests = 0;
  
  console.log('=== TESTING LEAVE APPLICATIONS API ===\n');
  
  statusFilters.forEach((filter) => {
    console.log(`Testing filter: ${filter.name}`);
    console.log(`Path: ${filter.path}`);
    
    makeRequest(filter.path, (error, data) => {
      if (error) {
        console.error(`Error with ${filter.name} filter:`, error.message);
      } else {
        console.log(`\nResults for ${filter.name}:`);
        
        if (Array.isArray(data)) {
          console.log(`- Found ${data.length} leave applications`);
          
          // Count status values
          const statusCounts = {};
          data.forEach(item => {
            const status = (item.status || '').toLowerCase();
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
          
          console.log('- Status counts:', statusCounts);
          
          // Show first item details if available
          if (data.length > 0) {
            const firstItem = data[0];
            console.log('- First item details:');
            console.log(`  ID: ${firstItem.id}`);
            console.log(`  Status: ${firstItem.status}`);
            console.log(`  Employee: ${firstItem.employee?.fullName || 'N/A'}`);
            console.log(`  Start Date: ${firstItem.start_date}`);
            console.log(`  End Date: ${firstItem.end_date}`);
          }
        } else {
          console.log('- Response is not an array:', data);
        }
      }
      
      console.log('\n-----------------------------------\n');
      
      completedTests++;
      if (completedTests === statusFilters.length) {
        console.log('=== ALL TESTS COMPLETED ===');
      }
    });
  });
}

// Run the tests
testStatusFilters();
