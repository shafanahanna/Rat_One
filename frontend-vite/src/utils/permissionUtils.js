import axios from 'axios';

/**
 * Cache for storing role permissions to avoid repeated API calls
 */
const rolePermissionsCache = new Map();

/**
 * Fetch role permissions from the API
 * @param {string} roleId - The role ID to fetch permissions for
 * @returns {Promise<string[]>} - Array of permission IDs
 */
export const fetchRolePermissions = async (roleId) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('Admintoken');
    
    const response = await axios.get(`${API_URL}/role-permissions/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data && response.data.success && response.data.data) {
      const permissions = response.data.data.permissions || [];
      // Cache the permissions for this role
      rolePermissionsCache.set(roleId, permissions);
      return permissions;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
};

/**
 * Check if a user has a specific permission
 * @param {string} roleName - The user's role name
 * @param {string} permission - The permission to check
 * @returns {Promise<boolean>} - True if the user has the permission
 */
export const hasPermission = async (roleName, permission) => {
  // Admin and Director roles have all permissions
  if (roleName === 'Admin' || roleName === 'Director') {
    return true;
  }
  
  try {
    // Get all roles
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('Admintoken');
    
    // First, try to get the role ID for this role name
    const rolesResponse = await axios.get(`${API_URL}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!rolesResponse.data || !rolesResponse.data.success || !rolesResponse.data.data) {
      return false;
    }
    
    const roles = rolesResponse.data.data;
    const role = roles.find(r => r.name === roleName);
    
    if (!role) {
      return false;
    }
    
    // Check if we have cached permissions for this role
    if (rolePermissionsCache.has(role.id)) {
      const permissions = rolePermissionsCache.get(role.id);
      return permissions.includes('admin') || permissions.includes(permission);
    }
    
    // If not cached, fetch the permissions
    const permissions = await fetchRolePermissions(role.id);
    return permissions.includes('admin') || permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} roleName - The user's role name
 * @param {string[]} permissions - The permissions to check
 * @returns {Promise<boolean>} - True if the user has any of the permissions
 */
export const hasAnyPermission = async (roleName, permissions) => {
  // Admin and Director roles have all permissions
  if (roleName === 'Admin' || roleName === 'Director') {
    return true;
  }
  
  for (const permission of permissions) {
    if (await hasPermission(roleName, permission)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Clear the permissions cache
 */
export const clearPermissionsCache = () => {
  rolePermissionsCache.clear();
};
