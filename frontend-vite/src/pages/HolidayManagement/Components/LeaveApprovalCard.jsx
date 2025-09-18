import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock,
  User,
  Calendar,
  Tag,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LeaveApprovalCard = ({ leave, onApprove, onReject, formatDate, showActions }) => {
  const [expanded, setExpanded] = useState(false);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          icon: Clock,
          iconColor: 'text-amber-500'
        };
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: XCircle,
          iconColor: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: Clock,
          iconColor: 'text-gray-500'
        };
    }
  };

  const statusStyle = getStatusColor(leave.status);
  const StatusIcon = statusStyle.icon;

  const handleApprove = () => {
    setShowConfirmApprove(false);
    onApprove();
  };

  const handleReject = () => {
    setShowConfirmReject(false);
    onReject();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden google-card">
      {/* Card Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{leave.employee_name}</h3>
              <p className="text-sm text-gray-500">{leave.department || 'No Department'}</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} flex items-center google-chip`}>
            <StatusIcon className={`h-3.5 w-3.5 mr-1 ${statusStyle.iconColor}`} />
            {leave.status}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        <div className="space-y-3">
          <div className="flex items-start">
            <Tag className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Leave Type</p>
              <p className="text-sm text-gray-800">{leave.leave_type}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm text-gray-800">
                {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {leave.days || leave.duration || 1} {(leave.days || leave.duration || 1) === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>

          {expanded && (
            <>
              {leave.reason && (
                <div className="flex items-start">
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="text-sm text-gray-800">{leave.reason}</p>
                  </div>
                </div>
              )}
              
              {leave.applied_date && (
                <div className="flex items-start">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Applied On</p>
                    <p className="text-sm text-gray-800">{formatDate(leave.applied_date)}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors focus-ring"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show more
            </>
          )}
        </button>
      </div>

      {/* Card Actions */}
      {showActions && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
          {showConfirmReject ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confirm reject?</span>
              <button 
                onClick={() => setShowConfirmReject(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus-ring"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus-ring"
              >
                Reject
              </button>
            </div>
          ) : showConfirmApprove ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confirm approve?</span>
              <button 
                onClick={() => setShowConfirmApprove(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus-ring"
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus-ring"
              >
                Approve
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setShowConfirmReject(true)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center focus-ring google-btn-hover"
              >
                <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
                Reject
              </button>
              <button 
                onClick={() => setShowConfirmApprove(true)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center focus-ring"
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1 text-white" />
                Approve
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalCard;
