import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnassignedUsers } from '../../redux/slices/usersSlice';

import axios from 'axios';

const AddEmployee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { unassignedUsers, unassignedUsersLoading, unassignedUsersError } = useSelector(state => state.users);
    
    // State for designations and departments
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loadingDesignations, setLoadingDesignations] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [designationError, setDesignationError] = useState(null);
    const [departmentError, setDepartmentError] = useState(null);
    
    const [formData, setFormData] = useState({
        user_id: '',
        full_name: '',
        designation: '',
        department: '',
        salary: '',
        date_of_joining: '',
        emp_code: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Dispatching fetchUnassignedUsers action');
        // Just dispatch the action without trying to unwrap the result
        // The slice will handle errors and always return at least an empty array
        dispatch(fetchUnassignedUsers());
    }, [dispatch]);

    useEffect(() => {
        console.log('Current unassignedUsers state:', unassignedUsers);
    }, [unassignedUsers]);
    
    // Log form data changes
    useEffect(() => {
        console.log('Form data updated:', formData);
    }, [formData]);
    
    // Fetch designations from API
    useEffect(() => {
        const fetchDesignations = async () => {
            setLoadingDesignations(true);
            setDesignationError(null);
            try {
                const token = localStorage.getItem('Admintoken');
                const designationsApiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/api/designations`;
                console.log('Fetching designations from:', designationsApiUrl);
                
                const response = await axios.get(designationsApiUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Designations API response:', response.data);
                
                if (response.data && response.data.data) {
                    console.log('Designations loaded:', response.data.data.length);
                    console.log('First few designations:', response.data.data.slice(0, 3));
                    setDesignations(response.data.data);
                } else {
                    console.log('No designations data found in response');
                    setDesignations([]);
                }
            } catch (error) {
                console.error('Error fetching designations:', error);
                setDesignationError('Failed to fetch designations');
                setDesignations([]);
            } finally {
                setLoadingDesignations(false);
            }
        };
        
        fetchDesignations();
    }, []);
    
    // Fetch departments from API
    useEffect(() => {
        const fetchDepartments = async () => {
            setLoadingDepartments(true);
            setDepartmentError(null);
            try {
                const token = localStorage.getItem('Admintoken');
                const departmentsApiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/api/departments`;
                console.log('Fetching departments from:', departmentsApiUrl);
                
                const response = await axios.get(departmentsApiUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Departments API response:', response.data);
                
                if (response.data && response.data.data) {
                    console.log('Departments loaded:', response.data.data.length);
                    console.log('First few departments:', response.data.data.slice(0, 3));
                    setDepartments(response.data.data);
                } else {
                    console.log('No departments data found in response');
                    setDepartments([]);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartmentError('Failed to fetch departments');
                setDepartments([]);
            } finally {
                setLoadingDepartments(false);
            }
        };
        
        fetchDepartments();
    }, []);

    // Function to fetch designation details and get the department
    const fetchDesignationDetails = (designationId) => {
        if (!designationId) {
            console.log('No designationId provided to fetchDesignationDetails');
            return;
        }
        
        console.log('Fetching designation details for ID:', designationId);
        const token = localStorage.getItem('Admintoken');
        const designationApiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/api/designations/${designationId}`;
        console.log('Designation API URL:', designationApiUrl);
        
        axios.get(designationApiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log('Designation details response:', response.data);
            if (response.data && response.data.data) {
                console.log('Designation data:', response.data.data);
                if (response.data.data.departmentId) {
                    const departmentId = response.data.data.departmentId;
                    console.log('Found departmentId:', departmentId);
                    // If designation has a department, update the form
                    setFormData(prev => {
                        console.log('Updating form with department:', departmentId);
                        return {
                            ...prev,
                            department: departmentId
                        };
                    });
                } else {
                    console.log('No departmentId found for designation');
                }
            } else {
                console.log('Invalid designation response format or no data');
            }
        })
        .catch(error => {
            console.error('Error fetching designation details:', error);
        });
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "user_id") {
            const selectedUser = unassignedUsers.find(
                (user) => user.id.toString() === value
            );
            
            // First update the basic user info
            setFormData((prev) => ({
                ...prev,
                user_id: value,
                full_name: selectedUser ? selectedUser.name : "",
            }));
            
            // If user is selected, check if they have a designation already
            if (selectedUser && selectedUser.id) {
                console.log('Selected user:', selectedUser);
                
                // Check if the selected user already has a designationId
                if (selectedUser.designationId) {
                    console.log('User has designationId:', selectedUser.designationId);
                    
                    // Update the form with the designation
                    setFormData(prev => {
                        console.log('Updating form with designation from user object:', selectedUser.designationId);
                        return {
                            ...prev,
                            designation: selectedUser.designationId
                        };
                    });
                    
                    // Also fetch the department for this designation
                    fetchDesignationDetails(selectedUser.designationId);
                } else {
                    console.log('No designationId in the selected user object, fetching from API');
                    
                    // Fetch user details to get their designation if available
                    const token = localStorage.getItem('Admintoken');
                    const userApiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/api/users/${selectedUser.id}`;
                    console.log('Fetching user details from:', userApiUrl);
                    
                    axios.get(userApiUrl, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then(response => {
                        console.log('User details response:', response.data);
                        if (response.data && response.data.data) {
                            console.log('User data:', response.data.data);
                            if (response.data.data.designationId) {
                                const designationId = response.data.data.designationId;
                                console.log('Found designationId from API:', designationId);
                                // If user has a designation, update the form
                                setFormData(prev => {
                                    console.log('Updating form with designation from API:', designationId);
                                    return {
                                        ...prev,
                                        designation: designationId
                                    };
                                });
                                
                                // Also fetch the department for this designation
                                fetchDesignationDetails(designationId);
                            } else {
                                console.log('No designationId found for user in API response');
                            }
                        } else {
                            console.log('Invalid response format or no data');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                    });
                }
            }
        } else if (name === "designation") {
            // Update the designation in the form data
            setFormData((prev) => ({ ...prev, [name]: value }));
            
            // If a designation is selected, fetch its department
            if (value) {
                fetchDesignationDetails(value);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { user_id, full_name, designation, department, date_of_joining, emp_code, salary } = formData;
        if (!user_id || !full_name || !designation || !department || !date_of_joining) {
            setError('Please fill in all required fields');
            return;
        }
        
        // Generate an employee code if not provided
        if (!emp_code) {
            // Create a code based on department and a random number
            const deptPrefix = department.substring(0, 3).toUpperCase();
            const randomNum = Math.floor(1000 + Math.random() * 9000); 
            formData.emp_code = `${deptPrefix}-${randomNum}`;
        }
        
        // Handle salary validation and date formatting
        const dataToSubmit = {...formData};
        
        // Format date_of_joining as ISO string for backend validation
        if (dataToSubmit.date_of_joining) {
            // Ensure it's a valid date object
            const dateObj = new Date(dataToSubmit.date_of_joining);
            if (!isNaN(dateObj.getTime())) {
                dataToSubmit.date_of_joining = dateObj.toISOString();
            } else {
                setError('Invalid joining date format');
                return;
            }
        }
        
        // Add branch_id from authenticated user or selected user
        const branchId = localStorage.getItem('branchId');
        
        // If we don't have branch_id in localStorage, try to get it from the selected user
        const selectedUser = unassignedUsers?.find(user => user.id === user_id);
        
        if (branchId) {
            dataToSubmit.branch_id = branchId;
        } else if (selectedUser?.branch_id) {
            dataToSubmit.branch_id = selectedUser.branch_id;
        }
        
        // Handle salary validation
        if (salary === '' || salary === null || salary === undefined || salary === '0') {
            // If salary is empty or zero, remove it from the request completely
            delete dataToSubmit.salary;
        } else {
            // Ensure salary is a positive number
            const salaryNum = Number(salary);
            if (isNaN(salaryNum) || salaryNum <= 0) {
                setError('Salary must be a positive number');
                return;
            }
            // Convert to number explicitly
            dataToSubmit.salary = salaryNum;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('Admintoken');
            console.log('Employee creation payload:', dataToSubmit);
            console.log('API URL:', `${import.meta.env.VITE_API_URL}/api/employees`);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/employees`, 
                dataToSubmit,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Employee creation response:', response.data);
            if (response.data.status === "Success") {
                navigate('/hr/employees');
            } else {
                setError(response.data.message || 'Failed to create employee');
            }
        } catch (error) {
            console.error('Employee creation error:', error);
            console.error('Error response data:', error.response?.data);
            setError(error.response?.data?.message || 'An error occurred while creating employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                    Add New Employee
                </h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                {unassignedUsersError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        Failed to load unassigned users: {unassignedUsersError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select User <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                            disabled={unassignedUsersLoading}
                        >
                            <option value="">-- Select a user --</option>
                            {unassignedUsersLoading ? (
                                <option disabled>Loading users...</option>
                            ) : unassignedUsers.length > 0 ? (
                                unassignedUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email}){user.branch_name ? ` - ${user.branch_name}` : ''}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No unassigned users available</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
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
                            disabled={loadingDesignations}
                        >
                            <option value="">-- Select Designation --</option>
                            {loadingDesignations ? (
                                <option disabled>Loading designations...</option>
                            ) : designations.length > 0 ? (
                                (() => {
                                    console.log('Rendering designations dropdown with:', designations);
                                    console.log('Current designation value in form:', formData.designation);
                                    return designations.map(designation => (
                                        <option key={designation.id} value={designation.id}>{designation.name}</option>
                                    ));
                                })()
                            ) : (
                                <option disabled>No designations available</option>
                            )}
                        </select>
                        {designationError && <p className="mt-1 text-sm text-red-600">{designationError}</p>}
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
                            disabled={loadingDepartments}
                        >
                            <option value="">-- Select Department --</option>
                            {loadingDepartments ? (
                                <option disabled>Loading departments...</option>
                            ) : departments.length > 0 ? (
                                departments.map(department => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))
                            ) : (
                                <option disabled>No departments available</option>
                            )}
                        </select>
                        {departmentError && <p className="mt-1 text-sm text-red-600">{departmentError}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Joining Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date_of_joining"
                            value={formData.date_of_joining}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee ID
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="emp_code"
                                value={formData.emp_code}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., HR-1234 (Auto-generated if left empty)"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-gray-500">
                                Optional
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Leave blank for auto-generated ID based on department</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary (Optional)
                        </label>
                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="e.g., 50000"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/hr/employees')}
                            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || unassignedUsersLoading || unassignedUsers.length === 0}
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
                        >
                            {loading ? 'Saving...' : 'Create Employee Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;