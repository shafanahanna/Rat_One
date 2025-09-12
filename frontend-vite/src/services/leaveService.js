import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with auth token
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Admintoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Leave Types API
const getLeaveTypes = async () => {
  try {
    // Updated to use the refactored API path
    const response = await axiosInstance.get('/api/leave-management/types');
    return response.data;
  } catch (error) {
    console.error('Error fetching leave types:', error.response?.data || error.message);
    throw error;
  }
};

const createLeaveType = async (leaveTypeData) => {
  try {
    const response = await axiosInstance.post('/api/leave-management/types', leaveTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLeaveType = async (id, leaveTypeData) => {
  try {
    const response = await axiosInstance.patch(`/api/leave-management/types/${id}`, leaveTypeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteLeaveType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/leave-management/types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deactivateLeaveType = async (id) => {
  try {
    const response = await axiosInstance.patch(`/api/leave-management/types/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Leave Applications API
const getLeaveApplications = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/api/leave-management/leave-applications', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLeaveApplicationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/leave-management/leave-applications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createLeaveApplication = async (leaveApplicationData) => {
  try {
    // Updated to use the refactored API path
    const response = await axiosInstance.post('/api/leave-management/leave-applications', leaveApplicationData);
    console.log('Leave application submission response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating leave application:', error.response?.data || error.message);
    
    // Try fallback to direct axios call if the service fails
    try {
      const token = localStorage.getItem('Admintoken');
      const directResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leave-management/leave-applications`, 
        leaveApplicationData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Direct leave application submission response:', directResponse);
      return directResponse.data;
    } catch (directError) {
      console.error('Direct API call failed:', directError);
      throw directError;
    }
  }
};

const updateLeaveApplication = async (id, leaveApplicationData) => {
  try {
    const response = await axiosInstance.patch(`/api/leave-management/leave-applications/${id}`, leaveApplicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelLeaveApplication = async (id) => {
  try {
    const response = await axiosInstance.patch(`/api/leave-management/leave-applications/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getEmployeeLeaveApplications = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/api/leave-management/leave-applications/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserLeaveApplications = async (userId) => {
  try {
    // First get the employee ID using the user ID
    const employeeResponse = await getEmployeeByUserId(userId);
    if (employeeResponse && employeeResponse.data && employeeResponse.data.id) {
      // Then get leave applications using the employee ID
      return getEmployeeLeaveApplications(employeeResponse.data.id);
    } else {
      throw new Error('Employee not found for this user');
    }
  } catch (error) {
    throw error;
  }
};

// Leave Balances API
const getLeaveBalances = async (employeeIdOrParams = {}) => {
  try {
    // Handle both formats: either an employeeId string or a params object
    let url = '/api/leave-management/leave-balances';
    let params = {};
    
    if (typeof employeeIdOrParams === 'string') {
      // If it's a string, assume it's an employee ID
      url = `/api/leave-management/leave-balances/employee/${employeeIdOrParams}`;
    } else if (typeof employeeIdOrParams === 'object') {
      // If it's an object, use it as params
      params = employeeIdOrParams;
    }
    
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllLeaveBalances = async () => {
  try {
    const response = await axiosInstance.get('/api/leave-management/leave-balances');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getEmployeeLeaveBalances = async (employeeId, year) => {
  try {
    const response = await axiosInstance.get(`/api/leave-management/leave-balances/employee/${employeeId}`, { 
      params: { year }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createLeaveBalance = async (leaveBalanceData) => {
  try {
    const response = await axiosInstance.post('/api/leave-management/leave-balances', leaveBalanceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateLeaveBalance = async (id, leaveBalanceData) => {
  try {
    const response = await axiosInstance.patch(`/api/leave-management/leave-balances/${id}`, leaveBalanceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Employee API
const getEmployeeByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/employees/by-user/${userId}`);
    console.log('Employee service response:', response.data);
    return response.data; // Return the full response data to let the component handle the structure
  } catch (error) {
    console.error('Error fetching employee by user ID:', error.response?.data || error.message);
    throw error;
  }
};

// Leave Approvals API
const approveLeaveApplication = async (leaveApprovalData) => {
  try {
    const response = await axiosInstance.post('/api/leave-management/leave-approvals', {
      ...leaveApprovalData,
      status: 'approved'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const rejectLeaveApplication = async (leaveApprovalData) => {
  try {
    const response = await axiosInstance.post('/api/leave-management/leave-approvals', {
      ...leaveApprovalData,
      status: 'rejected'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPendingApprovals = async () => {
  try {
    const response = await axiosInstance.get('/api/leave-management/leave-applications/pending-approvals');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLeaveApprovalsByApplication = async (leaveApplicationId) => {
  try {
    const response = await axiosInstance.get(`/api/leave-management/leave-approvals/leave-application/${leaveApplicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Leave Balance Population
const populateLeaveBalances = async (year) => {
  try {
    // Try the standard API call first
    const response = await axiosInstance.post('/api/leave-management/leave-balances/populate', null, {
      params: { year }
    });
    return response.data;
  } catch (error) {
    console.error('Error populating leave balances:', error);
    
    // Try fallback to direct axios call if the service fails
    try {
      const token = localStorage.getItem('Admintoken');
      const directResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leave-management/leave-balances/populate`, 
        null,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: { year }
        }
      );
      console.log('Direct leave balance population response:', directResponse);
      return directResponse.data;
    } catch (directError) {
      console.error('Direct API call failed:', directError);
      throw directError;
    }
  }
};

// getLeaveBalanceStatus method removed - implemented directly in LeaveApprovalDashboard

export const leaveService = {
  // Leave Types
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  deactivateLeaveType,
  
  // Leave Applications
  getLeaveApplications,
  getLeaveApplicationById,
  createLeaveApplication,
  updateLeaveApplication,
  cancelLeaveApplication,
  getEmployeeLeaveApplications,
  getUserLeaveApplications,
  
  // Leave Balances
  getLeaveBalances,
  getAllLeaveBalances,
  getEmployeeLeaveBalances,
  createLeaveBalance,
  updateLeaveBalance,
  populateLeaveBalances,
  
  // Employee
  getEmployeeByUserId,
  
  // Leave Approvals
  approveLeaveApplication,
  rejectLeaveApplication,
  getPendingApprovals,
  getLeaveApprovalsByApplication
};

export default leaveService;
