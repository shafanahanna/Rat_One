import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to get initial user from localStorage
const getInitialUser = () => {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  
  if (userId && role) {
    return {
      id: userId,
      role: role
    };
  }
  return null;
};

// Initial state
const initialState = {
  currentUser: getInitialUser(),
  token: localStorage.getItem('Admintoken') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('Admintoken')
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password_hash: password
      });
      
      if (response.data.token) {
        localStorage.setItem('Admintoken', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.id);
        
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Fetch employee profile to get employeeId
        try {
          // Fix: Use correct API endpoint with plural 'employees'
          const profileResponse = await axios.get(`${API_URL}/api/employees/profile`, {
            headers: { Authorization: `Bearer ${response.data.token}` }
          });
          
          if (profileResponse.data && profileResponse.data.data && profileResponse.data.data.id) {
            localStorage.setItem('employeeId', profileResponse.data.data.id);
            console.log('Employee ID stored in localStorage after login:', profileResponse.data.data.id);
          }
        } catch (profileErr) {
          console.warn('Could not fetch employee profile after login:', profileErr.message);
        }
        
        return {
          token: response.data.token,
          user: {
            id: response.data.id,
            role: response.data.role
          }
        };
      } else {
        return rejectWithValue('Login failed');
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Registration failed',
        validationErrors: err.response?.data?.errors
      });
    }
  }
);

// Thunk to initialize user from localStorage
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      
      if (!token || !userId || !role) {
        return rejectWithValue('No valid authentication found');
      }
      
      // Validate token by decoding
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Check if token is expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.error('Token is expired!');
            return rejectWithValue('Token expired');
          }
        }
      } catch (tokenError) {
        console.warn('Could not decode token:', tokenError);
      }
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        token,
        user: {
          id: userId,
          role: role
        }
      };
    } catch (err) {
      return rejectWithValue('Failed to initialize authentication');
    }
  }
);


// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('Admintoken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('employeeId'); // Also remove employeeId on logout
      delete axios.defaults.headers.common['Authorization'];
      
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        // Don't set error here to avoid showing error messages on app startup
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
