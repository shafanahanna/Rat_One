import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, Edit, Filter, Search, ArrowLeft, Wallet, CheckCircle } from 'lucide-react';
import leaveService from '../../../services/leaveService';

const LeaveBalanceList = ({ employeeId = null }) => {
  const navigate = useNavigate();
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [formData, setFormData] = useState({
    allocated_days: 0,
  });
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    employee_id: employeeId || '',
    search: '',
  });

  // Fetch leave balances
  useEffect(() => {
    const fetchLeaveBalances = async () => {
      setLoading(true);
      setError('');
      
      try {
        let params = { year: filters.year };
        
        if (filters.employee_id) {
          params.employee_id = filters.employee_id;
        }
        
        if (filters.search) {
          params.search = filters.search;
        }
        
        const response = await leaveService.getLeaveBalances(params);
        if (response && response.data) {
          setLeaveBalances(response.data);
        } else {
          setLeaveBalances([]);
        }
      } catch (err) {
        console.error('Error fetching leave balances:', err);
        setError('Failed to load leave balances. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaveBalances();
  }, [filters, employeeId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filter change will trigger the useEffect to reload data
  };

  const handleOpenModal = (balance = null) => {
    if (balance) {
      setCurrentBalance(balance);
      setFormData({
        allocated_days: balance.allocated_days,
      });
    } else {
      setCurrentBalance(null);
      setFormData({
        allocated_days: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBalance(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentBalance) {
        // Update existing leave balance
        await leaveService.updateLeaveBalance(currentBalance.id, formData);
        
        // Update the leave balances list
        setLeaveBalances(prev => 
          prev.map(lb => lb.id === currentBalance.id ? { ...lb, ...formData } : lb)
        );
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error updating leave balance:', err);
      setError('Failed to update leave balance. Please try again.');
    }
  };

  const calculateRemainingDays = (balance) => {
    const total = parseFloat(balance.allocated_days) || 0;
    const used = parseFloat(balance.used_days) || 0;
    const pending = parseFloat(balance.pending_days) || 0;
    return (total - used - pending).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate('/hr')} 
            className="p-2 text-gray-600 hover:text-[#47BCCB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Leave Balance Management</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-[#47BCCB] mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leave Balance Management</h1>
                <p className="text-sm text-gray-500">Configure leave balances for employees</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate('/hr/leave')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#47BCCB] hover:bg-[#3da7b4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47BCCB]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Leave Approval Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave Balances</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
      
      {/* Filters */}
      {!employeeId && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50"
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <form onSubmit={handleSearch} className="w-full md:w-3/4 flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by employee name or leave type"
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50 pl-10 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#47BCCB] text-white px-4 py-2 rounded-r-md hover:bg-[#3a9ca9] transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Leave Balances List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#47BCCB]"></div>
          <p className="mt-2 text-gray-500">Loading leave balances...</p>
        </div>
      ) : leaveBalances.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No leave balances found for the selected criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {!employeeId && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used Days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Days
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveBalances.map((balance) => (
                <tr key={balance.id} className="hover:bg-gray-50">
                  {!employeeId && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {balance.employee?.full_name || 'Unknown'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: balance.leave_type?.color || '#47BCCB' }}
                      ></div>
                      <span className="text-sm text-gray-900">{balance.leave_type?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{balance.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(balance.allocated_days).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(balance.used_days).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(balance.pending_days).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      calculateRemainingDays(balance) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {calculateRemainingDays(balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(balance)}
                        className="text-[#47BCCB] hover:text-[#3a9ca9] p-1 rounded-full hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal for Edit Leave Balance */}
      {isModalOpen && currentBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit Leave Balance
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Employee:</span> {currentBalance.employee?.full_name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Leave Type:</span> {currentBalance.leave_type?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Year:</span> {currentBalance.year}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Days
                </label>
                <input
                  type="number"
                  name="allocated_days"
                  value={formData.allocated_days}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#47BCCB] focus:ring focus:ring-[#47BCCB] focus:ring-opacity-50"
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Used Days:</span> {parseFloat(currentBalance.used_days).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Pending Days:</span> {parseFloat(currentBalance.pending_days).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Remaining Days:</span> {calculateRemainingDays(currentBalance)}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#47BCCB] text-white rounded-md hover:bg-[#3a9ca9]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceList;
