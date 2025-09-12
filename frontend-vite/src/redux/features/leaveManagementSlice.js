import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';

// Async thunks for leave management
export const fetchLeaveTypes = createAsyncThunk(
  'leaveManagement/fetchLeaveTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.getLeaveTypes();
      // Return the response directly as the service already returns response.data
      return response;
    } catch (error) {
      console.error('Error in fetchLeaveTypes thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave types');
    }
  }
);

export const fetchLeaveApplications = createAsyncThunk(
  'leaveManagement/fetchLeaveApplications',
  async (isAdmin, { rejectWithValue }) => {
    try {
      let response;
      if (isAdmin) {
        response = await leaveService.getAllLeaveApplications();
      } else {
        const userId = localStorage.getItem('userId');
        response = await leaveService.getUserLeaveApplications(userId);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave applications');
    }
  }
);

export const fetchLeaveBalances = createAsyncThunk(
  'leaveManagement/fetchLeaveBalances',
  async ({ isAdmin, userId }, { rejectWithValue }) => {
    try {
      let response;
      if (isAdmin) {
        response = await leaveService.getAllLeaveBalances();
      } else {
        const employeeResponse = await leaveService.getEmployeeByUserId(userId);
        if (employeeResponse.data && employeeResponse.data.id) {
          response = await leaveService.getLeaveBalances(employeeResponse.data.id);
        } else {
          throw new Error('Employee not found');
        }
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave balances');
    }
  }
);

export const createLeaveApplication = createAsyncThunk(
  'leaveManagement/createLeaveApplication',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await leaveService.createLeaveApplication(leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create leave application');
    }
  }
);

export const approveLeaveApplication = createAsyncThunk(
  'leaveManagement/approveLeaveApplication',
  async (approvalData, { rejectWithValue }) => {
    try {
      const response = await leaveService.approveLeaveApplication(approvalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process leave approval');
    }
  }
);

// Initial state
const initialState = {
  leaveTypes: {
    data: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  leaveApplications: {
    data: [],
    status: 'idle',
    error: null
  },
  leaveBalances: {
    data: [],
    status: 'idle',
    error: null
  },
  createLeaveStatus: {
    status: 'idle',
    error: null
  },
  approveLeaveStatus: {
    status: 'idle',
    error: null
  }
};

// Create slice
const leaveManagementSlice = createSlice({
  name: 'leaveManagement',
  initialState,
  reducers: {
    resetCreateLeaveStatus: (state) => {
      state.createLeaveStatus = { status: 'idle', error: null };
    },
    resetApproveLeaveStatus: (state) => {
      state.approveLeaveStatus = { status: 'idle', error: null };
    }
  },
  extraReducers: (builder) => {
    // Handle fetchLeaveTypes
    builder
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.leaveTypes.status = 'loading';
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.leaveTypes.status = 'succeeded';
        state.leaveTypes.data = action.payload;
        state.leaveTypes.error = null;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.leaveTypes.status = 'failed';
        state.leaveTypes.error = action.payload;
      });

    // Handle fetchLeaveApplications
    builder
      .addCase(fetchLeaveApplications.pending, (state) => {
        state.leaveApplications.status = 'loading';
      })
      .addCase(fetchLeaveApplications.fulfilled, (state, action) => {
        state.leaveApplications.status = 'succeeded';
        state.leaveApplications.data = action.payload;
        state.leaveApplications.error = null;
      })
      .addCase(fetchLeaveApplications.rejected, (state, action) => {
        state.leaveApplications.status = 'failed';
        state.leaveApplications.error = action.payload;
      });

    // Handle fetchLeaveBalances
    builder
      .addCase(fetchLeaveBalances.pending, (state) => {
        state.leaveBalances.status = 'loading';
      })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.leaveBalances.status = 'succeeded';
        state.leaveBalances.data = action.payload;
        state.leaveBalances.error = null;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.leaveBalances.status = 'failed';
        state.leaveBalances.error = action.payload;
      });

    // Handle createLeaveApplication
    builder
      .addCase(createLeaveApplication.pending, (state) => {
        state.createLeaveStatus.status = 'loading';
      })
      .addCase(createLeaveApplication.fulfilled, (state) => {
        state.createLeaveStatus.status = 'succeeded';
        state.createLeaveStatus.error = null;
      })
      .addCase(createLeaveApplication.rejected, (state, action) => {
        state.createLeaveStatus.status = 'failed';
        state.createLeaveStatus.error = action.payload;
      });

    // Handle approveLeaveApplication
    builder
      .addCase(approveLeaveApplication.pending, (state) => {
        state.approveLeaveStatus.status = 'loading';
      })
      .addCase(approveLeaveApplication.fulfilled, (state) => {
        state.approveLeaveStatus.status = 'succeeded';
        state.approveLeaveStatus.error = null;
      })
      .addCase(approveLeaveApplication.rejected, (state, action) => {
        state.approveLeaveStatus.status = 'failed';
        state.approveLeaveStatus.error = action.payload;
      });
  }
});

export const { resetCreateLeaveStatus, resetApproveLeaveStatus } = leaveManagementSlice.actions;

export default leaveManagementSlice.reducer;
