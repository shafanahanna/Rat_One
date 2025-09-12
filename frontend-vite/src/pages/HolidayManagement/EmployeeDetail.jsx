import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/employees/${employeeId}`);
        if (response.data.status === "Success") {
          setEmployee(response.data.data);
        } else {
          navigate("/hr/employees");
        }
      } catch (error) {
        navigate("/hr/employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [employeeId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Employee not found</h2>
          <button
            onClick={() => navigate("/hr/employees")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={() => navigate("/hr/employees")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/hr/edit-employee/${employeeId}`)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Edit Employee
            </button>
          </div>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{employee.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">{employee.designation || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{employee.department || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{employee.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("salary")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "salary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Salary
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <p className="text-gray-900">{employee.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                <p className="text-gray-900">{employee.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Designation</h4>
                <p className="text-gray-900">{employee.designation || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Department</h4>
                <p className="text-gray-900">{employee.department || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
                <p className="text-gray-900">{employee.role}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Employee ID</h4>
                <p className="text-gray-900">{employee.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Joined Date</h4>
                <p className="text-gray-900">
                  {employee.created_at 
                    ? new Date(employee.created_at).toLocaleDateString() 
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default EmployeeDetails;
