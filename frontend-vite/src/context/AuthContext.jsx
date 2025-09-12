import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('Admintoken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      try {
        const storedToken = localStorage.getItem('Admintoken');
        const storedRole = localStorage.getItem('role');
        const storedUserId = localStorage.getItem('userId');
        
        console.log("AuthContext - Stored Role:", storedRole);
        
        if (storedToken) {
          setToken(storedToken);
          setCurrentUser({
            id: storedUserId,
            role: storedRole
          });
        }
      } catch (err) {
        console.error('Authentication error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password_hash: password
      });
      
      if (response.data.token) {
        localStorage.setItem('Admintoken', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.id);
        
        setToken(response.data.token);
        setCurrentUser({
          id: response.data.id,
          role: response.data.role
        });
        
        return { success: true };
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', userData);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed',
        validationErrors: err.response?.data?.errors
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user has a specific role
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    return currentUser.role === requiredRole;
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Role-based permissions mapping
    const rolePermissions = {
      Director: ['dashboard', 'leads', 'quotes', 'users', 'settings'],
      DM: ['dashboard', 'leads', 'marketing'],
      HR: ['hr', 'employees', 'attendance', 'payroll'],
      BA: ['dashboard', 'leads', 'quotes', 'holiday'],
      Marketing: ['dashboard', 'leads', 'campaigns']
    };
    
    // Get permissions for the user's role
    const userPermissions = rolePermissions[currentUser.role] || [];
    
    // Check if the requested permission is in the user's permissions
    return userPermissions.includes(permission);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    userRole: currentUser?.role,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// We're not exporting AuthContext as default anymore
// This helps with Fast Refresh compatibility
