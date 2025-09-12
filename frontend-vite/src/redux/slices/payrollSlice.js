import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import payrollService from '../../services/payrollService';

// Async thunks
export const fetchPayrollData = createAsyncThunk(
  'payroll/fetchPayrollData',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await payrollService.getPayrollData(month, year);
      return response;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll data');
    }
  }
);

export const fetchPayrollSummary = createAsyncThunk(
  'payroll/fetchPayrollSummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await payrollService.getPayrollSummary(month, year);
      return response;
    } catch (error) {
      console.error('Error fetching payroll summary:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll summary');
    }
  }
);

export const runPayrollCalculation = createAsyncThunk(
  'payroll/runPayrollCalculation',
  async ({ month, year, forceRecalculate }, { rejectWithValue }) => {
    try {
      const response = await payrollService.runPayroll(month, year, forceRecalculate);
      return response;
    } catch (error) {
      console.error('Error running payroll calculation:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to run payroll calculation');
    }
  }
);

export const updatePayrollStatus = createAsyncThunk(
  'payroll/updatePayrollStatus',
  async ({ payrollId, status }, { rejectWithValue }) => {
    try {
      const response = await payrollService.updatePayrollStatus(payrollId, status);
      return { id: payrollId, status, data: response };
    } catch (error) {
      console.error('Error updating payroll status:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update payroll status');
    }
  }
);

export const fetchPayrollById = createAsyncThunk(
  'payroll/fetchPayrollById',
  async (payrollId, { rejectWithValue }) => {
    try {
      const response = await payrollService.getPayrollById(payrollId);
      return response;
    } catch (error) {
      console.error('Error fetching payroll by ID:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll details');
    }
  }
);

const initialState = {
  payrollData: [],
  payrollSummary: null,
  currentPayroll: null,
  loading: false,
  calculating: false,
  error: null,
  recordCount: 0,
  recordsExist: false
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPayroll: (state, action) => {
      state.currentPayroll = action.payload;
    },
    clearCurrentPayroll: (state) => {
      state.currentPayroll = null;
    },
    resetRecordsExist: (state) => {
      state.recordsExist = false;
      state.recordCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch payroll data
      .addCase(fetchPayrollData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollData.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollData = action.payload;
      })
      .addCase(fetchPayrollData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch payroll data';
      })
      
      // Fetch payroll summary
      .addCase(fetchPayrollSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollSummary = action.payload;
      })
      .addCase(fetchPayrollSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch payroll summary';
      })
      
      // Run payroll calculation
      .addCase(runPayrollCalculation.pending, (state) => {
        state.calculating = true;
        state.error = null;
      })
      .addCase(runPayrollCalculation.fulfilled, (state, action) => {
        state.calculating = false;
        if (action.payload.recordsExist) {
          state.recordsExist = true;
          state.recordCount = action.payload.recordCount || 0;
        }
      })
      .addCase(runPayrollCalculation.rejected, (state, action) => {
        state.calculating = false;
        state.error = action.payload || 'Failed to run payroll calculation';
      })
      
      // Update payroll status
      .addCase(updatePayrollStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayrollStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the status in the payroll data array
        const index = state.payrollData.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.payrollData[index].status = action.payload.status;
        }
        // Update current payroll if it's the same one
        if (state.currentPayroll && state.currentPayroll.id === action.payload.id) {
          state.currentPayroll.status = action.payload.status;
        }
      })
      .addCase(updatePayrollStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update payroll status';
      })
      
      // Fetch payroll by ID
      .addCase(fetchPayrollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayroll = action.payload;
      })
      .addCase(fetchPayrollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch payroll details';
      });
  }
});

export const { clearError, setCurrentPayroll, clearCurrentPayroll, resetRecordsExist } = payrollSlice.actions;

export default payrollSlice.reducer;
