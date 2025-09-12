const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:4000/api';
let JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid JWT token for an HR or Director user
const CURRENT_YEAR = new Date().getFullYear();

// Test employee and leave type IDs (replace with actual IDs from your database)
let TEST_EMPLOYEE_ID = 'EMPLOYEE_ID_HERE';
let TEST_LEAVE_TYPE_ID = 'LEAVE_TYPE_ID_HERE'; // Casual leave type ID
let createdLeaveApplicationId = null;

// Axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to log test results
function logTestResult(testName, success, data = null, error = null) {
  console.log(`\n=== ${testName} ===`);
  if (success) {
    console.log('✅ PASSED');
    if (data) console.log('Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('❌ FAILED');
    if (error) {
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

// 1. Test setup default leave types
async function testSetupDefaultLeaveTypes() {
  try {
    // This assumes you have an endpoint to run the setup script
    // If not, you might need to run it manually or create this endpoint
    const response = await api.post('/leave-management/setup-default-leave-types');
    logTestResult('Setup Default Leave Types', true, response.data);
    return response.data;
  } catch (error) {
    logTestResult('Setup Default Leave Types', false, null, error);
    console.log('Note: If this endpoint doesn\'t exist, you may need to run the setup script manually');
  }
}

// 2. Test leave balance population
async function testLeaveBalancePopulation() {
  try {
    const response = await api.post(`/leave-balances/populate?year=${CURRENT_YEAR}`);
    logTestResult('Leave Balance Population', true, response.data);
    return response.data;
  } catch (error) {
    logTestResult('Leave Balance Population', false, null, error);
  }
}

// 3. Test fetching leave balances for an employee
async function testGetEmployeeLeaveBalances() {
  try {
    const response = await api.get(`/leave-balances/employee/${TEST_EMPLOYEE_ID}?year=${CURRENT_YEAR}`);
    logTestResult('Get Employee Leave Balances', true, response.data);
    
    // Store the casual leave type ID for later use
    if (response.data && response.data.data && response.data.data.length > 0) {
      const casualLeave = response.data.data.find(balance => 
        balance.leave_type && balance.leave_type.name.toLowerCase() === 'casual leave'
      );
      
      if (casualLeave) {
        TEST_LEAVE_TYPE_ID = casualLeave.leave_type.id;
        console.log(`Found Casual Leave Type ID: ${TEST_LEAVE_TYPE_ID}`);
      }
    }
    
    return response.data;
  } catch (error) {
    logTestResult('Get Employee Leave Balances', false, null, error);
  }
}

// 4. Test creating a leave application
async function testCreateLeaveApplication() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // 7 days from now
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2); // 3-day leave
    
    const leaveApplicationData = {
      employee_id: TEST_EMPLOYEE_ID,
      leave_type_id: TEST_LEAVE_TYPE_ID,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      reason: 'Test leave application for balance testing',
      leave_duration_type: 'full_day', // full_day, first_half, second_half
      contact_details: '1234567890'
    };
    
    const response = await api.post('/leave-applications', leaveApplicationData);
    logTestResult('Create Leave Application', true, response.data);
    
    // Store the created leave application ID for later use
    if (response.data && response.data.data && response.data.data.id) {
      createdLeaveApplicationId = response.data.data.id;
      console.log(`Created Leave Application ID: ${createdLeaveApplicationId}`);
    }
    
    return response.data;
  } catch (error) {
    logTestResult('Create Leave Application', false, null, error);
  }
}

// 5. Test approving a leave application (should deduct leave balance)
async function testApproveLeaveApplication() {
  if (!createdLeaveApplicationId) {
    console.log('❌ Cannot approve leave application: No leave application ID available');
    return;
  }
  
  try {
    const approvalData = {
      leave_application_id: createdLeaveApplicationId,
      approver_notes: 'Approved for testing leave balance deduction',
      status: 'approved'
    };
    
    const response = await api.post('/leave-approvals', approvalData);
    logTestResult('Approve Leave Application', true, response.data);
    return response.data;
  } catch (error) {
    logTestResult('Approve Leave Application', false, null, error);
  }
}

// 6. Test checking leave balance after approval (should be reduced)
async function testCheckLeaveBalanceAfterApproval() {
  try {
    const response = await api.get(`/leave-balances/employee/${TEST_EMPLOYEE_ID}?year=${CURRENT_YEAR}`);
    logTestResult('Check Leave Balance After Approval', true, response.data);
    
    // Find the casual leave balance and check if used_days has increased
    if (response.data && response.data.data && response.data.data.length > 0) {
      const casualLeaveBalance = response.data.data.find(balance => 
        balance.leave_type && balance.leave_type.id === TEST_LEAVE_TYPE_ID
      );
      
      if (casualLeaveBalance) {
        console.log(`Casual Leave Balance - Used Days: ${casualLeaveBalance.used_days}`);
        console.log(`Casual Leave Balance - Remaining: ${casualLeaveBalance.allocated_days - casualLeaveBalance.used_days}`);
      }
    }
    
    return response.data;
  } catch (error) {
    logTestResult('Check Leave Balance After Approval', false, null, error);
  }
}

// 7. Test cancelling an approved leave application
async function testCancelLeaveApplication() {
  if (!createdLeaveApplicationId) {
    console.log('❌ Cannot cancel leave application: No leave application ID available');
    return;
  }
  
  try {
    const response = await api.patch(`/leave-applications/${createdLeaveApplicationId}/cancel`);
    logTestResult('Cancel Leave Application', true, response.data);
    return response.data;
  } catch (error) {
    logTestResult('Cancel Leave Application', false, null, error);
  }
}

// 8. Test checking leave balance after cancellation (should be restored)
async function testCheckLeaveBalanceAfterCancellation() {
  try {
    const response = await api.get(`/leave-balances/employee/${TEST_EMPLOYEE_ID}?year=${CURRENT_YEAR}`);
    logTestResult('Check Leave Balance After Cancellation', true, response.data);
    
    // Find the casual leave balance and check if used_days has decreased back
    if (response.data && response.data.data && response.data.data.length > 0) {
      const casualLeaveBalance = response.data.data.find(balance => 
        balance.leave_type && balance.leave_type.id === TEST_LEAVE_TYPE_ID
      );
      
      if (casualLeaveBalance) {
        console.log(`Casual Leave Balance - Used Days: ${casualLeaveBalance.used_days}`);
        console.log(`Casual Leave Balance - Remaining: ${casualLeaveBalance.allocated_days - casualLeaveBalance.used_days}`);
      }
    }
    
    return response.data;
  } catch (error) {
    logTestResult('Check Leave Balance After Cancellation', false, null, error);
  }
}

// Run all tests sequentially
async function runAllTests() {
  console.log('\n=== LEAVE BALANCE FUNCTIONALITY TEST SUITE ===\n');
  console.log('Starting tests...\n');
  
  try {
    // Setup and preparation
    await testSetupDefaultLeaveTypes();
    await testLeaveBalancePopulation();
    await testGetEmployeeLeaveBalances();
    
    // Test leave application and balance deduction
    await testCreateLeaveApplication();
    await testApproveLeaveApplication();
    await testCheckLeaveBalanceAfterApproval();
    
    // Test leave cancellation and balance restoration
    await testCancelLeaveApplication();
    await testCheckLeaveBalanceAfterCancellation();
    
    console.log('\n=== TEST SUITE COMPLETED ===\n');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Instructions for manual testing
console.log(`
=== Leave Balance Functionality Test Suite ===

This script tests the complete leave balance workflow:
1. Setting up default leave types
2. Populating leave balances for all employees
3. Creating a leave application
4. Approving the leave application (should deduct leave balance)
5. Checking leave balance after approval
6. Cancelling the leave application
7. Checking leave balance after cancellation (should restore balance)

Before running this script:
1. Make sure the backend server is running at ${API_URL}
2. Replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token for an HR or Director user
3. Replace 'EMPLOYEE_ID_HERE' with a valid employee ID from your database
4. Run the script with Node.js: node test-leave-balance-full.js

To run the tests, uncomment the following line:
// runAllTests();
`);

// Uncomment to run all tests
runAllTests();
