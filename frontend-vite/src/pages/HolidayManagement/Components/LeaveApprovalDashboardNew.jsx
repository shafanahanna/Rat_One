import React, { useState, useEffect } from 'react';
import './GoogleWorkspaceStyles.css';
import { 
  Calendar as CalendarIcon,
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  Filter as FilterIcon,
  Users,
  Clock,
  BarChart,
  Search,
  Menu,
  RefreshCw,
  ChevronDown,
  MoreVertical,
  Info,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeProfile } from '../../../redux/slices/employeeSlice';
import { initializeAuth } from '../../../redux/slices/authSlice';
import LeaveApprovalCard from './LeaveApprovalCard';

const LeaveApprovalDashboardNew = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth?.currentUser);
  const currentEmployee = useSelector(state => state.employees?.currentEmployee);
  const employeeLoading = useSelector(state => state.employees?.profileLoading) || false;
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.VITE_API_URL;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [balanceStatus, setBalanceStatus] = useState(null);
  const [balanceYear, setBalanceYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Stats for dashboard
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('Admintoken');
    
    // Only proceed with API calls if we have authentication
    if (token) {
      // Initialize authentication if currentUser is null
      if (!currentUser) {
        dispatch(initializeAuth());
      }
      
      // Fetch employee profile if not already in Redux state
      if (!currentEmployee && !employeeLoading) {
        dispatch(fetchEmployeeProfile());
      }
      
      // Fetch leaves on component mount
      fetchLeaves(activeTab);
    } else {
      setError('Authentication required. Please log in again.');
    }
  }, [currentUser, currentEmployee, employeeLoading, dispatch]);

  const fetchLeaves = async (status = 'pending') => {
    setLoading(true);
    setIsRefreshing(true);
    
    try {
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
      
      // Get the token from localStorage
      const token = localStorage.getItem('Admintoken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Make the API request with proper authorization header
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers,
        params
      });
      
      // Process the response data
      let leavesData = [];
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        leavesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        leavesData = response.data;
      } else {
        // Try to find an array in the response
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        
        if (possibleArrays.length > 0) {
          leavesData = possibleArrays[0];
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
      
      setLeaves(normalizedLeaves);
      
      // Extract unique departments
      const uniqueDepartments = [...new Set(normalizedLeaves.map(leave => leave.department || leave.employee?.department))].filter(Boolean);
      setDepartments(uniqueDepartments);
      
      // Update stats
      const pendingCount = normalizedLeaves.filter(leave => leave.status.toLowerCase() === 'pending').length;
      const approvedCount = normalizedLeaves.filter(leave => leave.status.toLowerCase() === 'approved').length;
      const rejectedCount = normalizedLeaves.filter(leave => leave.status.toLowerCase() === 'rejected').length;
      
      setStats({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: normalizedLeaves.length
      });
      
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      
      // Handle specific authentication errors
      if (err.message.includes('authentication') || err.message.includes('token') || 
          err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication error. Please log in again.');
      } else {
        setError('Failed to load leave applications. Please try again later.');
      }
      
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to get leave balance status directly in the component
  const fetchBalanceStatus = async () => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/leave-management/leave-balances/status/${balanceYear}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBalanceStatus(response.data);
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
      fetchLeaves(activeTab);
      fetchBalanceStatus(); // Fetch balance status when these dependencies change
    }
  }, [activeTab, selectedDepartment, balanceYear]);

  const handleApprove = async (leaveId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.post(`${API_URL}/api/leave-management/leave-approvals`, 
        { 
          leaveApplicationId: leaveId,
          status: 'approved',
          comments: ''
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the leave data
      await fetchLeaves(activeTab);
      setSuccess('Leave application approved successfully');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError('Failed to approve leave application');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.post(`${API_URL}/api/leave-management/leave-approvals`, 
        { 
          leaveApplicationId: leaveId,
          status: 'rejected',
          comments: ''
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh the leave data
      await fetchLeaves(activeTab);
      setSuccess('Leave application rejected successfully');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError('Failed to reject leave application');
    }
  };

  const handleRefresh = () => {
    fetchLeaves(activeTab);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter leaves based on active tab and search query
  const filteredLeaves = leaves
    .filter(leave => {
      if (activeTab === 'all') return true;
      return leave.status.toLowerCase() === activeTab.toLowerCase();
    })
    .filter(leave => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        leave.employee_name.toLowerCase().includes(query) ||
        leave.leave_type.toLowerCase().includes(query) ||
        (leave.reason && leave.reason.toLowerCase().includes(query))
      );
    });

  // Show loading indicator only during initial load
  if (loading && leaves.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full max-w-full">
      {/* Google-style header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 full-width-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-xl font-normal text-gray-800">Leave Approval Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus-ring focus:outline-none google-tooltip"
                disabled={isRefreshing}
                data-tooltip="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors focus-ring focus:outline-none google-tooltip ${showFilters ? 'bg-gray-100 text-blue-500' : 'text-gray-600'}`}
                data-tooltip="Filters"
              >
                <FilterIcon className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus-ring focus:outline-none google-tooltip"
                data-tooltip="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 full-width-container">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-white border-l-4 border-red-500 shadow-sm rounded-lg p-4 flex items-start google-card">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-white border-l-4 border-green-500 shadow-sm rounded-lg p-4 flex items-start google-card">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{success}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 google-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 google-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 google-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 google-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200 google-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 google-dropdown"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  id="year"
                  value={balanceYear}
                  onChange={(e) => setBalanceYear(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 google-dropdown"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, leave type..."
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-ring"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation - Google Style */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending', icon: Clock, count: stats.pending },
                { key: 'approved', label: 'Approved', icon: CheckCircle, count: stats.approved },
                { key: 'rejected', label: 'Rejected', icon: XCircle, count: stats.rejected },
                { key: 'all', label: 'All', icon: Users, count: stats.total }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center focus-ring focus:outline-none`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-blue-100 text-blue-600'
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
        </div>

        {/* Leave Applications - Card Layout */}
        {filteredLeaves.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200 google-card">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Info className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No leave applications found</h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'There are no pending leave applications to review at this time.'
                : activeTab === 'approved'
                ? 'No approved leave applications found.'
                : activeTab === 'rejected'
                ? 'No rejected leave applications found.'
                : 'No leave applications found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filteredLeaves.map((leave) => (
              <LeaveApprovalCard
                key={leave.id}
                leave={leave}
                onApprove={() => handleApprove(leave.id)}
                onReject={() => handleReject(leave.id)}
                formatDate={formatDate}
                showActions={activeTab === 'pending'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovalDashboardNew;
