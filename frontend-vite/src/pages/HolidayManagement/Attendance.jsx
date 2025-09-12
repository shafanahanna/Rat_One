import React, { useEffect, useMemo, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getYear,
  getMonth,
  getDaysInMonth,
  addMonths,
  subMonths,
  format,
  startOfToday,
} from "date-fns";
import {
  FiCheckSquare,
  FiXSquare,
  FiMinusSquare,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  fetchEmployeesForAttendance,
  fetchAttendanceData,
  fetchDailySummary,
  updateAttendanceStatus,
  setDailySummaryDate
} from "../../redux/slices/attendanceSlice";

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Present":
      return "bg-green-50 text-green-700 font-normal hover:bg-green-100";
    case "Leave":
      return "bg-blue-50 text-blue-700 font-normal hover:bg-blue-100";
    case "Absent":
      return "bg-red-50 text-red-700 font-normal hover:bg-red-100";
    case "Holiday":
      return "bg-purple-50 text-purple-700 font-normal hover:bg-purple-100";
    case "Halfday":
      return "bg-yellow-50 text-yellow-700 font-normal hover:bg-yellow-100";
    case "Sick":
      return "bg-orange-50 text-orange-700 font-normal hover:bg-orange-100";
    default:
      return "hover:bg-gray-100";
  }
};

const EmployeeRow = memo(
  ({
    employee,
    employeeAttendance,
    summary,
    daysInMonth,
    year,
    month,
    onCellClick,
  }) => {
    return (
      <tr className="group hover:bg-gray-50/50 transition-colors duration-200">
        <td className="py-3 px-4 font-medium text-sm whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50/50 z-10 text-gray-700 border-r border-gray-100">
          <div className="group/tooltip cursor-default">
            {employee.fullName || 'N/A'}
            <div className="absolute left-full ml-2 top-0 z-50 bg-white shadow-lg rounded-lg p-3 w-48 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 border border-gray-200">
              <div className="flex flex-col text-xs font-normal space-y-1">
                <span className="text-green-600">
                  Present: {summary?.Present || 0}
                </span>
                <span className="text-blue-600">
                  Leave: {summary?.Leave || 0}
                </span>
                <span className="text-orange-600">
                  Sick: {summary?.Sick || 0}
                </span>
                <span className="text-purple-600">
                  Holiday: {summary?.Holiday || 0}
                </span>
                <span className="text-red-600">
                  Absent: {summary?.Absent || 0}
                </span>
                <span className="text-yellow-600">
                  Halfday: {summary?.Halfday || 0}
                </span>
              </div>
            </div>
          </div>
        </td>
        {[...Array(daysInMonth).keys()].map((day) => {
          const date = new Date(year, month - 1, day + 1);
          const dateKey = format(date, "yyyy-MM-dd");
          const isSunday = date.getDay() === 0;
          const status = employeeAttendance?.[dateKey] || "";

          const cellClass = isSunday
            ? "bg-red-50 text-red-500 font-medium cursor-not-allowed"
            : `cursor-pointer transition-colors duration-200 ${getStatusClass(
                status
              )}`;

          return (
            <td
              key={day}
              className={`py-3 text-center text-sm ${cellClass}`}
              onClick={() => !isSunday && onCellClick(employee.id, day + 1)}
            >
              {isSunday ? (
                ""
              ) : status ? (
                <div className="group/status relative">
                  <span>
                    {status === "Halfday" ? "H/D" : status.charAt(0)}
                  </span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-opacity duration-200 whitespace-nowrap">
                    {status}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </td>
          );
        })}
      </tr>
    );
  }
);

const SummaryCard = ({ icon, title, value, color = "indigo" }) => (
  <div className="bg-white shadow-lg rounded-xl p-2 flex items-center justify-around space-x-4">
    <div className={`bg-${color}-100 rounded-full p-2 text-${color}-600`}>
      {React.cloneElement(icon, { className: "h-4 w-4" })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const Attendance = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = React.useState(startOfToday());
  
  // Get state from Redux
  const employees = useSelector(state => state.attendance.employees);
  const attendanceData = useSelector(state => state.attendance.attendanceData);
  const dailySummary = useSelector(state => state.attendance.dailySummary);
  const dailySummaryDate = useSelector(state => state.attendance.dailySummaryDate);
  const loading = useSelector(state => state.attendance.loading.attendance);
  const dailySummaryLoading = useSelector(state => state.attendance.loading.dailySummary);

  const { year, month } = useMemo(
    () => ({
      year: getYear(currentDate),
      month: getMonth(currentDate) + 1,
    }),
    [currentDate]
  );

  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const attendanceSummary = useMemo(() => {
    const summary = {};
    employees.forEach((employee) => {
      summary[employee.id] = {
        Present: 0,
        Leave: 0,
        Sick: 0,
        Absent: 0,
        Holiday: 0,
        Halfday: 0,
      };
      const employeeAtt = attendanceData[employee.id] || {};
      Object.values(employeeAtt).forEach((status) => {
        if (status) {
          summary[employee.id][status] =
            (summary[employee.id][status] || 0) + 1;
        }
      });
    });
    return summary;
  }, [employees, attendanceData]);

  const fetchEmployees = useCallback(() => {
    dispatch(fetchEmployeesForAttendance());
  }, [dispatch]);

  const fetchAttendance = useCallback(() => {
    dispatch(fetchAttendanceData({ month, year }));
  }, [dispatch, month, year]);

  const fetchDailySummaryData = useCallback((date) => {
    if (!date) return;
    dispatch(fetchDailySummary(date));
  }, [dispatch]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees.length > 0) {
      fetchAttendance();
    }
  }, [employees, fetchAttendance]);

  useEffect(() => {
    fetchDailySummaryData(dailySummaryDate);
  }, [dailySummaryDate, fetchDailySummaryData]);

  const handleCellClick = useCallback(
    (employeeId, day) => {
      const date = new Date(year, month - 1, day);
      const dateKey = format(date, "yyyy-MM-dd");
      const currentStatus = attendanceData[employeeId]?.[dateKey] || "";

      let nextStatus = "Present";
      if (currentStatus) {
        switch (currentStatus) {
          case "Present":
            nextStatus = "Leave";
            break;
          case "Leave":
            nextStatus = "Sick";
            break;
          case "Sick":
            nextStatus = "Absent";
            break;
          case "Absent":
            nextStatus = "Halfday";
            break;
          case "Halfday":
            nextStatus = "Holiday";
            break;
          case "Holiday":
            nextStatus = "";
            break;
          default:
            nextStatus = "";
        }
      }

      // Dispatch action to update attendance status
      dispatch(updateAttendanceStatus({
        employeeId,
        date: dateKey,
        status: nextStatus
      }));

      // Refetch daily summary if the date matches
      if (dateKey === dailySummaryDate) {
        fetchDailySummaryData(dailySummaryDate);
      }
    },
    [year, month, attendanceData, dailySummaryDate, dispatch, fetchDailySummaryData]
  );

  const handleMobileAttendanceClick = useCallback(
    (employeeId, status) => {
      const todayDate = format(new Date(), "yyyy-MM-dd");
      
      // Dispatch action to update attendance status
      dispatch(updateAttendanceStatus({
        employeeId,
        date: todayDate,
        status
      }));

      // Refresh daily summary after marking attendance
      fetchDailySummaryData(todayDate);
    },
    [dispatch, fetchDailySummaryData]
  );

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const isMobile = useIsMobile();

  return (
    <div className="p-4 md:p-6 bg-gray-200 min-h-screen">
      {/* Daily Summary Section */}
      <div>
        {/* Mobile Daily Report Card */}
        {isMobile && (
          <div className="mb-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Daily Report
              </h2>
              <input
                type="date"
                value={dailySummaryDate}
                onChange={(e) => dispatch(setDailySummaryDate(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {dailySummaryLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Loading summary...</p>
              </div>
            ) : dailySummary ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {dailySummary.total_employees}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {dailySummary.present}
                  </div>
                  <div className="text-xs text-gray-600">Present</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">
                    {dailySummary.absent}
                  </div>
                  <div className="text-xs text-gray-600">Absent</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {dailySummary.leave}
                  </div>
                  <div className="text-xs text-gray-600">Leave</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {dailySummary.sick || 0}
                  </div>
                  <div className="text-xs text-gray-600">Sick</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">
                    {dailySummary.halfday}
                  </div>
                  <div className="text-xs text-gray-600">H/D</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    {dailySummary.holiday}
                  </div>
                  <div className="text-xs text-gray-600">Holiday</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  No data available for selected date
                </p>
              </div>
            )}
          </div>
        )}

        {/* Desktop Daily Report */}
        <div className="  h-[200px]" >
          {!isMobile && (
            <div className="mb-2 bg-[#f4f4f4] p-3 rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-16 z-30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Daily Report
                </h2>
                <div className="flex items-center justify-between">
                  <input
                    type="date"
                    value={dailySummaryDate}
                    onChange={(e) => dispatch(setDailySummaryDate(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-w-xs p-2.5"
                  />
                </div>
              </div>

              {dailySummaryLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading daily summary...</p>
                </div>
              ) : dailySummary ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                  <SummaryCard
                    icon={<FiCheckSquare />}
                    title="Present"
                    value={dailySummary.present}
                    color="green"
                  />
                  <SummaryCard
                    icon={<FiXSquare />}
                    title="Absent"
                    value={dailySummary.absent}
                    color="red"
                  />
                  <SummaryCard
                    icon={<FiMinusSquare />}
                    title="On Leave"
                    value={dailySummary.leave}
                    color="blue"
                  />
                  <SummaryCard
                    icon={<FiMinusSquare />}
                    title="Sick Leave"
                    value={dailySummary.sick || 0}
                    color="orange"
                  />
                  <SummaryCard
                    icon={<FiMinusSquare />}
                    title="Halfday"
                    value={dailySummary.halfday}
                    color="yellow"
                  />
                  <SummaryCard
                    icon={<FiMinusSquare />}
                    title="Holiday"
                    value={dailySummary.holiday}
                    color="purple"
                  />
                  <SummaryCard
                    icon={<FiAlertTriangle />}
                    title="Not Marked"
                    value={dailySummary.not_marked}
                    color="gray"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No summary data available for the selected date.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Attendance Marking Card */}
        {isMobile && (
          <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Today's Attendance
              </h2>
              <span className="text-sm text-gray-500">
                {format(new Date(), "MMM dd, yyyy")}
              </span>
            </div>

            {/* Employee List - Simple and Clean */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : employees.length > 0 ? (
                employees.slice(0, 5).map((employee) => {
                  const todayKey = format(new Date(), "yyyy-MM-dd");
                  const currentStatus =
                    attendanceData[employee.id]?.[todayKey] || "";

                  const getNextStatus = (current) => {
                    switch (current) {
                      case "":
                        return "Present";
                      case "Present":
                        return "Leave";
                      case "Leave":
                        return "Sick";
                      case "Sick":
                        return "Absent";
                      case "Absent":
                        return "Halfday";
                      case "Halfday":
                        return "Holiday";
                      case "Holiday":
                        return "";
                      default:
                        return "Present";
                    }
                  };

                  const getStatusDisplay = (status) => {
                    switch (status) {
                      case "Present":
                        return {
                          text: "P",
                          fullText: "Present",
                          bg: "bg-green-500",
                          hover: "hover:bg-green-600",
                        };
                      case "Absent":
                        return {
                          text: "A",
                          fullText: "Absent",
                          bg: "bg-red-500",
                          hover: "hover:bg-red-600",
                        };
                      case "Leave":
                        return {
                          text: "L",
                          fullText: "Leave",
                          bg: "bg-blue-500",
                          hover: "hover:bg-blue-600",
                        };
                      case "Sick":
                        return {
                          text: "S",
                          fullText: "Sick Leave (Paid)",
                          bg: "bg-orange-500",
                          hover: "hover:bg-orange-600",
                        };
                      case "Halfday":
                        return {
                          text: "H/D",
                          fullText: "Half Day",
                          bg: "bg-yellow-500",
                          hover: "hover:bg-yellow-600",
                        };
                      case "Holiday":
                        return {
                          text: "H",
                          fullText: "Holiday",
                          bg: "bg-purple-500",
                          hover: "hover:bg-purple-600",
                        };
                      default:
                        return {
                          text: "?",
                          fullText: "Not Marked",
                          bg: "bg-gray-300",
                          hover: "hover:bg-gray-400",
                        };
                    }
                  };

                  const statusDisplay = getStatusDisplay(currentStatus);

                  return (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-800">
                        {employee.fullName
  || 'N/A'
                        }
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-600">
                          {statusDisplay.fullText || "Not Marked"}
                        </span>
                        <button
                          onClick={() =>
                            handleMobileAttendanceClick(
                              employee.id,
                              getNextStatus(currentStatus)
                            )
                          }
                          className={`w-10 h-10 rounded-full text-sm font-medium text-white transition-colors ${statusDisplay.bg} ${statusDisplay.hover}`}
                          title={`Current: ${
                            statusDisplay.fullText || "Not Marked"
                          } - Click to change`}
                        >
                          {statusDisplay.text}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No employees found.</p>
                </div>
              )}
            </div>

            {employees.length > 5 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 text-sm font-medium">
                  View All ({employees.length} employees)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Monthly Grid Section */}
        {!isMobile && (
          <div className="mt-3  ">
            <div className="mb-8 ">
              <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={handlePrevMonth}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Prev
                </button>
                <h2 className="text-xl font-semibold text-center text-gray-600 tracking-wide">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200  ">
              {loading ? (
                <div className="text-center p-20 text-gray-500 text-lg">
                  Loading...
                </div>
              ) : (
                <table className="  text-sm text-left text-gray-700 table-fixed border-collaps ">
                  <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 ">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-4 w-52 sticky left-0 bg-gray-50 z-20 font-semibold text-sm text-gray-600 "
                      >
                        Employee
                      </th>
                      {[...Array(daysInMonth).keys()].map((day) => {
                        const date = new Date(year, month - 1, day + 1);
                        const isSunday = date.getDay() === 0;
                        return (
                          <th
                            key={day}
                            scope="col"
                            className={`py-3 px-2 w-16 text-center font-semibold ${
                              isSunday ? "text-red-500" : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`text-xs font-normal ${
                                isSunday ? "text-red-400" : "text-gray-400"
                              }`}
                            >
                              {format(date, "E")}
                            </div>
                            <div className="text-sm mt-1">{day + 1}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 ">
                    {employees.length > 0 ? (
                      employees.map((employee) => (
                        <EmployeeRow
                          key={employee.id}
                          employee={employee}
                          employeeAttendance={attendanceData[employee.id]}
                          summary={attendanceSummary[employee.id]}
                          daysInMonth={daysInMonth}
                          year={year}
                          month={month}
                          onCellClick={handleCellClick}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={daysInMonth + 2}
                          className="text-center py-10 text-gray-500"
                        >
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
