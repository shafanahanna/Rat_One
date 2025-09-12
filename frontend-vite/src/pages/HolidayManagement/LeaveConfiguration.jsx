import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Settings, ArrowLeft, Plus, Check, X, ChevronDown, ChevronUp, 
  Edit, Trash2, AlertCircle, Loader2, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomLeaveTypeForm from './Components/CustomLeaveTypeForm';
import { useSelector } from 'react-redux';

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Standard leave types definition
const STANDARD_LEAVE_TYPES = [
  { code: 'CL', name: 'Casual Leave', description: 'Short-term leave for personal matters', defaultDays: 12, isPaid: true },
  { code: 'SL', name: 'Sick Leave', description: 'Leave for health-related issues', defaultDays: 12, isPaid: true },
  { code: 'PL', name: 'Privilege Leave', description: 'Annual leave for personal use', defaultDays: 15, isPaid: true },
  { code: 'ML', name: 'Maternity Leave', description: 'Leave for female employees for childbirth', defaultDays: 180, isPaid: true },
  { code: 'PAL', name: 'Paternity Leave', description: 'Leave for male employees for childbirth', defaultDays: 15, isPaid: true },
  { code: 'BL', name: 'Bereavement Leave', description: 'Leave for family emergencies or death', defaultDays: 3, isPaid: true },
  { code: 'UL', name: 'Unpaid Leave', description: 'Leave without pay', defaultDays: 30, isPaid: false },
  { code: 'WFH', name: 'Work From Home', description: 'Working remotely', defaultDays: 15, isPaid: true },
  { code: 'COMP', name: 'Compensatory Off', description: 'Leave in lieu of working on holidays', defaultDays: 5, isPaid: true }
];

const LeaveConfiguration = () => {
  const navigate = useNavigate();

  // State for leave schemes
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State for error messages
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for new scheme form
  const [showNewSchemeForm, setShowNewSchemeForm] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  
  // State for edit scheme form
  const [showEditSchemeForm, setShowEditSchemeForm] = useState(false);
  const [editSchemeId, setEditSchemeId] = useState(null);
  const [editSchemeName, setEditSchemeName] = useState('');
  const [editSchemeIsActive, setEditSchemeIsActive] = useState(true);
  
  // State for leave type management
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState('');
  const [leaveDays, setLeaveDays] = useState('');
  
  // State for custom leave type modal
  const [showCustomLeaveTypeForm, setShowCustomLeaveTypeForm] = useState(false);
  
  // State for available leave types
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);
  
  // State for paid status toggle
  const [isPaidLeave, setIsPaidLeave] = useState(true);
  const token = useSelector((state) => state.auth.token);
  


  useEffect(() => {
    if (token) {
      fetchLeaveSchemes();
      fetchLeaveTypes();
    } else {
      console.error('Authentication token not available');
      console.log('Authentication error. Please log in again.');
      setErrorMessage('Authentication error. Please log in again.');
    }
  }, [token]);
 
  // Fetch leave schemes and leave types
  const fetchLeaveSchemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leave-management/schemes`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      console.log(response.data.data,"fetch leave schemes");
      // Backend returns data in { success: true, data: [...] } format
      setSchemes(response.data.data.map(scheme => ({
        ...scheme,
        id: scheme.ls_id,
        name: scheme.ls_name,
        is_active: scheme.ls_is_active,
        leaveTypes: [],
        color: getRandomColor(scheme.id) // Assign a color for UI purposes
      })));
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching leave schemes:', error);
      setErrorMessage('Failed to load leave schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leave-management/types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns data in { success: true, data: [...] } format
      setAvailableLeaveTypes(response.data.data.map(type => ({
        ...type,
        isPaid: type.is_paid
      })));
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setErrorMessage('Failed to load leave types. Please try again.');
    }
  };
  
  // Handle custom leave type creation success
  const handleCustomLeaveTypeCreated = (newLeaveType) => {
    // Add the new leave type to the available leave types
    setAvailableLeaveTypes([
      ...availableLeaveTypes,
      {
        ...newLeaveType,
        isPaid: newLeaveType.is_paid
      }
    ]);
    
    // Show success message
    setErrorMessage('');
  };

  const fetchSchemeLeaveTypes = async (schemeId) => {
    try {
      setLoadingLeaveTypes(true);
      const response = await axios.get(`${API_URL}/api/leave-management/schemes/${schemeId}/leave-types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if we have data and it's in the expected format
      if (!response.data || !response.data.data) {
        console.error('Unexpected API response format:', response.data);
        setErrorMessage('Received invalid data format from the server.');
        return;
      }
      
      // Backend returns data in { success: true, data: [...] } format
      setSchemes(schemes.map(scheme => {
        if (scheme.id === schemeId) {
          // If there's no data, use an empty array
          if (!Array.isArray(response.data.data)) {
            return {
              ...scheme,
              leaveTypes: []
            };
          }
          
          // Map the API response to the expected format
          const mappedLeaveTypes = response.data.data.map(type => {
            // For standard leave types that don't have database IDs yet
            if (!type.slt_id && !type.id) {
              // Find the standard leave type by name
              const standardType = STANDARD_LEAVE_TYPES.find(std => 
                std.name === type.leave_type_name || 
                std.name.includes(type.leave_type_name) ||
                type.leave_type_name.includes(std.name)
              );
              
              if (standardType) {
                return {
                  id: `std_${standardType.code}`,
                  name: standardType.name,
                  days: standardType.defaultDays,
                  isPaid: standardType.isPaid
                };
              }
            }
            
            // For database leave types
            return {
              id: type.slt_id || type.id || `temp-${Date.now()}`, 
              name: type.leave_type_name || 'Unknown',
              days: parseInt(type.slt_days_allowed || type.days_allowed || 0),
              isPaid: type.slt_is_paid !== undefined ? type.slt_is_paid : 
                     type.is_paid !== undefined ? type.is_paid : false
            };
          });
          
          return {
            ...scheme,
            leaveTypes: mappedLeaveTypes
          };
        }
        return scheme;
      }));
    } catch (error) {
      console.error(`Error fetching leave types for scheme ${schemeId}:`, error);
      setErrorMessage('Failed to load leave types for this scheme.');
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  // Get a random color based on ID for UI purposes
  const getRandomColor = (id) => {
    const colors = ['blue', 'purple', 'green', 'amber', 'rose', 'cyan', 'emerald', 'indigo'];
    return colors[id % colors.length];
  };

  // Handle edit scheme button click
  const handleEditSchemeClick = (scheme) => {
    setEditSchemeId(scheme.id);
    setEditSchemeName(scheme.name);
    setEditSchemeIsActive(scheme.ls_is_active !== false); // Default to true if undefined
    setShowEditSchemeForm(true);
  };

  // Handle updating a scheme
  const handleUpdateScheme = async () => {
    if (editSchemeName.trim()) {
      try {
        setSubmitting(true);
        const response = await axios.patch(`${API_URL}/api/leave-management/schemes/${editSchemeId}`, 
          { 
            name: editSchemeName,
            is_active: editSchemeIsActive 
          },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        // Update the schemes list with the updated scheme
        setSchemes(schemes.map(scheme => {
          if (scheme.id === editSchemeId) {
            return {
              ...scheme,
            name: editSchemeName,
            is_active: editSchemeIsActive
            };
          }
          return scheme;
        }));
        
        // Reset form and close it
        setEditSchemeId(null);
        setEditSchemeName('');
        setShowEditSchemeForm(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Error updating leave scheme:', error);
        setErrorMessage('Failed to update leave scheme. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setErrorMessage('Please enter a scheme name');
    }
  };

  // Handle adding a new scheme
  const handleAddScheme = async () => {
    if (newSchemeName.trim()) {
      try {
        setSubmitting(true);
        const response = await axios.post(`${API_URL}/api/leave-management/schemes`, 
          { name: newSchemeName },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        console.log(response.data,"response data");
        // Backend returns data in { success: true, data: {...} } format
        const newScheme = {
          ...response.data.data,
          id: response.data.data.id,
          name: response.data.data.name,
          is_active: response.data.data.is_active,
          leaveTypes: [],
          color: getRandomColor(response.data.data.id)
        };
        
        setSchemes([...schemes, newScheme]);
        setNewSchemeName('');
        setShowNewSchemeForm(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Error creating leave scheme:', error);
        setErrorMessage('Failed to create leave scheme. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setErrorMessage('Please enter a scheme name');
    }
  };
  
  // Handle adding a leave type to a scheme
  const handleAddLeaveType = async (schemeId) => {
    if (!selectedLeaveType) {
      setErrorMessage('Please select a leave type');
      return;
    }
    
    try {
      setSubmitting(true);
      setErrorMessage('');
      
      // Check if it's a standard leave type
      if (selectedLeaveType.startsWith('std_')) {
        const code = selectedLeaveType.substring(4);
        const standardType = STANDARD_LEAVE_TYPES.find(type => type.code === code);
        
        if (standardType) {
          console.log('Selected standard leave type:', standardType);
          
          // First check if this leave type already exists in the system
          const leaveTypesResponse = await axios.get(`${API_URL}/api/leave-management/types`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Leave types response:', leaveTypesResponse);
          
          const existingLeaveTypes = leaveTypesResponse.data.data;
          
          let leaveTypeId;
          
          // Find if this leave type already exists in the system
          const existingType = existingLeaveTypes.find(
            type => type.code === standardType.code || type.name === standardType.name
          );
          
          if (existingType) {
            console.log('Found existing leave type:', existingType);
            leaveTypeId = existingType.id;
          } else {
            console.log('Creating new leave type with data:', {
              name: standardType.name,
              code: standardType.code,
              description: standardType.description || standardType.name,
              is_paid: standardType.isPaid,
              max_days: standardType.defaultDays || 12,
              color: standardType.color || '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
            });
            
            try {
              // Create the leave type if it doesn't exist
              const createResponse = await axios.post(`${API_URL}/api/leave-management/types`, {
                name: standardType.name,
                code: standardType.code,
                description: standardType.description || standardType.name,
                is_paid: Boolean(standardType.isPaid),
                max_days: standardType.defaultDays || 12,
                color: standardType.color || '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              console.log('Leave type created successfully:', createResponse.data);
              leaveTypeId = createResponse.data.data.id;
            } catch (createError) {
              console.error('Error creating leave type:', createError.response?.data || createError.message);
              setErrorMessage(`Failed to create leave type: ${createError.response?.data?.message || createError.message}`);
              setSubmitting(false);
              return;
            }
          }
          
          try {
            // Now add this leave type to the scheme
            console.log('Adding leave type to scheme with data:', {
              leave_type_id: leaveTypeId,
              days_allowed: leaveDays || standardType.defaultDays,
              is_paid: isPaidLeave
            });
            console.log(schemeId,"schemeId")
            await axios.post(`${API_URL}/api/leave-management/schemes/${schemeId}/leave-types`, {
              leave_type_id: leaveTypeId,
              days_allowed: parseInt(leaveDays || standardType.defaultDays, 10),
              is_paid: Boolean(isPaidLeave)
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Leave type added to scheme successfully');
          } catch (addError) {
            console.error('Error adding leave type to scheme:', addError.response?.data || addError.message);
            setErrorMessage(`Failed to add leave type to scheme: ${addError.response?.data?.message || addError.message}`);
            setSubmitting(false);
            return;
          }
        }
      } else {
        // Regular leave type from database
        try {
          console.log('Adding regular leave type to scheme with data:', {
            leave_type_id: selectedLeaveType,
            days_allowed: leaveDays,
            is_paid: isPaidLeave
          });
          
          const result = await axios.post(`${API_URL}/api/leave-management/schemes/${schemeId}/leave-types`, {
            leave_type_id: selectedLeaveType,
            days_allowed: parseInt(leaveDays, 10),
            is_paid: Boolean(isPaidLeave)
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(result,"response");
          console.log('Regular leave type added to scheme successfully');
        } catch (error) {
          console.error('Error adding regular leave type to scheme:', error.response?.data || error.message);
          setErrorMessage(`Failed to add leave type to scheme: ${error.response?.data?.message || error.message}`);
          setSubmitting(false);
          return;
        }
      }
      
      // Refresh leave types for this scheme
      fetchSchemeLeaveTypes(schemeId);
      
      // Reset form
      setSelectedLeaveType('');
      setLeaveDays('');
      setIsPaidLeave(true);
    } catch (error) {
      console.error('Error adding leave type:', error);
      setErrorMessage(`Failed to add leave type. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle removing a leave type from a scheme
  const handleRemoveLeaveType = async (schemeId, leaveTypeId) => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/api/leave-management/schemes/${schemeId}/leave-types/${leaveTypeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the UI
      setSchemes(schemes.map(scheme => {
        if (scheme.id === schemeId) {
          return {
            ...scheme,
            leaveTypes: scheme.leaveTypes.filter(type => type.id !== leaveTypeId)
          };
        }
        return scheme;
      }));
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error removing leave type from scheme:', error);
      setErrorMessage('Failed to remove leave type. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle deleting a scheme
  const handleDeleteScheme = async (schemeId) => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/api/leave-management/schemes/${schemeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSchemes(schemes.filter(scheme => scheme.id !== schemeId));
      if (expandedScheme === schemeId) {
        setExpandedScheme(null);
      }
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting leave scheme:', error);
      
      // Display the specific error message from the backend if available
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to delete leave scheme. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Toggle scheme expansion
  const toggleSchemeExpansion = async (schemeId) => {
    if (expandedScheme === schemeId) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(schemeId);
      // Fetch leave types for this scheme if not already loaded
      if (schemeId && (!schemes.find(s => s.id === schemeId)?.leaveTypes?.length)) {
        await fetchSchemeLeaveTypes(schemeId);
      }
    }
  };
  
  // Fetch data on component mount
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/hr/leave')} 
            className="p-2 text-gray-600 hover:text-[#47BCCB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Leave Configuration</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#47BCCB] mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leave Configuration</h1>
                <p className="text-sm text-gray-500">Configure leave schemes and policies</p>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-[#47BCCB] text-white rounded-md hover:bg-[#3a9ba8] transition-colors"
              onClick={() => navigate('/hr/leave')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Leave Management
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-12">
        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <span className="text-red-700">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Leave Schemes Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex justify-between items-center"
        >
          <h2 className="text-xl font-medium text-gray-900">Leave Schemes</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCustomLeaveTypeForm(true)}
              className="flex items-center px-4 py-2 bg-white border border-[#47BCCB] text-[#47BCCB] rounded-full hover:shadow-lg transition-all duration-300 shadow-sm transform hover:-translate-y-0.5"
            >
              <FileText className="h-5 w-5 mr-1" />
              Create Custom Leave Type
            </button>
            <button
              onClick={() => setShowNewSchemeForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#47BCCB] to-[#3a9ba8] text-white rounded-full hover:shadow-lg transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Scheme
            </button>
          </div>
        </motion.div>
        
        {/* New Scheme Form */}
        <AnimatePresence>
          {showNewSchemeForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-lg mb-6 p-4 border-l-4 border-[#47BCCB] overflow-hidden"
            >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium bg-gradient-to-r from-[#47BCCB] to-[#3a9ba8] bg-clip-text text-transparent">New Leave Scheme</h3>
              <button 
                onClick={() => setShowNewSchemeForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={newSchemeName}
                onChange={(e) => setNewSchemeName(e.target.value)}
                placeholder="Enter scheme name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent shadow-sm"
              />
              <button
                onClick={handleAddScheme}
                className="px-4 py-2 bg-gradient-to-r from-[#47BCCB] to-[#3a9ba8] text-white rounded-r-md hover:shadow-md transition-all duration-300"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Edit Scheme Form */}
        <AnimatePresence>
          {showEditSchemeForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-lg mb-6 p-4 border-l-4 border-blue-500 overflow-hidden"
            >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Edit Leave Scheme</h3>
              <button 
                onClick={() => setShowEditSchemeForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={editSchemeName}
                  onChange={(e) => setEditSchemeName(e.target.value)}
                  placeholder="Enter scheme name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={editSchemeIsActive}
                      onChange={() => setEditSchemeIsActive(!editSchemeIsActive)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <span className="ms-3 text-sm font-medium text-gray-700">{editSchemeIsActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateScheme}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:shadow-md transition-all duration-300"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Scheme'}
                </button>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Schemes List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-[#47BCCB] animate-spin" />
              <span className="ml-3 text-gray-600">Loading leave schemes...</span>
            </div>
          ) : schemes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-md rounded-lg p-8 text-center border border-dashed border-gray-300"
            >
              <p className="text-gray-500 italic">No leave schemes defined yet. Add your first scheme.</p>
            </motion.div>
          ) : (
            schemes.map(scheme => (
              <motion.div 
                key={scheme.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white shadow-md rounded-lg overflow-hidden border-t-4 ${getSchemeColorClass(scheme.color)}`}
              >
                {/* Scheme Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center">
                    <button 
                      onClick={() => toggleSchemeExpansion(scheme.id)}
                      className="mr-3 text-gray-500 hover:text-[#47BCCB] transition-colors"
                    >
                      {expandedScheme === scheme.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    <h3 className="text-lg font-medium text-gray-900">{scheme.name}</h3>
                    <span className={`ml-3 ${getSchemeTagClass(scheme.color)} text-xs font-medium px-2 py-1 rounded-full shadow-sm`}>
                      {scheme.leaveTypes.length} leave types
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditSchemeClick(scheme)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 rounded-full hover:bg-blue-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteScheme(scheme.id)}
                      disabled={scheme.leaveTypes && scheme.leaveTypes.length > 0}
                      title={scheme.leaveTypes && scheme.leaveTypes.length > 0 ? 'Remove all leave types first' : 'Delete scheme'}
                      className={`p-1.5 ${scheme.leaveTypes && scheme.leaveTypes.length > 0 ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'} transition-colors bg-gray-100 rounded-full`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedScheme === scheme.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gray-50 overflow-hidden"
                    >
                    {/* Leave Types List */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2 tracking-wider">LEAVE TYPES</h4>
                      {loadingLeaveTypes ? (
                        <div className="flex items-center py-4">
                          <Loader2 className="h-5 w-5 text-[#47BCCB] animate-spin" />
                          <span className="ml-2 text-sm text-gray-500">Loading leave types...</span>
                        </div>
                      ) : scheme.leaveTypes.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No leave types added yet</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                          
                          {scheme.leaveTypes.map(type => (
                            <motion.div 
                              key={type.id || `temp-${type.name}`} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
                            >
                              <div className="flex items-center">
                                <span className="font-medium">{type.name || 'Unknown'}</span>
                                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{type.days || 0} days</span>
                                <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${type.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {type.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleRemoveLeaveType(scheme.id, type.id)}
                                disabled={submitting}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Add Leave Type Form */}
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500 mb-3 tracking-wider">ADD LEAVE TYPE</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedLeaveType}
                            onChange={(e) => {
                              setSelectedLeaveType(e.target.value);
                              // Auto-set isPaid and days based on selected leave type
                              if (e.target.value) {
                                // Check if it's a standard leave type (format: "std_CODE")
                                if (e.target.value.startsWith('std_')) {
                                  const code = e.target.value.substring(4);
                                  const standardType = STANDARD_LEAVE_TYPES.find(type => type.code === code);
                                  if (standardType) {
                                    setIsPaidLeave(standardType.isPaid);
                                    setLeaveDays(standardType.defaultDays.toString());
                                  }
                                } else {
                                  // Regular leave type from database
                                  const selectedType = availableLeaveTypes.find(type => type.id === e.target.value);
                                  setIsPaidLeave(selectedType?.is_paid ?? true);
                                }
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent text-sm appearance-none bg-white shadow-sm"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                          >
                            <option value="">Select leave type</option>
                            
                            {/* Standard Indian HR Leave Types */}
                            <optgroup label="Standard Indian Leave Types">
                              {STANDARD_LEAVE_TYPES.map(type => (
                                <option 
                                  key={`std_${type.code}`} 
                                  value={`std_${type.code}`}
                                  disabled={scheme.leaveTypes.some(t => t.name === type.name || t.name.includes(type.code))}
                                >
                                  {type.name} {type.isPaid ? '(Paid)' : '(Unpaid)'} - {type.defaultDays} days
                                </option>
                              ))}
                            </optgroup>
                            
                            {/* Custom Leave Types */}
                            <optgroup label="Custom Leave Types">
                              {availableLeaveTypes.map(type => (
                                <option 
                                  key={type.id} 
                                  value={type.id}
                                  disabled={scheme.leaveTypes.some(t => t.id === type.id)}
                                >
                                  {type.name} {type.isPaid ? '(Paid)' : '(Unpaid)'}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <input
                            type="number"
                            value={leaveDays}
                            onChange={(e) => setLeaveDays(e.target.value)}
                            placeholder="Days"
                            min="1"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent text-sm shadow-sm"
                          />
                        </div>
                        
                        {/* Paid/Unpaid Toggle */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <input
                              id={`paid-leave-${scheme.id}`}
                              type="radio"
                              name={`paid-status-${scheme.id}`}
                              checked={isPaidLeave}
                              onChange={() => setIsPaidLeave(true)}
                              className="h-4 w-4 text-[#47BCCB] focus:ring-[#47BCCB] border-gray-300"
                            />
                            <label htmlFor={`paid-leave-${scheme.id}`} className="ml-2 block text-sm text-gray-700">
                              Paid
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`unpaid-leave-${scheme.id}`}
                              type="radio"
                              name={`paid-status-${scheme.id}`}
                              checked={!isPaidLeave}
                              onChange={() => setIsPaidLeave(false)}
                              className="h-4 w-4 text-[#47BCCB] focus:ring-[#47BCCB] border-gray-300"
                            />
                            <label htmlFor={`unpaid-leave-${scheme.id}`} className="ml-2 block text-sm text-gray-700">
                              Unpaid
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleAddLeaveType(scheme.id)}
                            disabled={!selectedLeaveType || !leaveDays || submitting}
                            className="px-4 py-2 bg-gradient-to-r from-[#47BCCB] to-[#3a9ba8] text-white rounded-md hover:shadow-md transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transform hover:scale-105 disabled:transform-none"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : 'Add Leave Type'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Standard leave types are now included in the dropdown above */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
      
      {/* Custom Leave Type Form Modal */}
      <AnimatePresence>
        {showCustomLeaveTypeForm && (
          <CustomLeaveTypeForm 
            isOpen={showCustomLeaveTypeForm}
            onClose={() => setShowCustomLeaveTypeForm(false)}
            onSuccess={handleCustomLeaveTypeCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get color classes based on scheme color
const getSchemeColorClass = (color) => {
  const colorMap = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    cyan: 'border-cyan-500',
    emerald: 'border-emerald-500',
    indigo: 'border-indigo-500'
  };
  return colorMap[color] || 'border-[#47BCCB]';
};

// Helper function to get tag color classes based on scheme color
const getSchemeTagClass = (color) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    rose: 'bg-rose-100 text-rose-800',
    cyan: 'bg-cyan-100 text-cyan-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    indigo: 'bg-indigo-100 text-indigo-800'
  };
  return colorMap[color] || 'bg-gray-100 text-gray-600';
};

// Add custom scrollbar styles to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `;
  document.head.appendChild(style);
}

export default LeaveConfiguration;
