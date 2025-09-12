import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LeaveCalendarView = ({ leaves }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [monthLeaves, setMonthLeaves] = useState([]);

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to display
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Calculate how many days to show from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    // Add days from next month
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    setCalendarDays(days);
    
    // Filter leave applications for the current month view
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    // Make sure leaves is defined before filtering
    const leavesToFilter = leaves || [];
    const filteredLeaves = leavesToFilter.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      
      // Check if leave overlaps with the current month
      return (
        (startDate <= endOfMonth && startDate >= startOfMonth) || 
        (endDate >= startOfMonth && endDate <= endOfMonth) ||
        (startDate <= startOfMonth && endDate >= endOfMonth)
      );
    });
    
    setMonthLeaves(filteredLeaves);
  }, [currentDate, leaves]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format date to display in calendar
  const formatDate = (date) => {
    return date.getDate();
  };

  // Check if a specific date has leave applications
  const getLeavesForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    return monthLeaves.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      
      // Set time to midnight for comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      
      return date >= startDate && date <= endDate;
    });
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="leave-calendar">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={`day-header-${index}`} className="bg-gray-100 py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const dayLeaves = getLeavesForDate(day.date);
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
          const uniqueDayKey = `day-${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}-${index}`;
          
          return (
            <div
              key={uniqueDayKey}
              className={`min-h-[80px] p-2 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${isWeekend ? 'bg-gray-50' : ''}`}
            >
              <div className="flex justify-between">
                <span
                  className={`text-sm font-medium ${
                    isToday(day.date)
                      ? 'h-6 w-6 rounded-full bg-[#47BCCB] text-white flex items-center justify-center'
                      : ''
                  }`}
                >
                  {formatDate(day.date)}
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {dayLeaves.map((leave, leaveIndex) => (
                  <div
                    key={`${leave.id}-${leaveIndex}`}
                    className="text-xs px-1 py-0.5 rounded truncate"
                    style={{
                      backgroundColor: `${leave.color}30`,
                      color: leave.color,
                      borderLeft: `2px solid ${leave.color}`
                    }}
                    title={`${leave.leave_type} (${leave.status})`}
                  >
                    {leave.leave_type}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {monthLeaves.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(monthLeaves.map(leave => leave.leave_type))).map((leaveType) => {
              const leave = monthLeaves.find(l => l.leave_type === leaveType);
              return (
                <div key={`legend-${leaveType}`} className="flex items-center text-xs">
                  <div
                    className="h-3 w-3 rounded-full mr-1"
                    style={{ backgroundColor: leave.color }}
                  ></div>
                  <span>{leaveType}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendarView;
