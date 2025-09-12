import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPayrollById, 
  updatePayrollStatus,
  clearCurrentPayroll
} from '../../redux/slices/payrollSlice';
import { 
  FiSave, 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiUser,
  FiLoader
} from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';

const PayrollForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentPayroll, loading, error } = useSelector(state => state.payroll);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: '',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    unpaidDays: 0,
    netSalary: 0,
    paymentStatus: 'Pending',
    paymentDate: '',
    notes: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Fetch payroll data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchPayrollById(id));
    }
    
    // Cleanup function
    return () => {
      dispatch(clearCurrentPayroll());
    };
  }, [dispatch, id]);
  
  // Update form data when payroll data is loaded
  useEffect(() => {
    if (currentPayroll) {
      setFormData({
        employeeId: currentPayroll.employee_id || '',
        month: currentPayroll.month || '',
        year: currentPayroll.year || '',
        basicSalary: currentPayroll.basic_salary || 0,
        allowances: currentPayroll.allowances || 0,
        deductions: currentPayroll.deductions || 0,
        unpaidDays: currentPayroll.unpaid_days || 0,
        netSalary: currentPayroll.net_salary || 0,
        paymentStatus: currentPayroll.payment_status || 'Pending',
        paymentDate: currentPayroll.payment_date ? new Date(currentPayroll.payment_date).toISOString().split('T')[0] : '',
        notes: currentPayroll.notes || ''
      });
    }
  }, [currentPayroll]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = async (status) => {
    try {
      setSaveLoading(true);
      await dispatch(updatePayrollStatus({ 
        payrollId: id, 
        status 
      })).unwrap();
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        paymentStatus: status,
        paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : prev.paymentDate
      }));
      
      setSaveLoading(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      setSaveLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we only support updating the status and notes
    handleStatusChange(formData.paymentStatus);
  };
  
  const goBack = () => {
    navigate('/hr/payroll');
  };
  
  if (loading && !currentPayroll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={goBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
          Back to Payroll List
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentPayroll ? 'Payroll Details' : 'New Payroll Record'}
          </h1>
          <button
            onClick={goBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
            Back
          </button>
        </div>
        
        {/* Payroll Form */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Employee Info Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiUser className="mr-2" />
                    Employee Information
                  </h2>
                  <div className="mt-1 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                          Employee Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="employeeName"
                            value={currentPayroll?.employee?.full_name || 'N/A'}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                          Employee ID
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="employeeId"
                            value={formData.employeeId}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payroll Period Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiCalendar className="mr-2" />
                    Payroll Period
                  </h2>
                  <div className="mt-1 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                          Month
                        </label>
                        <div className="mt-1">
                          <select
                            id="month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <div className="mt-1">
                          <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Salary Details Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiDollarSign className="mr-2" />
                    Salary Details
                  </h2>
                  <div className="mt-1 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700">
                          Basic Salary
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiRupee className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="basicSalary"
                            name="basicSalary"
                            value={formData.basicSalary}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="allowances" className="block text-sm font-medium text-gray-700">
                          Allowances
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiRupee className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="allowances"
                            name="allowances"
                            value={formData.allowances}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="deductions" className="block text-sm font-medium text-gray-700">
                          Deductions
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiRupee className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="deductions"
                            name="deductions"
                            value={formData.deductions}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="unpaidDays" className="block text-sm font-medium text-gray-700">
                          Unpaid Days
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="unpaidDays"
                            name="unpaidDays"
                            value={formData.unpaidDays}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="netSalary" className="block text-sm font-medium text-gray-700">
                          Net Salary
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiRupee className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="netSalary"
                            name="netSalary"
                            value={formData.netSalary}
                            onChange={handleChange}
                            disabled
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Status Section */}
                <div className="sm:col-span-6">
                  <h2 className="text-lg font-medium text-gray-900">Payment Status</h2>
                  <div className="mt-1 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="mt-1">
                          <select
                            id="paymentStatus"
                            name="paymentStatus"
                            value={formData.paymentStatus}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                          Payment Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            disabled={formData.paymentStatus !== 'Paid'}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes Section */}
                <div className="sm:col-span-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saveLoading ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="-ml-1 mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollForm;
