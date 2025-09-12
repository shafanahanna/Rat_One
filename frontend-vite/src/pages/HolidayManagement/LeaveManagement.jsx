import React from 'react';
import { useSelector } from 'react-redux';
import { 
  CheckCircle,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeaveApprovalDashboard from './Components/LeaveApprovalDashboard';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const userRole = useSelector(state => state.auth?.user?.role);
  // No need for modal state anymore

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/hr/dashboard')} 
            className="p-2 text-gray-600 hover:text-[#47BCCB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Leave Approval</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-[#47BCCB] mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leave Approval Dashboard</h1>
                <p className="text-sm text-gray-500">Review and manage leave requests from employees</p>
              </div>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-[#47BCCB] text-white rounded-md hover:bg-[#3a9ba8] transition-colors"
              onClick={() => navigate('/hr/leave-configuration')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Leave Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-12">
        {/* Leave Approval Dashboard */}
        <LeaveApprovalDashboard />
      </div>

      {/* Modal removed - now using navigation to a separate page */}
    </div>
  );
};

export default LeaveManagement;
