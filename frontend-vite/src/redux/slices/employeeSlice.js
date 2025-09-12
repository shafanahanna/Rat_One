import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import adminInstance from '../../Interceptors/adminInstance';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      console.log('Fetching employees with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_URL}/api/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Employee API Response:', response);
      console.log('Employee API Response Status:', response.status);
      console.log('Employee API Response Data:', response.data);
      
      if (response.data.status === 'Success') {
        console.log('Employee data retrieved successfully:', response.data.data);
        return response.data.data;
      } else {
        console.error('Employee API returned error status:', response.data.message);
        return rejectWithValue(response.data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', error.response?.data || 'No detailed error data');
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'Success') {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch employee');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const createEmployeeProfile = createAsyncThunk(
  'employees/createEmployeeProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      console.log('Creating employee profile with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      // If userId is not provided in profileData, get it from localStorage
      if (!profileData.userId) {
        profileData.userId = localStorage.getItem('userId');
      }
      
      console.log('Creating employee profile with data:', profileData);
      
      const response = await axios.post(`${API_URL}/api/employees`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Create Employee Profile API Response:', response);
      
      if (response.data && response.data.status === 'Success') {
        const employeeData = response.data.data;
        console.log('Employee profile created successfully:', employeeData);
        
        // Store employee ID in localStorage
        if (employeeData && employeeData.id) {
          localStorage.setItem('employeeId', employeeData.id);
          console.log('Employee ID stored in localStorage:', employeeData.id);
        }
        
        return employeeData;
      } else {
        console.error('Create Employee Profile API returned error status:', response.data.message);
        return rejectWithValue(response.data.message || 'Failed to create employee profile');
      }
    } catch (error) {
      console.error('Error creating employee profile:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchEmployeeProfile = createAsyncThunk(
  'employees/fetchEmployeeProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      console.log('Fetching employee profile with token:', token ? 'Token exists' : 'No token');
      
      // Use the correct endpoint: /api/employees/profile (plural)
      const response = await axios.get(`${API_URL}/api/employees/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Employee Profile API Response:', response);
      
      if (response.data.status === 'Success') {
        console.log('Employee profile retrieved successfully:', response.data.data);
        
        const data = response.data.data;
        
        // Store employee ID in localStorage if it exists in the response
        if (data && data.id) {
          localStorage.setItem('employeeId', data.id);
          console.log('Employee ID stored in localStorage from profile:', data.id);
        }
        
        // Normalize the data to handle both field naming conventions
        const normalizedData = {
          id: data.id,
          fullName: data.full_name || data.fullName,
          designation: data.designation,
          department: data.department,
          empCode: data.emp_code || data.empCode,
          dateOfJoining: data.date_of_joining || data.dateOfJoining,
          email: data.email || (data.user ? data.user.email : null),
          userId: data.user_id || (data.user ? data.user.id : null),
          role: data.role || (data.user ? data.user.role : null),
          profilePicture: data.profile_picture || data.profilePicture,
          // Keep original data for reference
          originalData: data
        };
        
        console.log('Normalized employee data:', normalizedData);
        return normalizedData;
      } else {
        console.error('Employee Profile API returned error status:', response.data.message);
        return rejectWithValue(response.data.message || 'Failed to fetch employee profile');
      }
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      console.error('Error details:', error.response?.data || 'No detailed error data');
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(`${API_URL}/api/employees`, employeeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'Success') {
        // Store employee ID in localStorage
        if (response.data.data && response.data.data.id) {
          localStorage.setItem('employeeId', response.data.data.id);
          console.log('Employee ID stored in localStorage:', response.data.data.id);
        }
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to create employee');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.put(`${API_URL}/api/employees/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'Success') {
        return { id, ...response.data.data };
      } else {
        return rejectWithValue(response.data.message || 'Failed to update employee');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.delete(`${API_URL}/api/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'Success') {
        return id;
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete employee');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const updateSalaryStatus = createAsyncThunk(
  'employees/updateSalaryStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.put(`${API_URL}/api/employees/${id}/salary-status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'Success') {
        return { id, status };
      } else {
        return rejectWithValue(response.data.message || 'Failed to update salary status');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

// Removed duplicate fetchEmployeeProfile thunk

export const uploadProfilePicture = createAsyncThunk(
  'employees/uploadProfilePicture',
  async ({ employeeId, profilePictureUrl }, { rejectWithValue }) => {
    try {
      console.log('Uploading profile picture for employee:', employeeId);
      
      const response = await adminInstance.uploadFile(
        `/api/employees/profile-picture/${employeeId}`,
        { profilePictureUrl },
        (progressEvent) => {
          // Track upload progress if needed
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      );
      
      if (response.data && response.data.status === 'Success') {
        console.log('Profile picture uploaded successfully:', response.data);
        return {
          employeeId,
          profilePictureUrl: response.data.data.profile_picture
        };
      } else {
        console.error('Profile picture upload failed:', response.data);
        return rejectWithValue(response.data?.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error during profile picture upload');
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  departments: [],
  presentToday: 0,
  profilePictureLoading: false,
  profilePictureError: null,
  profileLoading: false,
  profileError: null,
  profileCreating: false,
  profileCreateError: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
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
        state.employees = action.payload;
        // Extract unique departments
        state.departments = [...new Set(action.payload.map(emp => emp.department))].filter(Boolean);
        // Calculate present today (active employees)
        state.presentToday = action.payload.filter(emp => emp.is_active).length;
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
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch employee';
      })
      
      // This section is replaced by the one below
      
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create employee';
      })
      
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee && state.currentEmployee.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update employee';
      })
      
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        if (state.currentEmployee && state.currentEmployee.id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete employee';
      })
      
      // Update salary status
      .addCase(updateSalaryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalaryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index].salary_status = action.payload.status;
        }
        if (state.currentEmployee && state.currentEmployee.id === action.payload.id) {
          state.currentEmployee.salary_status = action.payload.status;
        }
      })
      .addCase(updateSalaryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update salary status';
      })
      
      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.profilePictureLoading = true;
        state.profilePictureError = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profilePictureLoading = false;
        const { employeeId, profilePictureUrl } = action.payload;
        
        // Update in employees array
        const employeeIndex = state.employees.findIndex(emp => emp.id === employeeId);
        if (employeeIndex !== -1) {
          state.employees[employeeIndex].profilePicture = profilePictureUrl;
        }
        
        // Update in currentEmployee if it's the same employee
        if (state.currentEmployee && state.currentEmployee.id === employeeId) {
          state.currentEmployee.profilePicture = profilePictureUrl;
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.profilePictureLoading = false;
        state.profilePictureError = action.payload || 'Failed to upload profile picture';
      })
      
      // Fetch employee profile
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || 'Failed to fetch employee profile';
      })
      
      // Create employee profile
      .addCase(createEmployeeProfile.pending, (state) => {
        state.profileCreating = true;
        state.profileCreateError = null;
      })
      .addCase(createEmployeeProfile.fulfilled, (state, action) => {
        state.profileCreating = false;
        state.currentEmployee = action.payload;
        state.profileError = null; // Clear any previous profile fetch errors
      })
      .addCase(createEmployeeProfile.rejected, (state, action) => {
        state.profileCreating = false;
        state.profileCreateError = action.payload || 'Failed to create employee profile';
      });
  }
});

export const { clearError, setCurrentEmployee, clearCurrentEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
