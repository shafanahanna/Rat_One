import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  Filter,
  Users,
  Clock,
  BarChart
} from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeProfile } from '../../../redux/slices/employeeSlice';
import { initializeAuth } from '../../../redux/slices/authSlice';

const LeaveApprovalDashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth?.currentUser);
  const currentEmployee = useSelector(state => state.employees?.currentEmployee);
  const employeeLoading = useSelector(state => state.employees?.profileLoading) || false;
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('Admintoken');
    console.log('Initial auth check - Token exists:', !!token);
    
    // Only proceed with API calls if we have authentication
    if (token) {
      // Initialize authentication if currentUser is null
      if (!currentUser) {
        console.log('Current user is null, initializing authentication from localStorage');
        dispatch(initializeAuth());
      }
      
      // Fetch employee profile if not already in Redux state
      if (!currentEmployee && !employeeLoading) {
        console.log('Fetching employee profile');
        dispatch(fetchEmployeeProfile());
      }
      
      // Fetch leaves on component mount
      getLeaves(activeTab);
    } else {
      console.error('No authentication token found. Please log in again.');
      setError('Authentication required. Please log in again.');
    }
  }, [currentUser, currentEmployee, employeeLoading, dispatch]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [balanceStatus, setBalanceStatus] = useState(null);
  const [balanceYear, setBalanceYear] = useState(new Date().getFullYear());
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [comments, setComments] = useState('');
  const [processingApproval, setProcessingApproval] = useState(false);

  const fetchLeaves = async (status = 'pending') => {
    setLoading(true);
    try {
      console.log('=== FRONTEND API REQUEST ===');
      console.log(`Tab selected: ${status}`);
      console.log(`Current user:`, currentUser);
      console.log(`Department filter:`, selectedDepartment);
      
      // Initialize params object first
      const params = {};
      
      // Use the correct endpoints based on status
      let endpoint = '/api/leave-management/leave-applications';
      
      if (status !== 'all') {
        // Use lowercase status values to match backend expectations
        params.status = status.toLowerCase();
      }
      
      // Add department filter if selected
      if (selectedDepartment) {
        params.department = selectedDepartment;
      }
      
      console.log(`API endpoint: ${endpoint}`);
      console.log(`API parameters:`, params);
      
      // Get the token from localStorage
      const token = localStorage.getItem('Admintoken');
      console.log('Token exists:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // For debugging: Check if token is valid by decoding it
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
          
          // Check if token is expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.error('Token is expired!');
            throw new Error('Authentication token is expired. Please log in again.');
          }
        }
      } catch (tokenError) {
        console.warn('Could not decode token:', tokenError);
      }
      
      // Make the API request with proper authorization header
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Admintoken': token, // Add this as some endpoints might expect it directly
        'Content-Type': 'application/json'
      };
      
      console.log('Request headers:', headers);
      console.log('Full request URL:', `${API_URL}${endpoint}`);
      console.log('================================');
      
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers,
        params
      });
      
      console.log('=== FRONTEND API RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response data:', response.data);
      console.log('Data type:', typeof response.data);
      
      // Check if we have data in the expected format
      if (response.data && response.data.data) {
        console.log('Data found in response.data.data');
        console.log('Is array:', Array.isArray(response.data.data));
        console.log('Data length:', Array.isArray(response.data.data) ? response.data.data.length : 'not an array');
      } else if (Array.isArray(response.data)) {
        console.log('Data is directly an array in response.data');
        console.log('Data length:', response.data.length);
      }
      
      if ((Array.isArray(response.data) && response.data.length > 0) || 
          (response.data && Array.isArray(response.data.data) && response.data.data.length > 0)) {
        const dataArray = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('First item:', dataArray[0]);
        console.log('First item status:', dataArray[0].status);
        console.log('All statuses:', dataArray.map(item => item.status));
      }
      
      console.log('================================');
      
      return response;
    } catch (error) {
      console.error('=== FRONTEND API ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('================================');
      throw error;
    }
  };
  
  // Wrapper function to handle the response from fetchLeaves
  const getLeaves = async (status = 'pending') => {
    try {
      // Check authentication before proceeding
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await fetchLeaves(status);
      
      console.log('Response headers:', response.headers);
      
      // Handle different response structures
      let leavesData = [];
      console.log('Extracting leave data from response...');
      
      if (Array.isArray(response.data)) {
        // If response.data is already an array
        leavesData = response.data;
        console.log('Using response.data directly as array, length:', leavesData.length);
      } else if (response.data && Array.isArray(response.data.data)) {
        // If response.data.data is an array
        leavesData = response.data.data;
        console.log('Using response.data.data as array, length:', leavesData.length);
      } else if (response.data && typeof response.data === 'object') {
        // If response.data is an object but not in expected format
        console.log('Unexpected response format, trying to extract data');
        console.log('Response data keys:', Object.keys(response.data));
        
        // Try to find an array in the response
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        console.log('Found possible arrays:', possibleArrays.length);
        
        if (possibleArrays.length > 0) {
          leavesData = possibleArrays[0];
          console.log('Found array in response:', leavesData);
        }
      }
      
      // Normalize leave data to ensure consistent structure
      const normalizedLeaves = leavesData.map(leave => ({
        ...leave,
        // Ensure status is capitalized for consistency in UI
        status: leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1).toLowerCase() : 'Pending',
        // Ensure we have employee name
        employee_name: leave.employee?.fullName || leave.employee?.name || leave.employee_name || 'Unknown',
        // Ensure we have leave type
        leave_type: leave.leaveType?.name || leave.leave_type || 'Unknown'
      }));
      
      console.log('Final normalized leaves data:', normalizedLeaves);
      setLeaves(normalizedLeaves);
      
      // Extract unique departments
      const uniqueDepartments = [...new Set(normalizedLeaves.map(leave => leave.department || leave.employee?.department))].filter(Boolean);
      setDepartments(uniqueDepartments);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      // Handle specific authentication errors
      if (err.message.includes('authentication') || err.message.includes('token') || 
          err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication error. Please log in again.');
      } else {
        setError('Failed to load leave applications. Please try again later.');
      }
      
      setLoading(false);
    }
  };

  // Function to get leave balance status directly in the component
  const getLeaveBalanceStatus = async (year) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/leave-management/leave-balances/status/${year}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Admintoken': token,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balance status:', error);
      throw error;
    }
  };

  // Fetch leave balance status
  const fetchBalanceStatus = async () => {
    try {
      const statusData = await getLeaveBalanceStatus(balanceYear);
      setBalanceStatus(statusData);
    } catch (err) {
      console.error('Error fetching balance status:', err);
      // Don't set error state here to avoid disrupting the main UI
    }
  };

  useEffect(() => {
    // Check if we have a token before making API calls
    const token = localStorage.getItem('Admintoken');
    
    if (token) {
      // Fetch leaves when tab, department, or year changes
      getLeaves(activeTab);
      fetchBalanceStatus(); // Fetch balance status when these dependencies change
    }
  }, [activeTab, selectedDepartment, balanceYear]);

  const handleApprovalClick = (leave, action) => {
    setCurrentLeave(leave);
    setApprovalAction(action);
    setComments('');
    setError(''); // Clear any previous errors
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async () => {
    if (!currentLeave || !approvalAction) return;
    
    setProcessingApproval(true);
    try {
      // Get the employee ID from Redux state first
      let approver_id;
      
      // Cascading approach for employee ID resolution
      if (currentEmployee && currentEmployee.id) {
        // 1. First try to get from Redux state
        console.log('Using employee ID from Redux state:', currentEmployee.id);
        approver_id = currentEmployee.id;
      } else {
        // 2. If not in Redux, try localStorage as fallback
        const localStorageEmployeeId = localStorage.getItem('employeeId');
        if (localStorageEmployeeId) {
          console.log('Using employee ID from localStorage:', localStorageEmployeeId);
          approver_id = localStorageEmployeeId;
        } else {
          // 3. Last resort: API calls
          try {
            console.log('Fetching employee ID from API...');
            // Try the profile endpoint first
            const token = localStorage.getItem('Admintoken');
            const employeeResponse = await axios.get(`${API_URL}/api/employees/profile`, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Admintoken': token,
                'Content-Type': 'application/json'
              }
            });
            
            if (employeeResponse.data && employeeResponse.data.data && employeeResponse.data.data.id) {
              approver_id = employeeResponse.data.data.id;
              console.log('Got employee ID from profile API:', approver_id);
            } else if (currentUser && currentUser.id) {
              // If profile doesn't have an ID, try the dedicated endpoint to get employee by user ID
              const userEmployeeResponse = await axios.get(`${API_URL}/api/employees/by-user/${currentUser.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
              });
              
              if (userEmployeeResponse.data && userEmployeeResponse.data.data && userEmployeeResponse.data.data.id) {
                approver_id = userEmployeeResponse.data.data.id;
                console.log('Got employee ID from by-user API:', approver_id);
              } else {
                throw new Error('Could not find employee record for your user account');
              }
            } else {
              throw new Error('No user ID available to fetch employee record');
            }
          } catch (err) {
            console.error('Error resolving employee ID:', err);
            setError('Could not determine your employee ID. Please contact an administrator.');
            setProcessingApproval(false);
            return;
          }
        }
      }
      
      if (!approver_id) {
        setError('Could not determine your employee ID. Please contact an administrator.');
        setProcessingApproval(false);
        return;
      }
      
      // Format status consistently: lowercase as expected by the backend
      const formattedStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      console.log(`Submitting ${formattedStatus} for leave application ${currentLeave.id}`);
      console.log('Request payload:', {
        status: formattedStatus,
        comments: comments,
        approver_id: approver_id
      });
      
      // Get the token from localStorage
      const token = localStorage.getItem('Admintoken');
      console.log('Using token for approval:', token ? 'Token exists' : 'No token found');
      
      // Submit the approval/rejection using PATCH endpoint
      console.log('=== APPROVAL API REQUEST ===');
      console.log(`URL: ${API_URL}/api/leave-management/leave-applications/${currentLeave.id}/status`);
      console.log('Method: PATCH'); // Backend controller uses @Patch()
      console.log('Request body:', {
        status: formattedStatus,
        comments: comments
      });
      console.log('Headers:', {
        'Authorization': 'Bearer [token]', // Don't log the actual token
        'Admintoken': '[token]', // Don't log the actual token
        'Content-Type': 'application/json'
      });
      
      try {
        const response = await axios.patch(
          `${API_URL}/api/leave-management/leave-applications/${currentLeave.id}/status`,
          {
            status: formattedStatus,
            comments: comments
            // approver_id is not needed as it's determined from the JWT token on the server
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Admintoken': token, // Add this as some endpoints might expect it directly
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('=== APPROVAL API RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Response data:', response.data);
        console.log('============================');
      } catch (apiError) {
        console.log('=== APPROVAL API ERROR ===');
        console.log('Error message:', apiError.message);
        if (apiError.response) {
          console.log('Error response:', apiError.response.data);
          console.log('Error status:', apiError.response.status);
        }
        console.log('============================');
        throw apiError; // Re-throw to be caught by the outer catch block
      }
      
      // Refresh the leave data
      await fetchLeaves(activeTab);
      
      // If we're on the pending tab and we just approved/rejected a leave, 
      // the item will disappear from the list. Let's show a success message.
      if (activeTab === 'pending') {
        setSuccess(`Leave application ${formattedStatus} successfully`);
        setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
      }
      
      setShowApprovalModal(false);
      setProcessingApproval(false);
    } catch (error) {
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid request. Please check your inputs and try again.';
        } else if (error.response.status === 401) {
          errorMessage = 'You are not authorized to perform this action.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.response.status === 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setProcessingApproval(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Make sure we have leaves data to display
  console.log('Current leaves state:', leaves);
  console.log('Current activeTab:', activeTab);
  
  // Filter leaves based on active tab and ensure case-insensitive comparison
  const filteredLeaves = activeTab === 'all' 
    ? leaves 
    : leaves.filter(leave => {
        const leaveStatus = (leave.status || '').toLowerCase();
        const tabStatus = activeTab.toLowerCase();
        console.log(`Comparing leave status: ${leaveStatus} with tab: ${tabStatus}`);
        return leaveStatus === tabStatus;
      });

  // Show loading indicator only during initial load
  if (loading && leaves.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47BCCB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-start">
          <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'pending', label: 'Pending', icon: Clock, count: leaves.filter(l => l.status?.toLowerCase() === 'pending').length },
            { key: 'approved', label: 'Approved', icon: CheckCircle, count: leaves.filter(l => l.status?.toLowerCase() === 'approved').length },
            { key: 'rejected', label: 'Rejected', icon: XCircle, count: leaves.filter(l => l.status?.toLowerCase() === 'rejected').length },
            { key: 'all', label: 'All', icon: Users, count: leaves.length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-[#47BCCB] text-[#47BCCB]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-[#47BCCB] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    
      
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Clock className="mr-2 h-6 w-6 text-[#47BCCB]" />
          {activeTab === 'pending' ? 'Pending' : activeTab === 'approved' ? 'Approved' : activeTab === 'rejected' ? 'Rejected' : 'All'} Leave Applications
        </h2>
        
        {departments.length > 0 && (
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pending Leaves List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredLeaves.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p>No {activeTab === 'all' ? '' : activeTab} leave applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'pending' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {leave.employee?.fullName || leave.employee?.name || leave.employee_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {leave.employee?.department || leave.department || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: leave.color }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {leave.leaveType?.name || leave.leave_type || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Number.isInteger(parseFloat(leave.working_days)) ? parseInt(leave.working_days) : leave.working_days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leave.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                      {leave.status?.toLowerCase() !== 'pending' && leave.approver_name && (
                        <div className="text-xs text-gray-500 mt-1">
                          by {leave.approver_name}
                        </div>
                      )}
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprovalClick(leave, 'approve')}
                            className="text-green-600 hover:text-green-800 flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovalClick(leave, 'reject')}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && currentLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {approvalAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Employee:</span>
                  <p className="font-medium">{currentLeave.employee_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Leave Type:</span>
                  <p className="font-medium">{currentLeave.leave_type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date Range:</span>
                  <p className="font-medium">{formatDate(currentLeave.start_date)} - {formatDate(currentLeave.end_date)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Working Days:</span>
                  <p className="font-medium">{Number.isInteger(parseFloat(currentLeave.working_days)) ? parseInt(currentLeave.working_days) : currentLeave.working_days} days</p>
                </div>
              </div>
              
              {currentLeave.reason && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Reason:</span>
                  <p className="mt-1">{currentLeave.reason}</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50 pl-10 py-2"
                  placeholder={approvalAction === 'approve' ? 'Add any approval comments (optional)' : 'Please provide a reason for rejection'}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setError(''); // Clear error when modal is closed
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovalSubmit}
                disabled={processingApproval || (approvalAction === 'reject' && !comments.trim())}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } ${
                  (processingApproval || (approvalAction === 'reject' && !comments.trim()))
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {processingApproval
                  ? 'Processing...'
                  : approvalAction === 'approve'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalDashboard;
