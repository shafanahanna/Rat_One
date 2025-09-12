import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CustomLeaveTypeForm = ({ isOpen, onClose, onSuccess }) => {
    const token = useSelector((state) => state.auth.token || localStorage.getItem('Admintoken'));
    const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_paid: true
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Leave type name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Leave type code is required';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only letters, numbers, underscores, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setErrorMessage('');
      
      // Convert code to uppercase
      const submitData = {
        ...formData,
        code: formData.code.toUpperCase()
      };
      
      const response = await axios.post('/api/leave-management/types', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Call the success callback with the newly created leave type
      onSuccess(response.data.data);
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        is_paid: true
      });
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error creating custom leave type:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to create custom leave type. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Create Custom Leave Type</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
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
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Study Leave"
                  className={`w-full px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent shadow-sm`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type Code*
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., STUDY"
                  className={`w-full px-3 py-2 border ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent shadow-sm`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Short code for the leave type (will be converted to uppercase)
                </p>
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the purpose of this leave type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent shadow-sm"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_paid"
                  name="is_paid"
                  checked={formData.is_paid}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#47BCCB] focus:ring-[#47BCCB] border-gray-300 rounded"
                />
                <label htmlFor="is_paid" className="ml-2 block text-sm text-gray-700">
                  Paid Leave
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47BCCB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-gradient-to-r from-[#47BCCB] to-[#3a9ba8] text-white rounded-md hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </div>
                ) : 'Create Leave Type'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomLeaveTypeForm;
