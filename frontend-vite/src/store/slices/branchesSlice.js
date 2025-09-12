import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('Admintoken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Async thunks for API calls
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/branches`, { 
        headers: getAuthHeaders() 
      });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBranchesByCountry = createAsyncThunk(
  'branches/fetchBranchesByCountry',
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/branches/by-country/${countryId}`, { 
        headers: getAuthHeaders() 
      });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addBranch = createAsyncThunk(
  'branches/addBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/branches`, branchData, { 
        headers: getAuthHeaders() 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ id, branchData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/branches/${id}`, branchData, { 
        headers: getAuthHeaders() 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/deleteBranch',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/branches/${id}`, { 
        headers: getAuthHeaders() 
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState: {
    items: [],
    filteredItems: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedBranch: null
  },
  reducers: {
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },
    filterBranchesByCountry: (state, action) => {
      const countryId = action.payload;
      if (countryId) {
        state.filteredItems = state.items.filter(branch => branch.country_id === countryId);
      } else {
        state.filteredItems = state.items;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all branches
      .addCase(fetchBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch branches by country
      .addCase(fetchBranchesByCountry.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranchesByCountry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload;
      })
      .addCase(fetchBranchesByCountry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add branch
      .addCase(addBranch.fulfilled, (state, action) => {
        state.items.push(action.payload);
        if (state.filteredItems.length > 0 && action.payload.country_id === state.items[0]?.country_id) {
          state.filteredItems.push(action.payload);
        }
      })
      
      // Update branch
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.items.findIndex(branch => branch.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        const filteredIndex = state.filteredItems.findIndex(branch => branch.id === action.payload.id);
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload;
        }
      })
      
      // Delete branch
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.items = state.items.filter(branch => branch.id !== action.payload);
        state.filteredItems = state.filteredItems.filter(branch => branch.id !== action.payload);
      });
  }
});

export const { setSelectedBranch, clearSelectedBranch, filterBranchesByCountry } = branchesSlice.actions;

export default branchesSlice.reducer;
