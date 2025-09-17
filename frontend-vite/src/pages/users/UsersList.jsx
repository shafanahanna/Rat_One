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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Tooltip,
  Menu,
  MenuItem,
  Fade,
  Avatar
} from '@mui/material';
import { 
  Search, 
  Edit, 
  Delete, 
  UserPlus, 
  RefreshCw, 
  Save, 
  MoreVertical, 
  Info,
  CheckCircle,
  User
} from 'lucide-react';
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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const handleMenuOpen = (event, userId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleMenuEdit = () => {
    handleEditUser(selectedUserId);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    const userToDelete = users.find(user => user.id === selectedUserId);
    if (userToDelete) {
      setUserToDelete(userToDelete);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card elevation={0} sx={{ mb: 3, borderRadius: '16px', overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 500, 
                color: '#202124',
                fontSize: '1.5rem',
                mb: { xs: 2, md: 0 }
              }}
            >
              User Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ 
                  width: { sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    '& fieldset': { borderColor: '#dadce0' },
                    '&:hover fieldset': { borderColor: '#bdc1c6' },
                    '&.Mui-focused fieldset': { borderColor: '#1a73e8' }
                  }
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#5f6368" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: '#1a73e8', 
                  borderRadius: '24px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1765cc', boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3)' }
                }}
                startIcon={<UserPlus size={16} />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={fetchUsers} 
                  sx={{ 
                    bgcolor: '#f1f3f4', 
                    borderRadius: '50%',
                    '&:hover': { bgcolor: '#e8eaed' }
                  }}
                >
                  <RefreshCw size={18} color="#5f6368" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: '8px',
                '& .MuiAlert-icon': { color: '#d93025' }
              }}
            >
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid #dadce0' 
        }}
      >
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
                    <TableCell 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Designation
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow 
                          key={user.id} 
                          hover
                          sx={{ 
                            '&:hover': { bgcolor: '#f8f9fa' },
                            '& td': { borderBottom: '1px solid #e0e0e0', py: 2 }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: '#e8f0fe', 
                                  color: '#1a73e8',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  mr: 1.5
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography sx={{ color: '#202124', fontWeight: 500 }}>
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#5f6368' }}>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              size="small" 
                              sx={{ 
                                bgcolor: 
                                  user.role === 'Admin' || user.role === 'Director' ? '#e8f0fe' : 
                                  user.role === 'HR' ? '#fce8e6' :
                                  '#e6f4ea',
                                color: 
                                  user.role === 'Admin' || user.role === 'Director' ? '#1a73e8' : 
                                  user.role === 'HR' ? '#d93025' :
                                  '#1e8e3e',
                                borderRadius: '16px',
                                '& .MuiChip-label': { px: 1.5 },
                                fontSize: '0.75rem',
                                height: '24px'
                              }}
                            />
                          </TableCell>
                          
                          <TableCell align="right">
                            <Tooltip title="More actions">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleMenuOpen(e, user.id)}
                                sx={{ 
                                  color: '#5f6368',
                                  '&:hover': { bgcolor: '#f1f3f4' }
                                }}
                              >
                                <MoreVertical size={18} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Info size={40} color="#80868b" />
                          <Typography sx={{ color: '#5f6368', mt: 1 }}>
                            No users found
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#80868b' }}>
                            Add a new user to get started
                          </Typography>
                        </Box>
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
              sx={{
                borderTop: '1px solid #e0e0e0',
                '.MuiTablePagination-select': {
                  borderRadius: '4px',
                  '&:focus': { bgcolor: '#f1f3f4' }
                },
                '.MuiTablePagination-selectIcon': { color: '#5f6368' },
                '.MuiTablePagination-displayedRows': { color: '#5f6368' },
                '.MuiTablePagination-actions': {
                  '& .MuiIconButton-root': {
                    color: '#5f6368',
                    '&:hover': { bgcolor: '#f1f3f4' },
                    '&.Mui-disabled': { color: '#dadce0' }
                  }
                }
              }}
            />
          </>
        )}
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        elevation={2}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(60,64,67,.3)',
            mt: 0.5
          },
          '& .MuiMenuItem-root': {
            fontSize: '0.875rem',
            py: 1,
            px: 2,
            '&:hover': { bgcolor: '#f1f3f4' }
          }
        }}
      >
        <MenuItem onClick={handleMenuEdit}>
          <Edit size={16} style={{ marginRight: 8, color: '#5f6368' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} sx={{ color: '#d93025' }}>
          <Delete size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 24px 38px 3px rgba(60,64,67,0.14), 0 9px 46px 8px rgba(60,64,67,0.12), 0 11px 15px -7px rgba(60,64,67,0.2)',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 500, color: '#202124' }}>
          Delete user
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#5f6368' }}>
            Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={{ 
              color: '#5f6368', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#f1f3f4' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            sx={{ 
              bgcolor: '#d93025', 
              color: 'white',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#c5221f', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Add/Edit Modal */}
      <Dialog
        open={userModalOpen}
        onClose={handleCloseUserModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 24px 38px 3px rgba(60,64,67,0.14), 0 9px 46px 8px rgba(60,64,67,0.12), 0 11px 15px -7px rgba(60,64,67,0.2)',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 500, color: '#202124' }}>
          {isEditMode ? 'Edit User' : 'Create User'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {formSuccess && (
            <Alert 
              severity="success" 
              icon={<CheckCircle size={20} />}
              sx={{ 
                mb: 2, 
                borderRadius: '8px',
                bgcolor: '#e6f4ea',
                color: '#1e8e3e',
                '& .MuiAlert-icon': { color: '#1e8e3e' }
              }}
            >
              User {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                borderRadius: '8px',
                '& .MuiAlert-icon': { color: '#d93025' }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleUserFormSubmit}>
            <TextField
              label="Full Name"
              id="name"
              name="name"
              value={userFormData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              fullWidth
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: formErrors.name ? '#d93025' : '#dadce0' },
                  '&:hover fieldset': { borderColor: formErrors.name ? '#d93025' : '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: formErrors.name ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: formErrors.name ? '#d93025' : '#5f6368',
                  '&.Mui-focused': { color: formErrors.name ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormHelperText-root': {
                  color: '#d93025',
                  marginLeft: 0
                }
              }}
            />

            <TextField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={userFormData.email}
              onChange={handleInputChange}
              placeholder="user@example.com"
              fullWidth
              margin="normal"
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: formErrors.email ? '#d93025' : '#dadce0' },
                  '&:hover fieldset': { borderColor: formErrors.email ? '#d93025' : '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: formErrors.email ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: formErrors.email ? '#d93025' : '#5f6368',
                  '&.Mui-focused': { color: formErrors.email ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormHelperText-root': {
                  color: '#d93025',
                  marginLeft: 0
                }
              }}
            />

            <TextField
              label={`Password ${isEditMode ? '(Leave blank to keep current)' : ''}`}
              id="password"
              name="password"
              type="password"
              value={userFormData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              fullWidth
              margin="normal"
              required={!isEditMode}
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: formErrors.password ? '#d93025' : '#dadce0' },
                  '&:hover fieldset': { borderColor: formErrors.password ? '#d93025' : '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: formErrors.password ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: formErrors.password ? '#d93025' : '#5f6368',
                  '&.Mui-focused': { color: formErrors.password ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormHelperText-root': {
                  color: '#d93025',
                  marginLeft: 0
                }
              }}
            />

            <TextField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={userFormData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              fullWidth
              margin="normal"
              required={!isEditMode}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: formErrors.confirmPassword ? '#d93025' : '#dadce0' },
                  '&:hover fieldset': { borderColor: formErrors.confirmPassword ? '#d93025' : '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: formErrors.confirmPassword ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: formErrors.confirmPassword ? '#d93025' : '#5f6368',
                  '&.Mui-focused': { color: formErrors.confirmPassword ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormHelperText-root': {
                  color: '#d93025',
                  marginLeft: 0
                }
              }}
            />

            <TextField
              select
              label="Designation"
              id="role"
              name="role"
              value={userFormData.role}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!formErrors.role}
              helperText={formErrors.role || (loadingRoles ? 'Loading custom roles...' : '')}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: formErrors.role ? '#d93025' : '#dadce0' },
                  '&:hover fieldset': { borderColor: formErrors.role ? '#d93025' : '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: formErrors.role ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: formErrors.role ? '#d93025' : '#5f6368',
                  '&.Mui-focused': { color: formErrors.role ? '#d93025' : '#1a73e8' }
                },
                '& .MuiFormHelperText-root': {
                  color: formErrors.role ? '#d93025' : (loadingRoles ? '#1a73e8' : '#5f6368'),
                  marginLeft: 0
                }
              }}
            >
              <MenuItem value="" disabled>
                Select a designation
              </MenuItem>
              {/* Legacy roles */}
              <MenuItem value="Admin" sx={{ color: '#1a73e8', fontWeight: 500 }}>
                Admin
              </MenuItem>
              <MenuItem value="HR" sx={{ color: '#d93025', fontWeight: 500 }}>
                HR
              </MenuItem>
              {/* Custom roles */}
              {customRoles.map(role => (
                <MenuItem 
                  key={role.id} 
                  value={role.name} 
                  sx={{ 
                    color: '#202124',
                    '&:hover': { bgcolor: '#f8f9fa' }
                  }}
                >
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseUserModal} 
            sx={{ 
              color: '#5f6368', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#f1f3f4' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUserFormSubmit}
            disabled={formLoading}
            variant="contained"
            sx={{ 
              bgcolor: '#1a73e8', 
              color: 'white',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1765cc', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)' },
              '&.Mui-disabled': { bgcolor: '#dadce0', color: '#5f6368' }
            }}
            startIcon={formLoading ? (
              <CircularProgress size={16} sx={{ color: 'white' }} />
            ) : (
              <Save size={16} />
            )}
          >
            {formLoading ? 
              (isEditMode ? 'Updating...' : 'Creating...') : 
              (isEditMode ? 'Update' : 'Create')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersList;
