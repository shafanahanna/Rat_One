import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  UserPlus,
  Clock,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const HRDashboard = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth  ();

  // HR Dashboard options
  const hrOptions = [
    {
      to: "/hr/employees",
      icon: Users,
      label: "Employee Management",
      description: "View and manage employees",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      to: "/hr/attendance",
      icon: Calendar,
      label: "Attendance", 
      description: "Track employee attendance",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      to: "/hr/leave",
      icon: CalendarCheck,
      label: "Leave Management",
      description: "Apply and approve leave requests",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      highlight: true,
    },
    {
      to: "/hr/leave-balance",
      icon: Wallet,
      label: "Leave Balance Management",
      description: "Configure employee leave balances",
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      highlight: true,
    },
    {
      to: "/hr/payroll",
      icon: DollarSign,
      label: "Payroll",
      description: "Manage employee payroll",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
   
    {
      to: "/hr/add-employee",
      icon: UserPlus,
      label: "Add Employee",
      description: "Add new employee",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

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
          <h1 className="text-lg font-semibold text-gray-900">HR Dashboard</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#47BCCB] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-gray-600">Human Resources Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1  ">
        <div className="p-4 lg:p-6 pt-8 lg:pt-6 pb-8 lg:pb-6">
          {/* Quick Stats Section */}
          <div className="  mb-[20px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Overview
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                    <p className="text-sm text-gray-600">Total Employees</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                    <p className="text-sm text-gray-600">Present Today</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                    <p className="text-sm text-gray-600">Open Positions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">--</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* HR Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-[20px]">
            {hrOptions.map((option, index) => {
              const IconComponent = option.icon;

              return (
                <Link
                  key={index}
                  to={option.to}
                  className={`bg-white rounded-lg shadow-sm border ${option.highlight ? 'border-[#47BCCB]/30' : 'border-gray-200'} p-6 hover:shadow-md transition-all duration-200 hover:border-[#47BCCB]/20 group ${option.highlight ? 'ring-2 ring-[#47BCCB]/10' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${option.textColor}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#47BCCB] transition-colors">
                        {option.label}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
