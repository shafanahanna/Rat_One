import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const designationOptions = [
  "Digital Marketing Executive",
  "Travel Consultant",
  "HR Manager",
  "Accountant",
  "Branch Assistant",
  "Branch Associate",
  "Ticketing & Reservation",
];

const departmentOptions = [
  "Holidays",
  "Reservation",
  "Finance",
  "Marketing",
  "Human Resources",
  "Administration",
];

const EditEmployee = () => {
  const { id } = useParams(); // Using id to match the route parameter in App.jsx
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    designation: "",
    department: "",
    salary: "",
    emp_code: "",
  });
  const [originalSalary, setOriginalSalary] = useState("");
  const [salaryStatus, setSalaryStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      // Check if id is valid before making the API call
      if (!id || id === 'undefined' || id === 'null') {
        setLoading(false);
        // Redirect to employees list after a short delay
        setTimeout(() => navigate('/hr/employees'), 2000);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:4000/api/employees/${id}`);
        console.log("API Response:", response.data.data);

        if (response.data.status === "Success") {
          const employeeData = response.data.data;
          const userData = employeeData.user || {};
          
          // Extract data from the nested structure
          setFormData({ 
            name: employeeData.fullName || "", 
            email: userData.email || "", 
            role: userData.role || "", 
            designation: employeeData.designation || "", 
            department: employeeData.department || "", 
            salary: (employeeData.proposedSalary || employeeData.salary || "").toString(), 
            emp_code: employeeData.empCode || "" 
          });
          
          console.log("Form data set:", {
            name: employeeData.fullName,
            email: userData.email,
            role: userData.role,
            designation: employeeData.designation,
            department: employeeData.department,
            salary: employeeData.proposedSalary || employeeData.salary,
            emp_code: employeeData.empCode
          });
          
          setOriginalSalary(employeeData.salary || "");
          setSalaryStatus(employeeData.salaryStatus || "Approved");
        } else {
        }
      } catch (error) {
        if (error.response?.status === 400) {
          // Redirect to employees list after a short delay
          setTimeout(() => navigate('/hr/employees'), 2000);
        } else {
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if id is valid before making the API call
    if (!id || id === 'undefined' || id === 'null') {
      navigate("/hr/employees");
      return;
    }
    
    setLoading(true);
    try {
      // Map form data to match backend entity structure
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        designation: formData.designation,
        department: formData.department,
        emp_code: formData.emp_code
      };
      
      // Only include salary if it has changed from the original value
      if (formData.salary !== originalSalary) {
        payload.salary = Number(formData.salary); // Convert string to number
      }
      
      console.log('Sending update payload:', payload);
      const response = await axios.patch(
        `http://localhost:4000/api/employees/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('Admintoken')}`
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      if (response.data.status === "Success") {
        console.log('Employee updated successfully');
        alert('Employee updated successfully!');
        navigate("/hr/employees");
      } else {
        console.error('API returned unsuccessful status');
        alert('Update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || 'Unknown error';
        
        console.error(`API Error (${status}):`, errorMessage);
        
        if (status === 400) {
          if (errorMessage.includes("Invalid employee ID")) {
            alert("Invalid employee ID. Redirecting to employee list.");
            navigate("/hr/employees");
          } else {
            alert(`Validation error: ${errorMessage}`);
          }
        } else if (status === 404) {
          alert("Employee not found. Redirecting to employee list.");
          navigate("/hr/employees");
        } else if (status === 409) {
          alert(`Conflict error: ${errorMessage}. Please check employee code or email.`);
        } else {
          alert(`Error updating employee: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        console.error('Network error - no response received:', error.request);
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something else caused the error
        console.error('Error details:', error.message);
        alert(`Error updating employee: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Edit Employee
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="TC">Travel Consultant</option>
              <option value="DM">Digital Marketer</option>
              <option value="HR">HR</option>
              <option value="Director">Director</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">-- Select Designation --</option>
              {designationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">-- Select Department --</option>
              {departmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="emp_code"
              value={formData.emp_code}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., EMP001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <div className="space-y-2">
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${salaryStatus === "Pending" ? "border-yellow-400 bg-yellow-50" : "border-gray-300"}`}
                placeholder="e.g., 50000"
              />
              {originalSalary && formData.salary !== originalSalary && (
                <div className="text-xs text-blue-600">
                  Original salary: {originalSalary}
                </div>
              )}
              {salaryStatus === "Pending" && (
                <div className="text-xs text-yellow-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Salary change pending approval
                </div>
              )}
              <div className="text-xs text-gray-500">
                Note: Salary changes require approval from management
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/hr/employees")}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
