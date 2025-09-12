import axios from 'axios';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get a single user by ID
  getUserById: async (userId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.post(`${API_URL}/api/api/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (userId, userData) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.put(`${API_URL}/api/api/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.delete(`${API_URL}/api/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }
};

export default userService;
