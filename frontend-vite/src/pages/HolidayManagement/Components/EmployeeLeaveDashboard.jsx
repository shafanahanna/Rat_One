import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, ChevronRight, Plus, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import LeaveCalendarView from './LeaveCalendarView';
import LeaveApplicationForm from './LeaveApplicationForm';
import { fetchEmployeeProfile } from '../../../redux/slices/employeeSlice';

const EmployeeLeaveDashboard = ({ onApplySuccess }) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  const dispatch = useDispatch();
  
  // Get employee data from Redux store
  const currentEmployee = useSelector(state => state.employees?.currentEmployee);
  const employeeLoading = useSelector(state => state.employees?.profileLoading) || false;
  const userRole = localStorage.getItem('role');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar');       
  
  const API_URL =import.meta.env.VITE_API_URL;
  // Get URL search params to detect refresh requests
  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const refreshParam = searchParams.get('refresh');

  // We rely on the parent component to fetch the employee profile
  // This component will use the currentEmployee from Redux state once it's available

  // Function to fetch leave balances and applications
  const fetchLeaveData = async () => {
    if (!currentEmployee) {
      return;
    }
    
    setLoading(true);
    try {
      // Use employee ID directly from Redux state
      const employeeId = currentEmployee.id;
      
      const balanceResponse = await axios.get(`${API_URL}/api/leave-management/leave-balances/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      console.log('Raw balance response:', balanceResponse);
      console.log('Balance response data:', balanceResponse.data);
      console.log('Balance data array:', balanceResponse.data.data);
      
      // Always use the data property from the response, which should be an array
      // If success is false, the backend should still provide an empty array in data
      let balanceData = balanceResponse.data.data || [];
      
      // Check if we have a message in the response (might indicate permission issue)
      if (balanceResponse.data.message) {
        console.warn('Message in balance response:', balanceResponse.data.message);
        
        // Don't show the permission error to the user since we've fixed it in the backend
        // Just log it for debugging purposes
        if (balanceResponse.data.message === 'You can only view your own leave balances') {
          console.log('Permission issue detected, but continuing with available data');
        } else if (!balanceResponse.data.success) {
          // Only set error if it's not the permission message we're handling
          setError(balanceResponse.data.message);
        }
      }
      
      // Ensure balanceData is always an array
      if (!Array.isArray(balanceData)) {
        console.log('Converting balance data to array:', balanceData);
        balanceData = Object.keys(balanceData || {}).length > 0 ? [balanceData] : [];
      }
      
      setLeaveBalances(balanceData);
      console.log('Leave balances after setting:', leaveBalances);
      
      // For HR users, we need to explicitly pass their employee_id
      const applicationsResponse = await axios.get(`${API_URL}/api/leave-management/leave-applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` },
        params: { employee_id: employeeId }
      });
        
      const allApplications = applicationsResponse.data.data || [];
        
      // Filter for leave history (all applications)
      setLeaveHistory(allApplications);
        
      // Filter for upcoming approved leaves (future dates that are approved)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
        
      const upcoming = allApplications.filter(leave => {
        const startDate = new Date(leave.start_date);
        return startDate >= today && leave.status === 'Approved';
      });
        
      setUpcomingLeaves(upcoming);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leave data:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
        
      // Set more descriptive error message
      let errorMessage = 'Failed to load leave information. ';
      if (err.response) {
        errorMessage += `Server responded with status ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage += 'No response received from server. Please check your network connection.';
      } else {
        errorMessage += err.message;
      }
        
      setError(errorMessage);
      setLoading(false);
    }
  };


  useEffect(() => {
    // Only fetch data when employee profile is loaded
    if (currentEmployee?.id) {
      console.log('Current employee found, fetching leave data:', currentEmployee);
      fetchLeaveData();
    } else if (!employeeLoading && !currentEmployee) {
      // If not loading but no employee data, show error
      console.error('No employee data available after loading completed');
      setError('Unable to load employee data. Please refresh the page.');
      setLoading(false);
    } else if (employeeLoading) {
      console.log('Employee data is still loading...');
    }
  }, [currentEmployee?.id, employeeLoading, refreshParam]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <Clock className="w-4 h-4" /> 
      },
      'Approved': { 
        color: 'bg-green-100 text-green-800', 
        icon: <CheckCircle className="w-4 h-4" /> 
      },
      'Rejected': { 
        color: 'bg-red-100 text-red-800', 
        icon: <XCircle className="w-4 h-4" /> 
      }
    };

    const config = statusConfig[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: <AlertCircle className="w-4 h-4" /> 
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (employeeLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#47BCCB]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#47BCCB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Leave Dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle successful leave application
  const handleLeaveApplicationSuccess = () => {
    setShowLeaveModal(false);
    fetchLeaveData();
    if (onApplySuccess) {
      onApplySuccess();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header with Apply Button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Leave Dashboard</h1>
             
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setRefreshParam(Date.now());
                  setLoading(true);
                  setError(null);
                  console.log('Manually refreshing leave data...');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
                disabled={loading}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="bg-[#47BCCB] hover:bg-[#3da7b6] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Apply for Leave
              </button>
            </div>
          </div>
          
        

          {/* Leave Balance Summary */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Leave Balance Summary</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaveBalances.length === 0 ? (
                  <div key="no-leave-balance" className="col-span-full text-center text-gray-500 py-8">
                    No leave balance information available
                  </div>
                ) : (
                  leaveBalances.map((balance, index) => (
                    <div 
                      key={balance.id || `leave-balance-${index}`} 
                      className="p-4 rounded-lg border"
                      style={{ borderColor: balance.color || '#e2e8f0' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{balance.leaveType.name}</h4>
                          <p className="text-2xl font-bold text-gray-700">{balance.remaining_days}</p>
                          <p className="text-sm text-gray-500">days remaining</p>
                        </div>
                        <div 
                          className="h-12 w-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: balance.color || '#47BCCB' }}
                        >
                          <Calendar className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>Used: {balance.used_days} days</span>
                        <span>Remaining: {balance.remaining_days} days</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'calendar'
                      ? 'border-[#47BCCB] text-[#47BCCB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 inline-block mr-2" />
                  Calendar View
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-[#47BCCB] text-[#47BCCB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-5 h-5 inline-block mr-2" />
                  Leave History
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming'
                      ? 'border-[#47BCCB] text-[#47BCCB]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ChevronRight className="w-5 h-5 inline-block mr-2" />
                  Upcoming Leaves
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'calendar' && (
                <div>
                  <LeaveCalendarView leaves={leaveHistory} />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied On
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaveHistory.length === 0 ? (
                        <tr key="no-leave-applications">
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                            No leave applications found
                          </td>
                        </tr>
                      ) : (
                        leaveHistory.map((leave) => (
                          <tr key={leave.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2" 
                                  style={{ backgroundColor: leave.color }}
                                ></div>
                                <div className="text-sm font-medium text-gray-900">
                                  {leave.leave_type}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {leave.working_days}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(leave.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(leave.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'upcoming' && (
                <div>
                  {upcomingLeaves.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming approved leaves
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingLeaves.map((leave) => (
                        <div key={leave.id} className="flex items-center p-4 border rounded-lg">
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white mr-4"
                            style={{ backgroundColor: leave.color }}
                          >
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{leave.leave_type}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(leave.start_date)} - {formatDate(leave.end_date)} ({leave.working_days} days)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#F8F9FA] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-white rounded-t-xl">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-[#1A73E8] mr-2" />
                <h3 className="text-lg font-medium text-[#202124]">Apply for Leave</h3>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <LeaveApplicationForm onSuccess={handleLeaveApplicationSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveDashboard;
