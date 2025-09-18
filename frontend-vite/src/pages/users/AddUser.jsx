import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import roleService from '../../services/roleService';


const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customRoles, setCustomRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    designationId: '',
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Fetch custom roles when component mounts
  useEffect(() => {
    const fetchCustomRoles = async () => {
      setLoadingRoles(true);
      try {
        const roles = await roleService.getAllRoles();
        setCustomRoles(roles);
      } catch (error) {
        console.error('Error fetching custom roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };
    
    fetchCustomRoles();
  }, []);

  const onClose = () => {
    navigate('/users');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for role selection to also set designationId
    if (name === 'role') {
      // Find the selected role in customRoles
      const selectedRole = customRoles.find(role => role.name === value);
      
      setFormData({
        ...formData,
        [name]: value,
        // If a custom role is selected, set its ID as designationId
        designationId: selectedRole ? selectedRole.id : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate role
    if (!formData.role) {
      errors.role = 'Designation is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      
      const newUser = await userService.createUser(userData);
      
      setError(null);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        designationId: '',
      });
      
      // Redirect to users list after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
              placeholder="Full Name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
              placeholder="user@example.com"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
              placeholder="••••••••"
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
              placeholder="••••••••"
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Designation
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                formErrors.role ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
            >
              <option value="">Select a designation</option>
              <optgroup label="System Designations">
                <option value="Director">Admin</option>
                
              </optgroup>
              
              {customRoles.length > 0 && (
                <optgroup label="Custom Designations">
                  {customRoles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {loadingRoles && (
              <p className="text-blue-500 text-xs mt-1">
                Loading custom roles...
              </p>
            )}
            {formErrors.role && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.role}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#47BCCB] hover:bg-[#3da7b4] text-white font-semibold py-2 px-4 rounded-md shadow-sm flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
                    