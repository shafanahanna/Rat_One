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
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Fade,
  Avatar
} from '@mui/material';
import { 
  Search, 
  Edit, 
  Delete, 
  Plus, 
  RefreshCw, 
  Save, 
  Shield, 
  MoreVertical, 
  Info,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PERMISSION_UI } from '../../constants/permissions';

const Designations = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  
  // Role modal state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roleFormData, setRoleFormData] = useState({
    id: '',
    name: '',
    description: '',
    permissions: []
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    permissions: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Available permissions state
  const [availablePermissions, setAvailablePermissions] = useState(PERMISSION_UI);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);
  
  const fetchPermissions = async () => {
    setLoadingPermissions(true);
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        // Transform API response to match our UI format
        const apiPermissions = response.data.data;
        const formattedPermissions = apiPermissions.map(perm => ({
          id: perm.id,
          label: perm.description || perm.name,
          description: `${perm.module}: ${perm.description}`
        }));
        
        setAvailablePermissions(formattedPermissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      // Fallback to default permissions if API fails
      setAvailablePermissions(PERMISSION_UI);
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    if (roles.length > 0) {
      const filtered = roles.filter(role => 
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm, roles]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        setRoles(response.data.data);
        setFilteredRoles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
      setError('Failed to fetch designations. Please try again later.');
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

  // Role form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData({
      ...roleFormData,
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

  const handlePermissionChange = (permission) => {
    const currentPermissions = [...roleFormData.permissions];
    
    if (currentPermissions.includes(permission)) {
      // Remove permission if already selected
      setRoleFormData({
        ...roleFormData,
        permissions: currentPermissions.filter(p => p !== permission)
      });
    } else {
      // Add permission if not selected
      setRoleFormData({
        ...roleFormData,
        permissions: [...currentPermissions, permission]
      });
    }
    
    // Clear permission error if any
    if (formErrors.permissions) {
      setFormErrors({
        ...formErrors,
        permissions: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate name
    if (!roleFormData.name.trim()) {
      newErrors.name = 'Designation name is required';
      valid = false;
    }
    
    // Trim any trailing spaces from the role name
    // This prevents issues with the backend expecting exact role names
    if (roleFormData.name) {
      roleFormData.name = roleFormData.name.trim();
    }
    
    // Validate permissions
    if (roleFormData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleAddRole = () => {
    setIsEditMode(false);
    setRoleFormData({
      id: '',
      name: '',
      description: '',
      permissions: []
    });
    setFormErrors({
      name: '',
      permissions: ''
    });
    setFormSuccess(false);
    setRoleModalOpen(true);
  };

  const handleEditRole = async (roleId) => {
    setFormLoading(true);
    setIsEditMode(true);
    setFormSuccess(false);
    
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        const roleData = response.data.data;
        setRoleFormData({
          id: roleData.id,
          name: roleData.name,
          description: roleData.description || '',
          permissions: roleData.permissions || []
        });
      }
      setRoleModalOpen(true);
    } catch (error) {
      console.error('Error fetching designation details:', error);
      setError('Failed to fetch designation details. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRoleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setFormSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Ensure role name is properly trimmed
    const formData = {
      ...roleFormData,
      name: roleFormData.name.trim()
    };
    
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('Admintoken');
      
      if (isEditMode) {
        await axios.put(
          `${API_URL}/api/roles/${formData.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update role in the list
        setRoles(roles.map(role => 
          role.id === formData.id ? { ...role, ...formData } : role
        ));
      } else {
        const response = await axios.post(
          `${API_URL}/api/roles`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Add new role to the list
        if (response.data && response.data.data) {
          setRoles([...roles, response.data.data]);
        }
      }
      
      setFormSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setRoleModalOpen(false);
        fetchRoles(); // Refresh the list to get updated data
      }, 1500);
      
    } catch (error) {
      console.error('Error saving designation:', error);
      setError(error.response?.data?.message || 'Failed to save designation. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.delete(`${API_URL}/api/roles/${roleToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove role from state
      setRoles(roles.filter(role => role.id !== roleToDelete.id));
      setFilteredRoles(filteredRoles.filter(role => role.id !== roleToDelete.id));
    } catch (error) {
      console.error('Error deleting designation:', error);
      setError('Failed to delete designation. Please try again later.');
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleCloseRoleModal = () => {
    setRoleModalOpen(false);
  };

  const handleMenuOpen = (event, roleId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRoleId(roleId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRoleId(null);
  };

  const handleMenuEdit = () => {
    handleEditRole(selectedRoleId);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    const roleToDelete = roles.find(role => role.id === selectedRoleId);
    if (roleToDelete) {
      setRoleToDelete(roleToDelete);
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
              Designation Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                placeholder="Search designations..."
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
                startIcon={<Plus size={16} />}
                onClick={handleAddRole}
              >
                Create Designation
              </Button>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={fetchRoles} 
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
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
                      Designation Name
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 500, 
                        color: '#5f6368', 
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                      }}
                    >
                      Permissions
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
                  {filteredRoles.length > 0 ? (
                    filteredRoles
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((role) => (
                        <TableRow 
                          key={role.id} 
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
                                {role.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography sx={{ color: '#202124', fontWeight: 500 }}>
                                {role.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#5f6368' }}>
                            {role.description || '—'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {role.permissions && role.permissions.length > 0 ? (
                                role.permissions.map(permission => (
                                  <Chip 
                                    key={permission}
                                    label={availablePermissions.find(p => p.id === permission)?.label || permission} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: '#e8f0fe', 
                                      color: '#1a73e8',
                                      borderRadius: '16px',
                                      '& .MuiChip-label': { px: 1.5 },
                                      fontSize: '0.75rem',
                                      height: '24px'
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography variant="body2" sx={{ color: '#80868b', fontStyle: 'italic' }}>
                                  No permissions
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="More actions">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleMenuOpen(e, role.id)}
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
                            No designations found
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#80868b' }}>
                            Create a new designation to get started
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
              count={filteredRoles.length}
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
          Delete designation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#5f6368' }}>
            Are you sure you want to delete the designation "{roleToDelete?.name}"? This action cannot be undone.
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

      {/* Role Add/Edit Modal */}
      <Dialog
        open={roleModalOpen}
        onClose={handleCloseRoleModal}
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
          {isEditMode ? 'Edit Designation' : 'Create Designation'}
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
              Designation {isEditMode ? 'updated' : 'created'} successfully!
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

          <form onSubmit={handleRoleFormSubmit}>
            <TextField
              label="Designation Name"
              id="name"
              name="name"
              value={roleFormData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sales Manager, Team Lead, etc."
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
              label="Description (Optional)"
              id="description"
              name="description"
              value={roleFormData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this designation"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  '& fieldset': { borderColor: '#dadce0' },
                  '&:hover fieldset': { borderColor: '#bdc1c6' },
                  '&.Mui-focused fieldset': { borderColor: '#1a73e8' }
                },
                '& .MuiFormLabel-root': {
                  color: '#5f6368',
                  '&.Mui-focused': { color: '#1a73e8' }
                }
              }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: '#202124', fontWeight: 500, mb: 1 }}>
                Permissions
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  borderColor: formErrors.permissions ? '#d93025' : '#dadce0',
                  borderRadius: '4px'
                }}
              >
                {loadingPermissions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} sx={{ color: '#1a73e8' }} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                    {availablePermissions.map((permission) => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={roleFormData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            sx={{
                              color: '#5f6368',
                              '&.Mui-checked': { color: '#1a73e8' }
                            }}
                          />
                        }
                        label={
                          <Tooltip title={permission.description || ''} placement="top">
                            <Typography sx={{ color: '#5f6368', fontSize: '0.875rem' }}>
                              {permission.label}
                            </Typography>
                          </Tooltip>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Paper>
              
              {formErrors.permissions && (
                <Typography variant="caption" sx={{ color: '#d93025', display: 'block', mt: 0.5, ml: 0 }}>
                  {formErrors.permissions}
                </Typography>
              )}
            </Box>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseRoleModal} 
            sx={{ 
              color: '#5f6368', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#f1f3f4' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRoleFormSubmit}
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

export default Designations;
