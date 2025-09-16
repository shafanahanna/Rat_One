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
  Checkbox
} from '@mui/material';
import { Search, Edit, Delete, Plus, RefreshCw, Save, Shield } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomRoles = () => {
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

  // Available permissions
  const availablePermissions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leads', label: 'Leads Management' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'users', label: 'User Management' },
    { id: 'settings', label: 'Settings' },
    { id: 'hr', label: 'HR Access' },
    { id: 'employees', label: 'Employee Management' },
    { id: 'attendance', label: 'Attendance Management' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'holiday', label: 'Holiday Management' },
    { id: 'campaigns', label: 'Campaigns' }
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

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
      console.error('Error fetching roles:', error);
      setError('Failed to fetch roles. Please try again later.');
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
      newErrors.name = 'Role name is required';
      valid = false;
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
      console.error('Error fetching role details:', error);
      setError('Failed to fetch role details. Please try again later.');
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
    
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('Admintoken');
      
      if (isEditMode) {
        await axios.put(
          `${API_URL}/api/roles/${roleFormData.id}`,
          roleFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update role in the list
        setRoles(roles.map(role => 
          role.id === roleFormData.id ? { ...role, ...roleFormData } : role
        ));
      } else {
        const response = await axios.post(
          `${API_URL}/api/roles`,
          roleFormData,
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
      console.error('Error saving role:', error);
      setError(error.response?.data?.message || 'Failed to save role. Please try again.');
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
      console.error('Error deleting role:', error);
      setError('Failed to delete role. Please try again later.');
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

  return (
    <Container maxWidth="xl" className="py-6">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h5" component="h1" className="font-bold text-gray-800">
          Custom Role Management
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <TextField
            placeholder="Search roles..."
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
            startIcon={<Plus size={18} />}
            onClick={handleAddRole}
            className="whitespace-nowrap"
          >
            Create Role
          </Button>
          <IconButton onClick={fetchRoles} color="default" className="ml-1">
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
                    <TableCell>Role Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((role) => (
                        <TableRow key={role.id} hover>
                          <TableCell>
                            <div className="flex items-center">
                              <Shield size={16} className="mr-2 text-blue-600" />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell>{role.description || '-'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {role.permissions && role.permissions.map(permission => (
                                <Chip 
                                  key={permission}
                                  label={availablePermissions.find(p => p.id === permission)?.label || permission} 
                                  size="small" 
                                  color="primary"
                                  variant="outlined"
                                  className="mr-1 mb-1"
                                />
                              ))}
                              {(!role.permissions || role.permissions.length === 0) && (
                                <span className="text-gray-500 text-sm italic">No permissions</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditRole(role.id)}
                            >
                              <Edit size={18} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(role)}
                            >
                              <Delete size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" className="py-8">
                        <Typography variant="body1" color="textSecondary">
                          No custom roles found
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
              count={filteredRoles.length}
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
            Are you sure you want to delete the role "{roleToDelete?.name}"? This action cannot be undone.
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

      {/* Role Add/Edit Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? 'Edit Role' : 'Create Custom Role'}
              </h3>
            </div>

            {formSuccess && (
              <div className="px-6 pt-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  Role {isEditMode ? 'updated' : 'created'} successfully!
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

            <form onSubmit={handleRoleFormSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Role Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={roleFormData.name}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]`}
                  placeholder="e.g., Sales Manager"
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
                  htmlFor="description"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={roleFormData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#47BCCB]"
                  placeholder="Brief description of this role"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Permissions
                </label>
                <div className="mt-2 border border-gray-300 rounded p-3 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={roleFormData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            color="primary"
                          />
                        }
                        label={permission.label}
                      />
                    ))}
                  </div>
                </div>
                {formErrors.permissions && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.permissions}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={handleCloseRoleModal}
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
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-1" />
                      {isEditMode ? "Update Role" : "Create Role"}
                    </>
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

export default CustomRoles;
