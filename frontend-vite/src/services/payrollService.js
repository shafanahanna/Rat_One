import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const payrollService = {
  // Get payroll data with optional month and year filters
  getPayrollData: async (month, year) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/hr/payroll`, {
        params: { month, year },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      throw error;
    }
  },

  // Get payroll summary with optional month and year filters
  getPayrollSummary: async (month, year) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/hr/payroll/summary`, {
        params: { month, year },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll summary:', error);
      throw error;
    }
  },

  // Run or recalculate payroll for a specific month and year
  runPayroll: async (month, year, forceRecalculate = false) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(`${API_URL}/hr/payroll/recalculate`, 
        { month, year, forceRecalculate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error running payroll:', error);
      throw error;
    }
  },

  // Update payroll status (e.g., mark as paid)
  updatePayrollStatus: async (payrollId, status) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.patch(`${API_URL}/hr/payroll/${payrollId}/status`, 
        { payment_status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating payroll status for ${payrollId}:`, error);
      throw error;
    }
  },

  // Get a single payroll record by ID
  getPayrollById: async (payrollId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/hr/payroll/${payrollId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll ${payrollId}:`, error);
      throw error;
    }
  }
};

export default payrollService;
