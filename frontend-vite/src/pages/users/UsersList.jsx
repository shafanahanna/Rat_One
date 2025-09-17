import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Search, Edit, Delete, UserPlus, RefreshCw, Save } from 'lucide-react';
import userService from '../../services/userService';
import roleService from '../../services/roleService';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customRoles, setCustomRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // User modal state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userFormData, setUserFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
   
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCustomRoles();
  }, []);
  
  const fetchCustomRoles = async () => {
    setLoadingRoles(true);
    try {
      const roles = await roleService.getAllRoles();
      setCustomRoles(roles);
    } catch (error) {
      console.error('Error fetching custom roles:', error);
      // Set empty array instead of showing error to user
      setCustomRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // User form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate name
    if (!userFormData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userFormData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(userFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Validate password (only for new users)
    if (!isEditMode) {
      if (!userFormData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (userFormData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
      
      // Validate confirm password
      if (userFormData.password !== userFormData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    } else if (userFormData.password && userFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else if (userFormData.password !== userFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Validate role
    if (!userFormData.role) {
      newErrors.role = 'Role is required';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = async (userId) => {
    setFormLoading(true);
    setIsEditMode(true);
    setFormSuccess(false);
    
    try {
      const userData = await userService.getUserById(userId);
      setUserFormData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: '',
        confirmPassword: '',
        role: userData.role,
       
      });
      setUserModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setFormSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setFormLoading(true);
    
    try {
      const { confirmPassword, ...userData } = userFormData;
      
      if (isEditMode) {
        // If password is empty, remove it from the request
        if (!userData.password) {
          delete userData.password;
        }
        await userService.updateUser(userData.id, userData);
        
        // Update user in the list
        setUsers(users.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        ));
      } else {
        const newUser = await userService.createUser(userData);
        
        // Add new user to the list
        setUsers([...users, newUser]);
      }
      
      setFormSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setUserModalOpen(false);
        fetchUsers(); // Refresh the list to get updated data
      }, 1500);
      
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'Failed to save user. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.id);
      
      // Remove user from state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete.id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
  };

  return (
    <Container maxWidth="xl" className="py-6">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h5" component="h1" className="font-bold text-gray-800">
          User Management
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            className="sm:w-64"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<UserPlus size={18} />}
            onClick={handleAddUser}
            className="whitespace-nowrap"
          >
            Add User
          </Button>
          <IconButton onClick={fetchUsers} color="default" className="ml-1">
            <RefreshCw size={20} />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Paper className="shadow-sm">
        {loading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Designation</TableCell>
                   
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              size="small" 
                              color={
                                user.role === 'Director' ? 'primary' : 
                                user.role === 'HR' ? 'secondary' : 
                                customRoles.some(role => role.name === user.role) ? 'success' :
                                'default'
                              }
                              variant={user.role === 'DM' || user.role === 'TC' || user.role === 'BA' || user.role === 'RT' || user.role === 'AC' ? 'outlined' : 
                                      customRoles.some(role => role.name === user.role) ? 'outlined' : 'filled'}
                            />
                          </TableCell>
                          
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Edit size={18} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Delete size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="py-8">
                        <Typography variant="body1" color="textSecondary">
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Add/Edit Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h3>
            </div>

            {formSuccess && (
              <div className="px-6 pt-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  User {isEditMode ? 'updated' : 'created'} successfully!
                </div>
              </div>
            )}

            {error && (
              <div className="px-6 pt-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleUserFormSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userFormData.name}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                  placeholder="Full Name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                  placeholder="user@example.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password {isEditMode && <span className="font-normal text-xs">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userFormData.password}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                  placeholder="••••••••"
                  required={!isEditMode}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userFormData.confirmPassword}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                  placeholder="••••••••"
                  required={!isEditMode}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="role"
                >
                  Designation
                </label>
                <select
                  id="role"
                  name="role"
                  value={userFormData.role}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                >
                  <option value="">Select a designation</option>
                  <optgroup label="System Designations">
                    <option value="Director">Admin</option>
                    
                  </optgroup>
                  
                  {customRoles.length > 0 && (
                    <optgroup label="Custom Designations">
                      {customRoles.map(role => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                {loadingRoles && (
                  <p className="text-blue-500 text-xs mt-1">
                    Loading custom roles...
                  </p>
                )}
                {formErrors.role && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.role}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleCloseUserModal}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#47BCCB] hover:bg-[#3da7b4] text-white font-semibold py-2 px-4 rounded-md shadow-sm flex items-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    isEditMode ? "Update User" : "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UsersList;
