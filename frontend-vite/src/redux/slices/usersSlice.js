import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("Admintoken");
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
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
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
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return { assignments: [], unassigned_count: 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch assignment stats");
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
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user branch");
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
      
      if (response.data && response.data.data) {
        return { userIds, branchId, updatedUsers: response.data.data };
      }
      return { userIds, branchId, updatedUsers: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to bulk update user branches");
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
      // The backend returns { data: [...users] } directly
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching unassigned users:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch unassigned users");
    }
  }
);

const initialState = {
  users: [],
  loading: false,
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
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
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
      state.selectedUsers = state.users.map(user => user.id);
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    setBulkEditMode: (state, action) => {
      state.bulkEditMode = action.payload;
      if (!action.payload) {
        state.selectedUsers = [];
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users with context
      .addCase(fetchUsersWithContext.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithContext.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersWithContext.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch assignment stats
      .addCase(fetchAssignmentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentStats = action.payload;
      })
      .addCase(fetchAssignmentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user branch
      .addCase(updateUserBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.users.findIndex(user => user.id === action.payload.id);
          if (index !== -1) {
            state.users[index] = {
              ...state.users[index],
              ...action.payload
            };
          }
        }
      })
      .addCase(updateUserBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Bulk update user branches
      .addCase(bulkUpdateUserBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateUserBranch.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update users in the state with the returned updated users
        if (action.payload.updatedUsers && action.payload.updatedUsers.length > 0) {
          action.payload.updatedUsers.forEach(updatedUser => {
            const index = state.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
              state.users[index] = {
                ...state.users[index],
                ...updatedUser
              };
            }
          });
        } else {
          // If no updated users returned, update based on the userIds and branchId
          action.payload.userIds.forEach(userId => {
            const index = state.users.findIndex(user => user.id === userId);
            if (index !== -1) {
              state.users[index].branch_id = action.payload.branchId;
            }
          });
        }
        
        // Clear selection after bulk update
        state.selectedUsers = [];
        state.bulkEditMode = false;
      })
      .addCase(bulkUpdateUserBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
  setBulkEditMode,
  clearError
} = usersSlice.actions;

export default usersSlice.reducer;
