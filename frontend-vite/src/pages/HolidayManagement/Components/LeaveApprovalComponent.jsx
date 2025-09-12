import React, { useState } from 'react';
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import leaveService from '../../../services/leaveService';

const LeaveApprovalComponent = ({ leaveApplication, onApprovalComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  const handleApproval = async (status) => {
    if (status === 'REJECTED' && !comments.trim()) {
      setError('Please provide comments for rejection');
      setShowComments(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const approvalData = {
        leave_application_id: leaveApplication.id,
        status: status,
        comments: comments,
        approved_by: userId
      };

      const response = await leaveService.approveLeaveApplication(approvalData);
      
      setLoading(false);
      if (onApprovalComplete) {
        onApprovalComplete(response.data);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error processing leave approval:', err);
      setError(err.response?.data?.message || 'Failed to process approval. Please try again.');
    }
  };

  // Check if user has permission to approve
  const canApprove = () => {
    // Only HR, Director, or the employee's direct manager can approve
    return ['HR', 'Director', 'DM'].includes(role);
  };

  if (!canApprove()) {
    return null; // Don't render the component if user doesn't have permission
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Leave Approval</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        {(showComments || status === 'REJECTED') && (
          <div className="mb-3">
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
                placeholder="Provide comments (required for rejection)"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showComments ? 'Hide Comments' : 'Add Comments'}
          </button>
          
          <div className="flex-grow"></div>
          
          <button
            type="button"
            disabled={loading}
            onClick={() => handleApproval('APPROVED')}
            className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
          >
            <Check className="h-5 w-5 mr-1" />
            Approve
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={() => handleApproval('REJECTED')}
            className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
          >
            <X className="h-5 w-5 mr-1" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalComponent;
