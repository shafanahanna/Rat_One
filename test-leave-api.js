const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:4000/api';
const token = process.env.ADMIN_TOKEN || ''; // Set your token as environment variable or replace with actual token

// Test different status filters
async function testLeaveApplicationFiltering() {
  try {
    // Get an employee ID to test with
    console.log('Fetching employees to get a test ID...');
    const employeesResponse = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!employeesResponse.data.data || employeesResponse.data.data.length === 0) {
      console.error('No employees found to test with');
      return;
    }
    
    const testEmployeeId = employeesResponse.data.data[0].id;
    console.log(`Using employee ID: ${testEmployeeId} for testing`);
    
    // Test cases with different status values
    const testCases = [
      { name: 'All leaves', url: `/leave-management/leave-applications/employee/${testEmployeeId}` },
      { name: 'Pending leaves', url: `/leave-management/leave-applications/employee/${testEmployeeId}?status=pending` },
      { name: 'Approved leaves', url: `/leave-management/leave-applications/employee/${testEmployeeId}?status=approved` },
      { name: 'Rejected leaves', url: `/leave-management/leave-applications/employee/${testEmployeeId}?status=rejected` },
      { name: 'Mixed case status', url: `/leave-management/leave-applications/employee/${testEmployeeId}?status=PeNdInG` },
    ];
    
    // Run all test cases
    for (const test of testCases) {
      console.log(`\n=== Testing: ${test.name} ===`);
      try {
        const response = await axios.get(`${API_URL}${test.url}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`Status: ${response.status}`);
        console.log(`Total results: ${response.data.data ? response.data.data.length : 0}`);
        
        if (response.data.data && response.data.data.length > 0) {
          console.log('Sample statuses:');
          response.data.data.slice(0, 3).forEach(item => {
            console.log(`  - ${item.status} (ID: ${item.id})`);
          });
        } else {
          console.log('No leave applications found with this filter');
        }
      } catch (error) {
        console.error(`Error testing ${test.name}:`, error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
      }
    }
    
  } catch (error) {
    console.error('Error in test script:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
console.log('Starting leave application API tests...');
testLeaveApplicationFiltering();
