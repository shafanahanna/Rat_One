import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, FileText, Check, X, AlertCircle, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

const LeaveApplicationList = ({ userRole, employeeId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    year: new Date().getFullYear(),
    search: '',
  });

  // Fetch leave applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      
      try {
        let endpoint = `${API_URL}/api/leave/applications`;
        let params = {};
        
        // If user is an employee (not HR/Director), only show their applications
        if (!['HR', 'Director', 'DM'].includes(userRole) && employeeId) {
          params.employee_id = employeeId;
        }
        
        // Add filters
        if (filters.status !== 'all') {
          params.status = filters.status;
        }
        
        params.year = filters.year;
        
        if (filters.search) {
          params.search = filters.search;
        }
        
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` },
          params
        });
        
        if (response.data && response.data.data) {
          setApplications(response.data.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Error fetching leave applications:', err);
        setError('Failed to load leave applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [API_URL, userRole, employeeId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filter change will trigger the useEffect to reload data
  };

  const handleApprove = async (applicationId) => {
    if (!confirm('Are you sure you want to approve this leave application?')) return;
    
    try {
      await axios.post(`${API_URL}/api/leave/approvals`, {
        leave_application_id: applicationId,
        status: 'approved',
        comments: 'Approved by manager'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      // Refresh the list
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      console.error('Error approving leave:', err);
      alert('Failed to approve leave application. Please try again.');
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    try {
      await axios.post(`${API_URL}/api/leave/approvals`, {
        leave_application_id: applicationId,
        status: 'rejected',
        comments: reason || 'Rejected by manager'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      // Refresh the list
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      console.error('Error rejecting leave:', err);
      alert('Failed to reject leave application. Please try again.');
    }
  };

  const handleCancel = async (applicationId) => {
    if (!confirm('Are you sure you want to cancel this leave application?')) return;
    
    try {
      await axios.patch(`${API_URL}/api/leave/applications/${applicationId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      // Refresh the list
      setFilters(prev => ({ ...prev }));
    } catch (err) {
      console.error('Error cancelling leave:', err);
      alert('Failed to cancel leave application. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Applications</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50"
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
          
          <form onSubmit={handleSearch} className="w-full md:w-2/4 flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by employee name or leave type"
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50 pl-10 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-[#47BCCB] text-white px-4 py-2 rounded-r-md hover:bg-[#3a9ca9] transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Applications List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#47BCCB]"></div>
          <p className="mt-2 text-gray-500">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No leave applications found.</p>
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
                  Duration
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.employee?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.leave_type?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>
                        {format(new Date(application.start_date), 'MMM d, yyyy')} - {format(new Date(application.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{application.number_of_days}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(application.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* View Details Button */}
                      <button
                        onClick={() => alert('View details functionality to be implemented')}
                        className="text-[#47BCCB] hover:text-[#3a9ca9] p-1 rounded-full hover:bg-gray-100"
                        title="View Details"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      
                      {/* Conditional Buttons based on status and user role */}
                      {application.status === 'pending' && (
                        <>
                          {/* Approve Button - Only for managers/HR */}
                          {['HR', 'Director', 'DM'].includes(userRole) && (
                            <button
                              onClick={() => handleApprove(application.id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          
                          {/* Reject Button - Only for managers/HR */}
                          {['HR', 'Director', 'DM'].includes(userRole) && (
                            <button
                              onClick={() => handleReject(application.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                              title="Reject"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                          
                          {/* Cancel Button - For the employee who applied */}
                          {(!employeeId || application.employee_id === employeeId) && (
                            <button
                              onClick={() => handleCancel(application.id)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                              title="Cancel"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationList;
