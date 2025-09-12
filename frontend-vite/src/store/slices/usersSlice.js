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
export const fetchUsersWithContext = createAsyncThunk(
  'users/fetchUsersWithContext',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/with-context`, { 
        headers: getAuthHeaders() 
      });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAssignmentStats = createAsyncThunk(
  'users/fetchAssignmentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/assignment-stats`, { 
        headers: getAuthHeaders() 
      });
      return response.data.data || { assignments: [], unassigned_count: 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserBranch = createAsyncThunk(
  'users/updateUserBranch',
  async ({ userId, branchId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/${userId}/branch`, 
        { branch_id: branchId }, 
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkUpdateUserBranch = createAsyncThunk(
  'users/bulkUpdateUserBranch',
  async ({ userIds, branchId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/bulk-branch-update`, 
        { user_ids: userIds, branch_id: branchId }, 
        { headers: getAuthHeaders() }
      );
      return { userIds, branchId, updatedUsers: response.data.data || [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnassignedUsers = createAsyncThunk(
  'users/fetchUnassignedUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching unassigned users from:', `${API_URL}/api/users/unassigned`);
      const response = await axios.get(`${API_URL}/api/users/unassigned`, { 
        headers: getAuthHeaders() 
      });
      
      console.log('Unassigned users API response:', response.data);
      // Check if response.data.data exists, otherwise check if response.data exists directly
      if (response.data && response.data.status === "Success") {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching unassigned users:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch unassigned users");
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedUsers: [],
    assignmentStats: {
      assignments: [],
      unassigned_count: 0
    },
    bulkEditMode: false,
    unassignedUsers: [],
    unassignedUsersLoading: false,
    unassignedUsersError: null
  },
  reducers: {
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      const index = state.selectedUsers.indexOf(userId);
      
      if (index === -1) {
        state.selectedUsers.push(userId);
      } else {
        state.selectedUsers.splice(index, 1);
      }
    },
    selectAllUsers: (state) => {
      state.selectedUsers = state.items.map(user => user.id);
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    setBulkEditMode: (state, action) => {
      state.bulkEditMode = action.payload;
      if (!action.payload) {
        state.selectedUsers = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users with context
      .addCase(fetchUsersWithContext.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersWithContext.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsersWithContext.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch assignment stats
      .addCase(fetchAssignmentStats.fulfilled, (state, action) => {
        state.assignmentStats = action.payload;
      })
      
      // Update user branch
      .addCase(updateUserBranch.fulfilled, (state, action) => {
        const index = state.items.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Bulk update user branches
      .addCase(bulkUpdateUserBranch.fulfilled, (state, action) => {
        // Update users in the state with the returned updated users
        action.payload.updatedUsers.forEach(updatedUser => {
          const index = state.items.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.items[index] = updatedUser;
          }
        });
        
        // Clear selection after bulk update
        state.selectedUsers = [];
        state.bulkEditMode = false;
      })
      
      // Fetch unassigned users
      .addCase(fetchUnassignedUsers.pending, (state) => {
        state.unassignedUsersLoading = true;
        state.unassignedUsersError = null;
      })
      .addCase(fetchUnassignedUsers.fulfilled, (state, action) => {
        state.unassignedUsersLoading = false;
        state.unassignedUsers = action.payload;
      })
      .addCase(fetchUnassignedUsers.rejected, (state, action) => {
        state.unassignedUsersLoading = false;
        state.unassignedUsersError = action.payload;
      });
  }
});

export const { 
  toggleUserSelection, 
  selectAllUsers, 
  clearSelectedUsers,
  setBulkEditMode
} = usersSlice.actions;

export default usersSlice.reducer;
