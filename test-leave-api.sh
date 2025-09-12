#!/bin/bash

# Replace this with your actual admin token from localStorage
TOKEN="YOUR_ADMIN_TOKEN"
API_URL="http://localhost:4000"

echo "=== Testing Leave Applications API with status filters ==="

echo -e "\n1. Testing with 'pending' status filter:"
curl -X GET "$API_URL/api/leave-management/leave-applications?status=pending" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Admintoken: $TOKEN"

echo -e "\n\n2. Testing with 'approved' status filter:"
curl -X GET "$API_URL/api/leave-management/leave-applications?status=approved" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Admintoken: $TOKEN"

echo -e "\n\n3. Testing with 'rejected' status filter:"
curl -X GET "$API_URL/api/leave-management/leave-applications?status=rejected" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Admintoken: $TOKEN"

echo -e "\n\n4. Testing with no status filter (all applications):"
curl -X GET "$API_URL/api/leave-management/leave-applications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Admintoken: $TOKEN"

echo -e "\n\n=== Testing Leave Balance Status API ==="
curl -X GET "$API_URL/api/leave-management/leave-balances/status/2023" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Admintoken: $TOKEN"

echo -e "\n"
