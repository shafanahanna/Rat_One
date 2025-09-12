import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Async thunks for API calls
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(`${API_URL}/api/employees`, employeeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.put(`${API_URL}/api/employees/${id}`, employeeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.delete(`${API_URL}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete employee');
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  success: false,
  message: ''
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || action.payload;
        state.success = true;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch employees';
      })
      
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload.data || action.payload;
        state.success = true;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch employee';
      })
      
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Employee created successfully';
        state.employees.push(action.payload.data || action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create employee';
        state.success = false;
      })
      
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Employee updated successfully';
        
        const updatedEmployee = action.payload.data || action.payload;
        const index = state.employees.findIndex(emp => emp.id === updatedEmployee.id);
        
        if (index !== -1) {
          state.employees[index] = updatedEmployee;
        }
        
        state.currentEmployee = updatedEmployee;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update employee';
        state.success = false;
      })
      
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Employee deleted successfully';
        state.employees = state.employees.filter(emp => emp.id !== action.payload.id);
        
        if (state.currentEmployee && state.currentEmployee.id === action.payload.id) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete employee';
        state.success = false;
      });
  }
});

export const { resetEmployeeState, clearCurrentEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
