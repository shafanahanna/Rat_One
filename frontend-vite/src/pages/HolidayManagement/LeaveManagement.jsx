import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  CheckCircle,
  ArrowLeft,
  Settings,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeaveApprovalDashboardNew from './Components/LeaveApprovalDashboardNew';
import './Components/GoogleWorkspaceStyles.css';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const userRole = useSelector(state => state.auth?.user?.role);
  // No need for modal state anymore

  
  return (
    <div className="min-h-screen bg-gray-50 google-scrollbar full-width-container">
      {/* Mobile Header - Google Workspace Style */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/hr/dashboard')} 
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors focus-ring focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
            <h1 className="text-lg font-normal text-gray-800">Leave Approval</h1>
          </div>
          <button 
            onClick={() => navigate('/hr/leave-configuration')} 
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors focus-ring focus:outline-none"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Header - Hidden since the dashboard has its own header */}
      <div className="hidden">  
        {/* We're hiding the original desktop header since our Google Workspace-inspired dashboard 
        already includes a header with all necessary controls */}
      </div>

      {/* Main Content */}
      <div className="w-full pt-16 lg:pt-0 max-w-full full-width-container">
        {/* Leave Approval Dashboard - Google Workspace Style */}
        <LeaveApprovalDashboardNew />
      </div>

      {/* Modal removed - now using navigation to a separate page */}
    </div>
  );
};

export default LeaveManagement;
