import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import { fetchEmployees as fetchEmployeesThunk, deleteEmployee as deleteEmployeeThunk, updateSalaryStatus as updateSalaryStatusThunk } from '../../redux/slices/employeeSlice';

import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  UserPlus,
  Eye,
  Users,
  Filter,
  Search,
  RefreshCw,
  Briefcase,
} from "lucide-react";

import { useIsMobile } from "../../hooks/useIsMobile";

const EmployeeList = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  
  // Redux hooks
  const dispatch = useDispatch();
  const { employees, loading, departments, presentToday } = useSelector(state => state.employees);
  
  const isMobile = useIsMobile();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Use Redux thunk to fetch employees
  const fetchEmployees = () => {
    dispatch(fetchEmployeesThunk());
  };

  useEffect(() => {
    console.log('EmployeeList component - Dispatching fetchEmployeesThunk');
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);
  
  // Log when employees data changes
  useEffect(() => {
    console.log('EmployeeList component - Employees data updated:', employees);
  }, [employees]);
  
  // Filter employees based on department and search term
  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = selectedDepartment ? employee.department === selectedDepartment : true;
    const matchesSearch = searchTerm
      ? employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.emp_code?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDepartment && matchesSearch;
  });

  const handleAddEmployee = () => {
    navigate("/hr/add-employee");
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/hr/edit-employee/${employeeId}`);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/hr/employee/${employeeId}`);
  };

  const handleUpdateSalaryStatus = (employeeId, status) => {
    dispatch(updateSalaryStatusThunk({ id: employeeId, status }));
  };

  const deleteEmployee = (employeeId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this employee?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            dispatch(deleteEmployeeThunk(employeeId));
          },
        },
        { label: "No" },
      ],
    });
  };

  const SalaryStatus = ({ employee }) => {
    const isMobile = useIsMobile();
    const statusMap = {
      Pending: { 
        icon: Clock, 
        bgColor: "bg-yellow-100", 
        textColor: "text-yellow-800", 
        label: "Pending" 
      },
      Approved: {
        icon: CheckCircle,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "Approved",
      },
      Rejected: { 
        icon: XCircle, 
        bgColor: "bg-red-100", 
        textColor: "text-red-800", 
        label: "Rejected" 
      },
    };

    const currentStatus = statusMap[employee.salary_status] || {
      icon: null,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      label: "Approved"
    };
    
    const Icon = currentStatus.icon;

    return (
      <div className="flex flex-col space-y-1">
        <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
          {Icon && <Icon size={14} className="mr-1" />}
          {currentStatus.label}
        </span>
        
        {!isMobile && employee.salary_status === "Pending" && (
          <div className="text-xs text-gray-500 mt-1">
            Proposed: ₹{employee.proposed_salary}
          </div>
        )}
        
        {userRole === "Director" && employee.salary_status === "Pending" && (
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => handleUpdateSalaryStatus(employee.id, "Approved")}
              className="p-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
              title="Approved"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => handleUpdateSalaryStatus(employee.id, "Rejected")}
              className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
              title="Rejected"
            >
              <XCircle size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const EmployeeRow = ({ employee }) => {
    return (
      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {employee.empCode
            }
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#47BCCB]/20 flex items-center justify-center text-[#47BCCB] font-medium">
              {employee.fullName ? employee.fullName.substring(0, 1).toUpperCase():""}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{employee.user.email}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {employee.designation}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{employee.department}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <SalaryStatus employee={employee} />
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-1">
            <button
              onClick={() => handleViewEmployee(employee.id)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEditEmployee(employee.id)}
              className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => deleteEmployee(employee.id)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  };
  
  const MobileEmployeeCard = ({ employee }) => {
    // Format employee code or use a fallback
    const employeeCode = employee.empCode
    || `EMP-${employee.id.substring(0, 6)}`;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="mr-3">
              <div className="h-12 w-12 rounded-full bg-[#47BCCB]/20 flex items-center justify-center text-[#47BCCB] font-medium">
                {employee.fullName ? employee.fullName.substring(0, 2).toUpperCase() : "NA"}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {employee.fullName}
              </h3>
              <p className="text-sm text-gray-500">{employee.user}</p>
              <div className="mt-2 flex items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {employee.designation}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleViewEmployee(employee.id)}
              className="p-2 bg-[#e6f7f9] text-[#47BCCB] rounded-full"
              title="View Employee"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEditEmployee(employee.id)}
              className="p-2 bg-[#e6f7f9] text-[#47BCCB] rounded-full"
              title="Edit Employee"
            >
              <Edit size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Department
            </p>
            <p className="font-medium text-gray-700 mt-1">
              {employee.department}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              ID
            </p>
            <p className="font-medium text-gray-700 mt-1">
              {employeeCode}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Salary Status
            </p>
            <div className="mt-1">
              <SalaryStatus employee={employee} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e6f7f9] mr-4">
              <Users className="h-6 w-6 text-[#47BCCB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e6f7f9] mr-4">
              <CheckCircle className="h-6 w-6 text-[#47BCCB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Present Today</p>
              <p className="text-2xl font-bold text-gray-800">{presentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e6f7f9] mr-4">
              <Briefcase className="h-6 w-6 text-[#47BCCB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e6f7f9] mr-4">
              <Filter className="h-6 w-6 text-[#47BCCB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-800">{filteredEmployees.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#47BCCB] focus:border-transparent"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => fetchEmployees()}
            className="flex items-center justify-center gap-2 bg-[#e6f7f9] text-[#47BCCB] px-4 py-2 rounded-lg hover:bg-[#d0f0f5] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={handleAddEmployee}
            className="flex items-center justify-center gap-2 bg-[#47BCCB] text-white px-4 py-2 rounded-lg hover:bg-[#3a9aa8] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
      
      {/* Employee List Content */}
      <div className="bg-gray-50 rounded-lg">
        {isMobile ? (
          // Mobile View
          <div className="pt-5 pb-20"> {/* Added bottom padding for floating button */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47BCCB]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <MobileEmployeeCard
                      key={employee.id}
                      employee={employee}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm mt-1">
                      {searchTerm || selectedDepartment ? "Try adjusting your filters" : "Add your first employee to get started"}
                    </p>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={handleAddEmployee}
              className="fixed bottom-20 lg:bottom-10 right-6 z-50 bg-[#47BCCB] hover:bg-[#3a9aa8] text-white p-4 rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Add Employee"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // Desktop View
          <div className="py-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#47BCCB]"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Designation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <EmployeeRow
                            key={employee.id}
                            employee={employee}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            <div className="flex flex-col items-center">
                              <p className="text-lg font-medium">
                                No employees found
                              </p>
                              <p className="text-sm mt-1">
                                {searchTerm || selectedDepartment ? "Try adjusting your filters" : "Add your first employee to get started"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
