import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Mail, 
  Briefcase,
  Clock,
  ArrowLeft,
  Award,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployeeProfile } from '../../redux/slices/employeeSlice';
import axios from 'axios';
import EmployeeLeaveDashboard from '../HolidayManagement/Components/EmployeeLeaveDashboard';
import ProfilePictureUploader from '../HolidayManagement/Components/ProfilePictureUploader';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentEmployee, profileLoading } = useSelector((state) => state.employees);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profilePictureError, setProfilePictureError] = useState(false);
  

  // Fix API_URL to correctly use the environment variable
  const API_URL = import.meta.env.VITE_API_URL;
  
  const fetchEmployeeDetails = useCallback(async () => {
    if (!currentEmployee?.id) {
      setError('Employee profile information not available');
      setLoading(false);
      return;
    }

    try {
      // First try the employee profile endpoint
      try {
        // Try to get the employee profile using the user token if available, otherwise fall back to admin token
        const token = localStorage.getItem('user-token') || localStorage.getItem('Admintoken');
        const profileResponse = await axios.get(`${API_URL}/api/employees/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.data && profileResponse.data.data) {
          setEmployeeDetails(profileResponse.data.data);
          setLoading(false);
          return;
        }
      } catch (profileErr) {
        console.warn('Employee profile endpoint failed:', profileErr.message);
        // Continue to fallback approach
      }
      
      // Fallback: Try direct employee lookup with employee ID
      try {
        // Only attempt direct lookup if we have an admin token
        const adminToken = localStorage.getItem('Admintoken');
        if (!adminToken) {
          console.log('Skipping direct employee lookup - no admin token available');
          throw new Error('No admin token available');
        }
        
        // Use employee ID from Redux state
        const employeeId = currentEmployee.id;
        
        const directResponse = await axios.get(`${API_URL}/api/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          // Add timeout to prevent long-hanging requests
          timeout: 5000
        });
        
        if (directResponse.data && directResponse.data.data) {
          setEmployeeDetails(directResponse.data.data);
          setLoading(false);
          return;
        }
      } catch (directErr) {
        // More detailed error logging
        if (directErr.response) {
          // The request was made and the server responded with a status code
          console.warn('Direct employee lookup failed:', directErr.message, 'Status:', directErr.response.status);
        } else if (directErr.request) {
          // The request was made but no response was received
          console.warn('Direct employee lookup failed - no response:', directErr.message);
        } else {
          // Something happened in setting up the request
          console.warn('Direct employee lookup setup error:', directErr.message);
        }
      }
      
      // If we reach here, both approaches failed
      // Create a minimal profile from currentEmployee data
      
      // Generate a human-readable employee code from the UUID
      const employeeId = currentEmployee.id;
      const shortId = employeeId.substring(0, 6).toUpperCase();
      
      setEmployeeDetails({
        id: employeeId,
        name: currentEmployee.name || 'User',
        email: currentEmployee.email,
        role: currentEmployee.role,
        department: 'Not available',
        designation: 'Not available',
        emp_code: `EMP-${shortId}` // Add a human-readable employee code
      });
      
    } catch (err) {
      console.error('All employee detail fetch attempts failed:', err);
      setError('Failed to load employee information. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentEmployee, API_URL]);
  
  useEffect(() => {
    // Fetch employee profile from Redux only once when component mounts
    dispatch(fetchEmployeeProfile());
  }, [dispatch]);
  
  // Separate effect for fetching employee details when currentEmployee changes
  useEffect(() => {
    if (currentEmployee?.id) {
      fetchEmployeeDetails();
    }
  }, [currentEmployee,dispatch, fetchEmployeeDetails]);

  const handleApplySuccess = () => {
    // Refresh employee details to update any leave-related information
    fetchEmployeeDetails();
    // Switch to leave dashboard tab to show updated data
    setActiveTab('leave-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-gray-600 hover:text-[#47BCCB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">My Profile</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-[#47BCCB] mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">View and manage your profile, leaves, and personal information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-12">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'profile'
                  ? 'border-[#47BCCB] text-[#47BCCB]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('leave-dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'leave-dashboard'
                  ? 'border-[#47BCCB] text-[#47BCCB]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              My Leave Dashboard
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47BCCB] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading profile information...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-[#47BCCB] to-[#4A90E2] p-6 text-white">
                    <div className="flex items-center">
                      <div className="flex justify-center mb-4">
                        <ProfilePictureUploader 
                          employeeId={employeeDetails?.id} 
                          currentPicture={employeeDetails?.profile_picture}
                          onSuccess={(newPictureUrl) => {
                            // Reset error state when new picture is uploaded
                            setProfilePictureError(false);
                            
                            setEmployeeDetails(prev => ({
                              ...prev,
                              profile_picture: newPictureUrl
                            }));
                            

                            
                            alert('Profile picture updated successfully');
                          }}
                        />
                      </div>
                      <div className="ml-6">
                        <h2 className="text-2xl font-bold">
                          {employeeDetails?.full_name || employeeDetails?.name || currentEmployee?.name || 'User'}
                        </h2>
                        <p className="text-white/80">{employeeDetails?.designation}</p>
                        <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                          Employee ID: {employeeDetails?.emp_code || employeeDetails?.employee_code || 'EMP-' + (employeeDetails?.id || currentEmployee?.id).substring(0, 6).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                        
                        <div className="flex items-start">
                          <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{employeeDetails?.email || currentEmployee?.email || 'Not available'}</p>
                          </div>
                        </div>
                        

                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Employment Details</h3>
                        
                        <div className="flex items-start">
                          <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="text-gray-900">{employeeDetails?.department || 'Not available'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Award className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Designation</p>
                            <p className="text-gray-900">{employeeDetails?.designation || 'Not available'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Joined Date</p>
                            <p className="text-gray-900">
                              {employeeDetails?.date_of_joining 
                                ? new Date(employeeDetails.date_of_joining).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'leave-dashboard' && <EmployeeLeaveDashboard onApplySuccess={handleApplySuccess} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
