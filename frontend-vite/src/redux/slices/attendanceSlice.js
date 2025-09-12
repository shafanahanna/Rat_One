import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Async thunks
export const fetchEmployeesForAttendance = createAsyncThunk(
  'attendance/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(
        `${API_URL}/api/attendance?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data.data;
      const formattedData = {};
      data.forEach((item) => {
        if (!formattedData[item.employee_id]) {
          formattedData[item.employee_id] = {};
        }
        formattedData[item.employee_id][item.date] = item.status;
      });
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchDailySummary = createAsyncThunk(
  'attendance/fetchDailySummary',
  async (date, { rejectWithValue }) => {
    if (!date) return null;
    
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(
        `${API_URL}/api/attendance/summary?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const updateAttendanceStatus = createAsyncThunk(
  'attendance/updateAttendanceStatus',
  async ({ employeeId, date, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.post(`${API_URL}/api/attendance`, {
        employee_id: employeeId,
        date,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return { employeeId, date, status };
    } catch (error) {
      console.error('Error updating attendance:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

const initialState = {
  employees: [],
  attendanceData: {},
  dailySummary: null,
  dailySummaryDate: format(new Date(), "yyyy-MM-dd"),
  loading: {
    employees: false,
    attendance: false,
    dailySummary: false,
    updateStatus: false
  },
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setDailySummaryDate: (state, action) => {
      state.dailySummaryDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployeesForAttendance.pending, (state) => {
        state.loading.employees = true;
        state.error = null;
      })
      .addCase(fetchEmployeesForAttendance.fulfilled, (state, action) => {
        state.loading.employees = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployeesForAttendance.rejected, (state, action) => {
        state.loading.employees = false;
        state.error = action.payload || 'Failed to fetch employees';
      })
      
      // Fetch attendance data
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loading.attendance = true;
        state.error = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loading.attendance = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loading.attendance = false;
        state.error = action.payload || 'Failed to fetch attendance data';
      })
      
      // Fetch daily summary
      .addCase(fetchDailySummary.pending, (state) => {
        state.loading.dailySummary = true;
        state.error = null;
      })
      .addCase(fetchDailySummary.fulfilled, (state, action) => {
        state.loading.dailySummary = false;
        state.dailySummary = action.payload;
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.loading.dailySummary = false;
        state.error = action.payload || 'Failed to fetch daily summary';
      })
      
      // Update attendance status
      .addCase(updateAttendanceStatus.pending, (state) => {
        state.loading.updateStatus = true;
        state.error = null;
      })
      .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
        state.loading.updateStatus = false;
        const { employeeId, date, status } = action.payload;
        
        // Update the attendance data in state
        if (!state.attendanceData[employeeId]) {
          state.attendanceData[employeeId] = {};
        }
        
        if (status) {
          state.attendanceData[employeeId][date] = status;
        } else {
          // If status is empty, remove the entry
          if (state.attendanceData[employeeId][date]) {
            delete state.attendanceData[employeeId][date];
          }
        }
      })
      .addCase(updateAttendanceStatus.rejected, (state, action) => {
        state.loading.updateStatus = false;
        state.error = action.payload || 'Failed to update attendance status';
      });
  }
});

export const { setDailySummaryDate, clearError } = attendanceSlice.actions;

export default attendanceSlice.reducer;
