// API Connection Test Script
const axios = require('axios');

// Get API URL from .env file or use default
require('dotenv').config();
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

// Mock token for testing
const mockToken = 'YOUR_JWT_TOKEN_HERE';

// Test endpoints
async function testApiConnections() {
  console.log('🔍 Testing API connections...');
  console.log(`🌐 API URL: ${API_URL}`);
  
  // Array of endpoints to test
  const endpoints = [
    { name: 'Leave Types', url: '/api/leave-management/types', method: 'get' },
    { name: 'Leave Balances', url: '/api/leave-management/leave-balances', method: 'get' },
    { name: 'Leave Applications', url: '/api/leave-management/leave-applications', method: 'get' },
    { name: 'Leave Approvals', url: '/api/leave-management/leave-approvals', method: 'get' },
    { name: 'Leave Global Config', url: '/api/leave-management/global-config', method: 'get' }
  ];
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔄 Testing ${endpoint.name}...`);
      
      // Create request config
      const config = {
        method: endpoint.method,
        url: `${API_URL}${endpoint.url}`,
        headers: { 
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log(`📡 Request: ${config.method.toUpperCase()} ${config.url}`);
      
      // Make the request
      const response = await axios(config);
      
      // Log the response status
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      console.log(`📊 Response data structure: ${Object.keys(response.data).join(', ')}`);
    } catch (error) {
      // Log any errors
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`📝 Status: ${error.response.status}`);
        console.log(`📝 Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  }
  
  console.log('\n✨ API connection test completed');
}

// Run the tests
testApiConnections();
