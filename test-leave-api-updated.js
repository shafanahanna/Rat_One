import axios from 'axios';
// Configuration
const API_URL = 'http://localhost:4000/api';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMDk2MTk3OC1hNmQzLTQ1MjctYmYzYy0yMDRlNWZhZjJlMmIiLCJpZCI6ImIwOTYxOTc4LWE2ZDMtNDUyNy1iZjNjLTIwNGU1ZmFmMmUyYiIsInJvbGUiOiJIUiIsImVtYWlsIjoicnVzaGlkYUBnbWFpbC5jb20iLCJpc1VVSUQiOnRydWUsImlzX2dsb2JhbCI6ZmFsc2UsImVtcGxveWVlSWQiOm51bGwsImlhdCI6MTc1Njg5MTczNiwiZXhwIjoxNzU2OTc4MTM2fQ.pKIXlsmvAD_xracDt2oJEirvQoNcyRUSJUkrMnrfQuw';

// Headers configuration
const headers = {
  'Authorization': `Bearer ${token}`,
  'Admintoken': token,
  'Content-Type': 'application/json'
};

// Test different status filters for all leave applications
async function testLeaveApplicationStatusFilters() {
  console.log('\n=== Testing Leave Applications API with different status filters ===');
  
  const testCases = [
    { name: 'All leave applications', url: '/leave-management/leave-applications' },
    { name: 'Pending leave applications', url: '/leave-management/leave-applications?status=pending' },
    { name: 'Approved leave applications', url: '/leave-management/leave-applications?status=approved' },
    { name: 'Rejected leave applications', url: '/leave-management/leave-applications?status=rejected' }
  ];
  
  for (const test of testCases) {
    console.log(`\n--- Testing: ${test.name} ---`);
    try {
      const response = await axios.get(`${API_URL}${test.url}`, { headers });
      
      console.log(`Status: ${response.status}`);
      
      // Handle different response structures
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
        console.log('Response is a direct array');
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
        console.log('Response has data in .data property');
      } else if (response.data && typeof response.data === 'object') {
        console.log('Response structure:', Object.keys(response.data));
        // Try to find an array in the response
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          data = possibleArrays[0];
          console.log('Found array in response object');
        }
      }
      
      console.log(`Total results: ${data.length}`);
      
      if (data.length > 0) {
        console.log('Sample items:');
        data.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. ID: ${item.id}, Status: ${item.status}, Employee: ${item.employee_name || 'Unknown'}`);
        });
      } else {
        console.log('No leave applications found with this filter');
      }
    } catch (error) {
      console.error(`Error testing ${test.name}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// Test leave balance status API
async function testLeaveBalanceStatus() {
  console.log('\n=== Testing Leave Balance Status API ===');
  
  const currentYear = new Date().getFullYear();
  
  try {
    const response = await axios.get(`${API_URL}/leave-management/leave-balances/status/${currentYear}`, { headers });
    
    console.log(`Status: ${response.status}`);
    console.log('Leave Balance Status Data:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing Leave Balance Status API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testLeaveApplicationStatusFilters();
    await testLeaveBalanceStatus();
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
}

// Execute tests
console.log('Starting API tests with provided token...');
runAllTests();
