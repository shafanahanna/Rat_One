import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiPlay, FiLoader, FiCheckCircle, FiUsers, FiTrendingUp, FiTrendingDown, FiChevronRight, FiAlertTriangle, FiEye } from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';
import axios from 'axios';

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const Payroll = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payrollData, setPayrollData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runningPayroll, setRunningPayroll] = useState(false);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  
  const isMobile = useIsMobile();

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const [payrollRes, summaryRes] = await Promise.all([
        axios.get(`http://localhost:4000/api/hr/payroll?month=${month}&year=${year}`),
        axios.get(`http://localhost:4000/api/hr/payroll/summary?month=${month}&year=${year}`)
      ]);
      setPayrollData(payrollRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [month, year]);

  const handleRunPayroll = async () => {
    setRunningPayroll(true);
    try {
      // First check if records exist using the recalculate endpoint with forceRecalculate=false
      const response = await axios.post('http://localhost:4000/api/hr/payroll/recalculate', { 
        month, 
        year,
        forceRecalculate: false
      });
      
      // If records exist, show confirmation dialog
      if (response.data.recordsExist) {
        setRecordCount(response.data.recordCount);
        setShowConfirmDialog(true);
        setRunningPayroll(false);
        return;
      }
      
      // If no records exist, process completed successfully
      fetchPayrollData();
    } catch (error) {
    } finally {
      setRunningPayroll(false);
    }
  };
  
  const handleConfirmRecalculate = async () => {
    try {
      setRunningPayroll(true);
      setShowConfirmDialog(false);
      
      // Force recalculation with deletion of existing records
      const response = await axios.post('http://localhost:4000/api/hr/payroll/recalculate', { 
        month, 
        year,
        forceRecalculate: true
      });
      
      fetchPayrollData();
    } catch (error) {
    } finally {
      setRunningPayroll(false);
    }
  };

  const handleMarkAsPaid = async (payrollId) => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/hr/payroll/${payrollId}/status`, { payment_status: 'Paid' });
      setPayrollData(prevData =>
        prevData.map(record =>
          record.id === payrollId ? { ...record, status: 'Paid' } : record
        )
      );
    } catch (error) {
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' },
  ];

  const SummaryCard = ({ icon, title, value, color = 'indigo' }) => (
    <div className={`bg-white shadow-lg rounded-xl ${isMobile ? 'p-3' : 'p-6'} flex items-center space-x-4`}>
      <div className={`bg-${color}-100 rounded-full p-3 text-${color}-600`}>
        {React.cloneElement(icon, { className: isMobile ? 'h-4 w-4' : 'h-6 w-6' })}
      </div>
      <div>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 truncate`}>{title}</p>
        <p className={`mt-1 ${isMobile ? 'text-lg' : 'text-2xl'} font-semibold text-gray-900`}>{value}</p>
      </div>
    </div>
  );

  const toggleEmployeeExpand = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  // Mobile card for each employee's payroll
  const MobilePayrollCard = ({ record }) => (
    <div className="bg-white rounded-lg shadow mb-3 overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => toggleEmployeeExpand(record.id)}
      >
        <div className="flex flex-col w-3/4">
          <div className="font-medium text-gray-800 mb-1 truncate">{record.full_name}</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
            <div className="flex items-center">
              <BiRupee className="text-gray-500 h-3 w-3 mr-1" />
              <span className="text-gray-700">{parseFloat(record.gross_salary).toFixed(0)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 font-medium flex items-center">
                <BiRupee className="h-3 w-3 mr-1" />
                {parseFloat(record.net_salary).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs rounded-full mr-2 ${record.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {record.status}
          </span>
          <FiChevronRight className={`text-gray-400 transition-transform ${expandedEmployee === record.id ? 'transform rotate-90' : ''}`} />
        </div>
      </div>
      
      {expandedEmployee === record.id && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex justify-between mb-3">
            <div className="w-1/2">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Salary Details</div>
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-gray-800 flex items-center">
                  <BiRupee className="h-4 w-4" />
                  {parseFloat(record.gross_salary).toFixed(0)}
                </span>
                <span className="text-xs text-gray-500 ml-1">gross</span>
              </div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-bold text-green-600 flex items-center">
                  <BiRupee className="h-4 w-4" />
                  {parseFloat(record.net_salary).toFixed(0)}
                </span>
                <span className="text-xs text-gray-500 ml-1">net</span>
              </div>
            </div>
            
            <div className="w-1/2">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Adjustments</div>
              <div className="flex items-baseline">
                <span className="font-medium text-gray-700">
                  {record.unpaid_days % 1 === 0 ? parseInt(record.unpaid_days) : parseFloat(record.unpaid_days).toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 ml-1">unpaid days</span>
              </div>
              <div className="flex items-baseline mt-1">
                <span className="font-medium text-red-600 flex items-center">
                  <BiRupee className="h-3 w-3" />
                  {parseFloat(record.deductions).toFixed(0)}
                </span>
                <span className="text-xs text-gray-500 ml-1">deductions</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mt-2">
            {record.status === 'Pending' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsPaid(record.id);
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <FiCheckCircle className="-ml-0.5 mr-2 h-4 w-4" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/hr/payroll/${record.id}`);
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <FiEye className="-ml-0.5 mr-2 h-4 w-4" />
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-6 bg-gray-100 min-h-screen font-sans">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white z-50 p-4 sm:p-5 border-b border-gray-200 flex items-center justify-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Payroll Management
          </h1>
        </div>
      )}

      {/* Header with title and filter controls - sticky at the top */}
      <div className="sticky top-0 z-10 bg-white rounded-t-2xl shadow-md border border-gray-200 mb-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">
            Payroll Management
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-auto">
              <FiCalendar className="text-indigo-500 mr-2" />
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="bg-transparent pr-6 pl-0 py-1 text-sm focus:outline-none appearance-none"
                aria-label="Select month"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className="relative flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-auto">
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="bg-transparent pr-6 pl-0 py-1 text-sm focus:outline-none appearance-none"
                aria-label="Select year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleRunPayroll}
              disabled={runningPayroll}
              className={`sm:ml-auto inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-300 ${
                runningPayroll
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {runningPayroll ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-4 w-4" /> Processing...
                </>
              ) : (
                <>
                  <FiPlay className="mr-2 h-4 w-4" /> Run Payroll
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content container */}
      <div className="bg-white rounded-b-2xl shadow-lg mb-8 border border-gray-200 p-4 sm:p-5">
        {/* Payroll Summary */}
        {summary && (
          <div
            className={`grid ${
              isMobile
                ? "grid-cols-2 gap-3"
                : "grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            } mb-8`}
          >
          <SummaryCard
            icon={<FiUsers className="h-6 w-6" />}
            title="Employees"
            value={summary.employee_count}
          />
          <SummaryCard
            icon={<FiTrendingUp className="h-6 w-6" />}
            title="Total Gross"
            value={`₹${summary.total_gross.toLocaleString()}`}
            color="green"
          />
          <SummaryCard
            icon={<FiTrendingDown className="h-6 w-6" />}
            title="Total Deductions"
            value={`₹${summary.total_deductions.toLocaleString()}`}
            color="red"
          />
          <SummaryCard
            icon={<BiRupee className="h-6 w-6" />}
            title="Total Net"
            value={`₹${summary.total_net.toLocaleString()}`}
            color="blue"
          />
        </div>
      )}

      {/* Payroll Table */}
      <div
        className={`bg-white ${
          isMobile ? "p-4" : "p-6 sm:p-8"
        } rounded-2xl shadow-lg border border-gray-200 ${
          isMobile ? "pb-20" : ""
        }`}
      >
        <h2
          className={`${
            isMobile ? "text-lg" : "text-xl sm:text-2xl"
          } font-bold text-gray-800 mb-4 sm:mb-6`}
        >
          Payroll Results for {months.find((m) => m.value === month).name}{" "}
          {year}
        </h2>
        {/* Mobile View */}
        {isMobile && (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <FiLoader className="animate-spin text-indigo-600 h-8 w-8" />
              </div>
            )}

            {payrollData.length > 0 ? (
              payrollData.map((record) => (
                <MobilePayrollCard key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 text-sm sm:text-base">
                No payroll data found for the selected period.
              </div>
            )}
          </div>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <div className="relative overflow-x-auto rounded-lg border">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <FiLoader className="animate-spin text-indigo-600 h-8 w-8" />
              </div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Gross Salary
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Unpaid Days
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Deductions
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Net Salary
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.length > 0 ? (
                  payrollData.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50 transition-colors duration-200`}
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">
                          {record.full_name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm sm:text-base text-gray-700 font-medium">
                          ₹{parseFloat(record.gross_salary).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm sm:text-base text-gray-700 font-medium">
                          {record.unpaid_days}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm sm:text-base text-red-600 font-medium">
                          - ₹{parseFloat(record.deductions).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm sm:text-base font-bold text-gray-900">
                          ₹{parseFloat(record.net_salary).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
                            record.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          {record.status === "Pending" && (
                            <button
                              onClick={() => handleMarkAsPaid(record.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                              <FiCheckCircle className="-ml-0.5 mr-2 h-4 w-4" />
                              Mark as Paid
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/hr/payroll/${record.id}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          >
                            <FiEye className="-ml-0.5 mr-2 h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-gray-500 py-10 text-sm sm:text-base"
                    >
                      No payroll data found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4 text-amber-600">
              <FiAlertTriangle className="h-5 sm:h-6 w-5 sm:w-6 mr-2" />
              <h3 className="text-base sm:text-lg font-bold">
                Payroll Records Exist
              </h3>
            </div>
            <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
              {recordCount} payroll record{recordCount !== 1 ? "s" : ""} already
              exist for {months.find((m) => m.value === month)?.name} {year}. Do
              you want to delete these records and recalculate?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRecalculate}
                className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-sm sm:text-base"
              >
                Delete and Recalculate
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Payroll;
