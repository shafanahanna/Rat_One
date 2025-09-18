import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  Edit,
  ArrowLeft,
  Download,
  Printer,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { updateSalaryStatus } from '../../redux/slices/employeeSlice';
import '../HolidayManagement/Components/GoogleWorkspaceStyles.css';

const SalaryManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, loading, error } = useSelector((state) => state.employees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [departments, setDepartments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const userRole = useSelector(state => state.auth?.user?.role);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (employees && employees.length > 0) {
      // Extract unique departments
      const uniqueDepartments = [...new Set(employees.map(emp => emp.department))].filter(Boolean);
      setDepartments(uniqueDepartments);
    }
  }, [employees]);

  const handleUpdateSalaryStatus = (employeeId, status) => {
    console.log(`Updating salary status for employee ${employeeId} to ${status}`);
    console.log(`Current user role: ${userRole}`);
    dispatch(updateSalaryStatus({ id: employeeId, status }));
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/hr/edit-employee/${employeeId}`);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSalaryStatus = (employee) => {
    // Check for both property naming conventions
    if (employee.salary_status) {
      return employee.salary_status;
    } else if (employee.salaryStatus) {
      return employee.salaryStatus;
    }
    // Default to 'Approved' if not found
    return 'Approved';
  };

  const getProposedSalary = (employee) => {
    if (employee.proposed_salary) {
      return employee.proposed_salary;
    } else if (employee.proposedSalary) {
      return employee.proposedSalary;
    }
    return 0;
  };

  const getSalary = (employee) => {
    return employee.salary || 0;
  };

  // Filter and sort employees
  const filteredEmployees = employees
    ? employees
        .filter((employee) => {
          const matchesSearch = 
            employee.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.department?.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesDepartment = filterDepartment 
            ? employee.department === filterDepartment 
            : true;
          
          return matchesSearch && matchesDepartment;
        })
        .sort((a, b) => {
          let valueA, valueB;
          
          switch (sortBy) {
            case 'name':
              valueA = a.fullName || '';
              valueB = b.fullName || '';
              break;
            case 'department':
              valueA = a.department || '';
              valueB = b.department || '';
              break;
            case 'designation':
              valueA = a.designation || '';
              valueB = b.designation || '';
              break;
            case 'salary':
              valueA = getSalary(a) || 0;
              valueB = getSalary(b) || 0;
              break;
            default:
              valueA = a.fullName || '';
              valueB = b.fullName || '';
          }
          
          if (sortOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        })
    : [];

  // Status badge component
  const StatusBadge = ({ status }) => {
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    } else if (status === 'Approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full max-w-full">
      {/* Google-style header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 full-width-container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-xl font-normal text-gray-800">Salary Management</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors focus-ring focus:outline-none google-tooltip ${showFilters ? 'bg-gray-100 text-blue-500' : 'text-gray-600'}`}
                data-tooltip="Filters"
              >
                <Filter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/hr/add-employee')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center focus-ring focus:outline-none"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 full-width-container">
        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees by name, department, or designation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200 google-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 google-dropdown"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 google-dropdown"
                >
                  <option value="name">Name</option>
                  <option value="department">Department</option>
                  <option value="designation">Designation</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 google-dropdown"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Employee
                        {sortBy === 'name' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center">
                        Department
                        {sortBy === 'department' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('designation')}
                    >
                      <div className="flex items-center">
                        Designation
                        {sortBy === 'designation' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('salary')}
                    >
                      <div className="flex items-center">
                        Current Salary
                        {sortBy === 'salary' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposed Salary
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => {
                    const status = getSalaryStatus(employee);
                    const proposedSalary = getProposedSalary(employee);
                    
                    return (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{employee.fullName?.charAt(0) || '?'}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                              <div className="text-sm text-gray-500">{employee.empCode || 'No ID'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.designation || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{getSalary(employee).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {proposedSalary ? (
                            <div className="text-sm font-medium text-blue-600">₹{proposedSalary.toLocaleString()}</div>
                          ) : (
                            <div className="text-sm text-gray-500">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {userRole === 'Admin' && status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateSalaryStatus(employee.id, 'Approved')}
                                  className="p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateSalaryStatus(employee.id, 'Rejected')}
                                  className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryManagement;
