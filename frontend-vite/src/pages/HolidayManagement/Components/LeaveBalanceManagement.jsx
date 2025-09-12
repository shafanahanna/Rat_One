import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlertCircle, Save, Plus, Trash2, UserX, Edit, Users, Calendar, Info, CheckCircle, Briefcase, Umbrella, Clock, X } from 'lucide-react';

const LeaveBalanceManagement = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [globalLeaveConfig, setGlobalLeaveConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New leave type state
  const [showAddLeaveForm, setShowAddLeaveForm] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    description: '',
    maxDays: 0,
    color: '#47BCCB',
    isPaid: true
  });
  const modalRef = useRef(null);


  const API_URL = process.env.REACT_APP_API_URL;
  // Generate year options (current year and next 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  useEffect(() => {
    // Check permissions first
    if (checkPermission()) {
      // Leave types functionality has been removed
    }
  }, []);

  
  // Check if user has HR or Director role
  const checkPermission = () => {
    if (userRole !== 'HR' && userRole !== 'Director') {
      console.error('Permission denied: User does not have HR or Director role');
      setPermissionError(true);
      return false;
    }
    return true;
  };
  
  // Fetch global leave configuration
  const fetchGlobalLeaveConfig = async () => {
    if (leaveTypes.length === 0) return;
    
    setLoading(true);
    
    try {
      // Fetch global leave configuration
      const response = await axios.get(`${API_URL}/api/leave/global-config`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` },
        params: { year: selectedYear }
      });
      
      let configData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        configData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        configData = response.data;
      }
      
      // If no configuration exists yet, create default entries for each leave type
      if (configData.length === 0) {
        const defaultConfig = leaveTypes.map(leaveType => ({
          leave_type_id: leaveType.id,
          leave_type_name: leaveType.name,
          allocated_days: 0,
          year: selectedYear
        }));
        
        setGlobalLeaveConfig(defaultConfig);
      } else {
        // Map existing configuration to our format
        const formattedConfig = leaveTypes.map(leaveType => {
          const existingConfig = configData.find(c => c.leave_type_id === leaveType.id);
          return {
            leave_type_id: leaveType.id,
            leave_type_name: leaveType.name,
            allocated_days: existingConfig ? existingConfig.allocated_days || 0 : 0,
            year: selectedYear
          };
        });
        
        setGlobalLeaveConfig(formattedConfig);
      }
      
      setSuccess('Global leave configuration loaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error fetching global leave configuration:', err);
      setError(`Failed to load global leave configuration: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leaveTypes.length > 0) {
      fetchGlobalLeaveConfig();
    }
  }, [leaveTypes, selectedYear]);

  // This function is kept for reference but not used in the global config approach
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    setPermissionError(false);

    // Check if user has HR or Director role
    if (userRole !== 'HR' && userRole !== 'Director') {
      console.error('Permission denied: User does not have HR or Director role');
      setPermissionError(true);
      setError('You do not have permission to access employee data. HR or Director role required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if response has data in any format
      if (response.data) {
        // Handle different possible response formats
        if (response.data.data && Array.isArray(response.data.data)) {
          setEmployees(response.data.data);
          if (response.data.data.length === 0) {
            setError('No employees found in the system. Please add employees first.');
          }
        } else if (Array.isArray(response.data)) {
          setEmployees(response.data);
          if (response.data.length === 0) {
            setError('No employees found in the system. Please add employees first.');
          }
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Unexpected API response format');
        }
      } else {
        setError('No data received from API');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(`Failed to load employees: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    setLoading(true);
    setError('');
    
    // Leave types functionality has been removed
  };

  // Handle allocation change for a leave type
  const handleAllocationChange = (index, value) => {
    const updatedConfig = [...globalLeaveConfig];
    updatedConfig[index] = {
      ...updatedConfig[index],
      allocated_days: value
    };
    setGlobalLeaveConfig(updatedConfig);
  };

  const saveLeaveBalance = async (leaveTypeId, allocatedDays) => {
    setLoading(true);
    setError('');
    try {
      // Format data according to what the backend expects
      const accrualRules = {
        year: selectedYear,
        leaveTypes: [{
          leave_type_id: leaveTypeId,
          allocated_days: allocatedDays
        }]
      };
      
      await axios.post(`${API_URL}/api/leave/global-config`, {
        accrualRules: accrualRules
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      setSuccess('Global leave configuration updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving leave configuration:', err);
      setError(`Failed to save leave configuration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveAllBalances = async () => {
    setLoading(true);
    setError('');
    try {
      // Transform the leave config data into the new format
      const accrualRules = {};
      
      // Process each leave type and create accrual rules
      globalLeaveConfig.forEach(config => {
        if (!config.leave_type_name) {
          console.warn('Leave type name missing for config:', config);
          return; // Skip this item
        }
        const typeKey = config.leave_type_name.toLowerCase().replace(' ', '_');
        accrualRules[typeKey] = {
          max_annual: parseInt(config.allocated_days) || 0,
          monthly_accrual: config.leave_type_name.toLowerCase().includes('sick'),
          annual_allocation: parseInt(config.allocated_days) || 0
        };
      });
      
      // Default policy values
      const policy = {
        annual_reset: true,
        carry_forward_limit: 5,
        min_service_days: 90,
        pro_rata_calculation: true,
        weekend_days: [0, 6], // Sunday and Saturday
        approval_required: true,
        max_consecutive_days: 15,
        notice_period_days: 7
      };
      
      // Send the new format to the API
      await axios.post(`${API_URL}/api/leave/global-config`, {
        policy,
        accrualRules
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Admintoken')}` }
      });
      
      setSuccess('Global leave configuration updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving global leave configuration:', err);
      setError(`Failed to save global leave configuration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Create new leave type
  const createNewLeaveType = async (e) => {
    e.preventDefault();
    if (!checkPermission()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('Admintoken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/leave/types`,
        newLeaveType,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        setSuccess(`New leave type "${newLeaveType.name}" created successfully!`);
        // Reset form
        setNewLeaveType({
          name: '',
          description: '',
          maxDays: 0,
          color: '#47BCCB',
          isPaid: true
        });
        // Close modal
        setShowAddLeaveForm(false);
        // Refresh global config
        setTimeout(() => fetchGlobalLeaveConfig(), 500);
      } else {
        setError('Failed to create new leave type. Please try again.');
      }
    } catch (err) {
      console.error('Error creating leave type:', err);
      setError(`Failed to create leave type: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddLeaveForm(false);
      }
    };
    
    if (showAddLeaveForm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddLeaveForm]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Leave Schemes</h2>
        <p className="mt-1 text-sm text-gray-500">Configure leave schemes for employees</p>
      </div>
      
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Scheme Configuration</h1>
          <p className="text-gray-600 mt-2">Set default leave allocations for all employees</p>
        </div>

        {/* Year Selector */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-block w-40">
            <select
              id="year"
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-[#47BCCB] focus:border-[#47BCCB]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                {permissionError ? (
                  <UserX className="h-5 w-5 text-red-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                {permissionError && (
                  <p className="text-xs text-red-600 mt-1">
                    This feature requires HR or Director role permissions. Please contact your administrator if you believe this is an error.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Leave Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {loading ? (
            <div className="col-span-2 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47BCCB]"></div>
            </div>
          ) : globalLeaveConfig.length > 0 ? (
            globalLeaveConfig.map((config, index) => (
              <div key={config.leave_type_id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 flex items-start">
                  <div className={`rounded-full p-3 mr-4 ${getLeaveTypeColor(config.leave_type_name)}`}>
                    {getLeaveTypeIcon(config.leave_type_name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{config.leave_type_name}</h3>
                    <p className="text-sm text-gray-500">Annual allocation for all employees</p>
                  </div>
                </div>
                
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      {isEditing ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-[#47BCCB] focus:border-[#47BCCB] text-2xl font-semibold"
                            value={config.allocated_days}
                            onChange={(e) => handleAllocationChange(index, parseInt(e.target.value) || 0)}
                          />
                          <span className="ml-2 text-2xl font-semibold text-gray-700">days</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">{config.allocated_days}</span>
                          <span className="ml-2 text-lg text-gray-600">days</span>
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <button
                        onClick={() => saveLeaveBalance(config.leave_type_id, config.allocated_days)}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#47BCCB] hover:bg-[#3da7b4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47BCCB] disabled:opacity-50"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="text-[#47BCCB] mr-1">•</span> 
                      <span>Applies to all employees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#47BCCB] mr-1">•</span> 
                      <span>Resets annually on January 1st</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#47BCCB] mr-1">•</span> 
                      <span>Usage tracked individually per employee</span>
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
              <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No leave types found. Please add leave types first.</p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            type="button"
            className={`px-6 py-3 text-base font-medium rounded-md shadow-md ${isEditing ? 'bg-gray-200 text-gray-700' : 'bg-[#47BCCB] text-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47BCCB] transition-colors duration-200`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Edit className="w-5 h-5 mr-2 inline" />
                Exit Editing Mode
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2 inline" />
                Edit Leave Schemes
              </>
            )}
          </button>
          
          {isEditing && (
            <button
              onClick={saveAllBalances}
              disabled={loading}
              className="px-6 py-3 text-base font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              <Save className="w-5 h-5 mr-2 inline" />
              {loading ? 'Saving...' : 'Update All Leave Schemes'}
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setShowAddLeaveForm(true)}
            className="px-6 py-3 text-base font-medium rounded-md shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Add New Leave Type
          </button>
        </div>
        
        {/* Guidelines Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Leave Calculation Guidelines</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-purple-100 p-2 mr-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-800">Allocation Period</h4>
              </div>
              <p className="text-sm text-gray-600">Leave allocations are applied annually and reset at the beginning of each calendar year.</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-blue-100 p-2 mr-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800">Global Application</h4>
              </div>
              <p className="text-sm text-gray-600">These leave rates apply to all employees regardless of their role or tenure in the company.</p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-green-100 p-2 mr-2">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-800">No Retroactive Effect</h4>
              </div>
              <p className="text-sm text-gray-600">Changes to these rates will only apply to future leave requests and won't affect existing approved leaves.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for adding new leave type */}
      {showAddLeaveForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#47BCCB] px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Add New Leave Type</h3>
              <button 
                onClick={() => setShowAddLeaveForm(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={createNewLeaveType} className="p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type Name*
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#47BCCB] focus:border-[#47BCCB]"
                  value={newLeaveType.name}
                  onChange={(e) => setNewLeaveType({...newLeaveType, name: e.target.value})}
                  placeholder="e.g. Annual Leave"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="3"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#47BCCB] focus:border-[#47BCCB]"
                  value={newLeaveType.description}
                  onChange={(e) => setNewLeaveType({...newLeaveType, description: e.target.value})}
                  placeholder="Brief description of this leave type"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="maxDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Days Allocation*
                </label>
                <input
                  type="number"
                  id="maxDays"
                  min="0"
                  required
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#47BCCB] focus:border-[#47BCCB]"
                  value={newLeaveType.maxDays}
                  onChange={(e) => setNewLeaveType({...newLeaveType, maxDays: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="color"
                    className="h-10 w-10 border-gray-300 rounded-md shadow-sm focus:ring-[#47BCCB] focus:border-[#47BCCB] mr-2"
                    value={newLeaveType.color}
                    onChange={(e) => setNewLeaveType({...newLeaveType, color: e.target.value})}
                  />
                  <span className="text-sm text-gray-500">{newLeaveType.color}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPaid"
                    className="h-4 w-4 text-[#47BCCB] focus:ring-[#47BCCB] border-gray-300 rounded"
                    checked={newLeaveType.isPaid}
                    onChange={(e) => setNewLeaveType({...newLeaveType, isPaid: e.target.checked})}
                  />
                  <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                    Paid Leave
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeaveForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#47BCCB] hover:bg-[#3da7b4] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47BCCB] disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Leave Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on leave type
const getLeaveTypeColor = (leaveTypeName) => {
  const type = leaveTypeName.toLowerCase();
  if (type.includes('sick') || type.includes('medical')) {
    return 'bg-red-100 text-red-600';
  } else if (type.includes('annual') || type.includes('vacation')) {
    return 'bg-blue-100 text-blue-600';
  } else if (type.includes('casual')) {
    return 'bg-green-100 text-green-600';
  } else if (type.includes('maternity') || type.includes('paternity')) {
    return 'bg-purple-100 text-purple-600';
  } else if (type.includes('unpaid')) {
    return 'bg-gray-100 text-gray-600';
  } else {
    return 'bg-[#e6f7fa] text-[#47BCCB]';
  }
};

// Helper function to get icon based on leave type
const getLeaveTypeIcon = (leaveTypeName) => {
  const type = leaveTypeName.toLowerCase();
  if (type.includes('sick') || type.includes('medical')) {
    return <AlertCircle className="h-5 w-5" />;
  } else if (type.includes('annual') || type.includes('vacation')) {
    return <Umbrella className="h-5 w-5" />;
  } else if (type.includes('casual')) {
    return <Calendar className="h-5 w-5" />;
  } else if (type.includes('maternity') || type.includes('paternity')) {
    return <Users className="h-5 w-5" />;
  } else if (type.includes('unpaid')) {
    return <Clock className="h-5 w-5" />;
  } else {
    return <Briefcase className="h-5 w-5" />;
  }
};

export default LeaveBalanceManagement;
