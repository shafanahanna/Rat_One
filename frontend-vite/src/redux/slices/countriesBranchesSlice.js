import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks for API calls
export const fetchCountries = createAsyncThunk(
  'countriesBranches/fetchCountries',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(`${API_URL}/api/countries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        const countries = response.data.data;
        
        // After fetching countries, fetch branches for each country
        countries.forEach(country => {
          dispatch(fetchBranchesByCountry(country.id));
        });
        
        return countries;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch countries");
    }
  }
);

export const fetchBranchesByCountry = createAsyncThunk(
  'countriesBranches/fetchBranchesByCountry',
  async (countryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(`${API_URL}/api/branches/country/${countryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        return { countryId, branches: response.data.data };
      }
      return { countryId, branches: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch branches for country ${countryId}`);
    }
  }
);

export const addCountry = createAsyncThunk(
  'countriesBranches/addCountry',
  async (countryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.post(`${API_URL}/api/countries`, countryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add country");
    }
  }
);

export const updateCountry = createAsyncThunk(
  'countriesBranches/updateCountry',
  async ({ id, countryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.put(`${API_URL}/api/countries/${id}`, countryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        return { id, ...response.data.data };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update country");
    }
  }
);

export const deleteCountry = createAsyncThunk(
  'countriesBranches/deleteCountry',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.delete(`${API_URL}/api/countries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        return id;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete country");
    }
  }
);

export const addBranch = createAsyncThunk(
  'countriesBranches/addBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.post(`${API_URL}/api/branches`, branchData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add branch");
    }
  }
);

export const updateBranch = createAsyncThunk(
  'countriesBranches/updateBranch',
  async ({ id, branchData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.put(`${API_URL}/api/branches/${id}`, branchData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        return { id, ...response.data.data };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update branch");
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'countriesBranches/deleteBranch',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.delete(`${API_URL}/api/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        return id;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete branch");
    }
  }
);

const initialState = {
  countries: [],
  loading: false,
  error: null,
  expandedCountries: {},
  sortConfig: { key: "country_name", direction: "asc" },
  searchTerm: "",
};

const countriesBranchesSlice = createSlice({
  name: 'countriesBranches',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleCountryExpansion: (state, action) => {
      const countryId = action.payload;
      state.expandedCountries[countryId] = !state.expandedCountries[countryId];
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserCounts: (state, action) => {
      state.countries = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
        
        // Initialize expanded state for each country
        const expandedState = {};
        action.payload.forEach(country => {
          expandedState[country.id] = state.expandedCountries[country.id] || false;
        });
        state.expandedCountries = expandedState;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch branches by country
      .addCase(fetchBranchesByCountry.fulfilled, (state, action) => {
        const { countryId, branches } = action.payload;
        const countryIndex = state.countries.findIndex(country => country.id === countryId);
        
        if (countryIndex !== -1) {
          state.countries[countryIndex].branches = branches;
        }
      })
      .addCase(fetchBranchesByCountry.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add country
      .addCase(addCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.countries.push(action.payload);
          state.expandedCountries[action.payload.id] = false;
        }
      })
      .addCase(addCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update country
      .addCase(updateCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.countries.findIndex(country => country.id === action.payload.id);
          if (index !== -1) {
            state.countries[index] = {
              ...state.countries[index],
              ...action.payload
            };
          }
        }
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete country
      .addCase(deleteCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.countries = state.countries.filter(country => country.id !== action.payload);
          delete state.expandedCountries[action.payload];
        }
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add branch
      .addCase(addBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const countryIndex = state.countries.findIndex(country => country.id === action.payload.countryId);
          if (countryIndex !== -1) {
            if (!state.countries[countryIndex].branches) {
              state.countries[countryIndex].branches = [];
            }
            state.countries[countryIndex].branches.push(action.payload);
          }
        }
      })
      .addCase(addBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const countryIndex = state.countries.findIndex(country => 
            country.branches && country.branches.some(branch => branch.id === action.payload.id)
          );
          
          if (countryIndex !== -1) {
            const branchIndex = state.countries[countryIndex].branches.findIndex(
              branch => branch.id === action.payload.id
            );
            
            if (branchIndex !== -1) {
              state.countries[countryIndex].branches[branchIndex] = {
                ...state.countries[countryIndex].branches[branchIndex],
                ...action.payload
              };
            }
          }
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          for (let i = 0; i < state.countries.length; i++) {
            if (state.countries[i].branches) {
              state.countries[i].branches = state.countries[i].branches.filter(
                branch => branch.id !== action.payload
              );
            }
          }
        }
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchTerm, toggleCountryExpansion, setSortConfig, clearError, updateUserCounts } = countriesBranchesSlice.actions;

export default countriesBranchesSlice.reducer;
