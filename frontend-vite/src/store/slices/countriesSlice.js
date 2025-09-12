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
export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/countries`, { 
        headers: getAuthHeaders() 
      });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCountry = createAsyncThunk(
  'countries/addCountry',
  async (countryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/countries`, countryData, { 
        headers: getAuthHeaders() 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCountry = createAsyncThunk(
  'countries/updateCountry',
  async ({ id, countryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/countries/${id}`, countryData, { 
        headers: getAuthHeaders() 
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCountry = createAsyncThunk(
  'countries/deleteCountry',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/countries/${id}`, { 
        headers: getAuthHeaders() 
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedCountry: null
  },
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    clearSelectedCountry: (state) => {
      state.selectedCountry = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add country
      .addCase(addCountry.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      // Update country
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.items.findIndex(country => country.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Delete country
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.items = state.items.filter(country => country.id !== action.payload);
      });
  }
});

export const { setSelectedCountry, clearSelectedCountry } = countriesSlice.actions;

export default countriesSlice.reducer;
