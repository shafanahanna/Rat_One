import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('Admintoken');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Get all custom roles
const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/roles`, getAuthHeader());
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return empty array instead of throwing error
    return [];
  }
};

// Get role by ID
const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/api/roles/${roleId}`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching role with ID ${roleId}:`, error);
    // Return null instead of throwing error
    return null;
  }
};

// Create a new role
const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/api/roles`, roleData, getAuthHeader());
    
    // Update local storage with new role
    updateLocalStorageRoles(response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Update an existing role
const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/api/roles/${roleId}`, roleData, getAuthHeader());
    
    // Update local storage with updated role
    updateLocalStorageRoles(response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error(`Error updating role with ID ${roleId}:`, error);
    throw error;
  }
};

// Delete a role
const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/roles/${roleId}`, getAuthHeader());
    
    // Remove role from local storage
    removeRoleFromLocalStorage(roleId);
    
    return response.data;
  } catch (error) {
    console.error(`Error deleting role with ID ${roleId}:`, error);
    throw error;
  }
};

// Helper function to update custom roles in localStorage
const updateLocalStorageRoles = (roleData) => {
  try {
    // Get existing custom roles from localStorage
    const customRolesStr = localStorage.getItem('customRoles');
    let customRoles = customRolesStr ? JSON.parse(customRolesStr) : {};
    
    // Update or add the role
    customRoles[roleData.name] = roleData.permissions;
    
    // Save back to localStorage
    localStorage.setItem('customRoles', JSON.stringify(customRoles));
  } catch (error) {
    console.error('Error updating custom roles in localStorage:', error);
  }
};

// Helper function to remove a role from localStorage
const removeRoleFromLocalStorage = (roleId) => {
  try {
    // First get the role to know its name
    getRoleById(roleId).then(roleData => {
      if (roleData && roleData.name) {
        // Get existing custom roles from localStorage
        const customRolesStr = localStorage.getItem('customRoles');
        let customRoles = customRolesStr ? JSON.parse(customRolesStr) : {};
        
        // Remove the role
        delete customRoles[roleData.name];
        
        // Save back to localStorage
        localStorage.setItem('customRoles', JSON.stringify(customRoles));
      } else {
        // If role data is null, try to clean up localStorage anyway
        try {
          const customRolesStr = localStorage.getItem('customRoles');
          if (customRolesStr) {
            localStorage.setItem('customRoles', customRolesStr); // Just re-save as is
          }
        } catch (e) {
          console.error('Error cleaning up localStorage:', e);
        }
      }
    });
  } catch (error) {
    console.error('Error removing custom role from localStorage:', error);
  }
};

// Sync all roles with localStorage
const syncRolesWithLocalStorage = async () => {
  try {
    const roles = await getAllRoles();
    
    // Create a new object to store roles
    const customRoles = {};
    
    // Add each role to the object
    roles.forEach(role => {
      if (role.name && role.permissions) {
        customRoles[role.name] = role.permissions;
      }
    });
    
    // Save to localStorage
    localStorage.setItem('customRoles', JSON.stringify(customRoles));
    
    return customRoles;
  } catch (error) {
    console.error('Error syncing roles with localStorage:', error);
    throw error;
  }
};

const roleService = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  syncRolesWithLocalStorage
};

export default roleService;
