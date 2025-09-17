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
  Plus, 
  RefreshCw, 
  Save, 
  Info,
  MoreVertical,
  CheckCircle,
  Building
} from 'lucide-react';
import axios from 'axios';

const Departments = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  
  // Department modal state
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departmentFormData, setDepartmentFormData] = useState({
    id: '',
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    if (departments.length > 0) {
      const filtered = departments.filter(department => 
        department.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        department.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        setDepartments(response.data.data);
        setFilteredDepartments(response.data.data);
      } else {
        setDepartments([]);
        setFilteredDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments. Please try again later.');
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

  // Department form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentFormData({
      ...departmentFormData,
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
    if (!departmentFormData.name.trim()) {
      newErrors.name = 'Department name is required';
      valid = false;
    }
    
    // Trim any trailing spaces from the department name
    if (departmentFormData.name) {
      departmentFormData.name = departmentFormData.name.trim();
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleAddDepartment = () => {
    setIsEditMode(false);
    setDepartmentFormData({
      id: '',
      name: '',
      description: ''
    });
    setFormErrors({
      name: ''
    });
    setFormSuccess(false);
    setDepartmentModalOpen(true);
  };

  const handleEditDepartment = async (departmentId) => {
    setFormLoading(true);
    setIsEditMode(true);
    setFormSuccess(false);
    
    try {
      const token = localStorage.getItem('Admintoken');
      const response = await axios.get(`${API_URL}/api/departments/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        const departmentData = response.data.data;
        setDepartmentFormData({
          id: departmentData.id,
          name: departmentData.name,
          description: departmentData.description || ''
        });
      }
      setDepartmentModalOpen(true);
    } catch (error) {
      console.error('Error fetching department details:', error);
      setError(error.response?.data?.message || 'Failed to fetch department details. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDepartmentFormSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setFormSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Ensure department name is properly trimmed
    const formData = {
      ...departmentFormData,
      name: departmentFormData.name.trim()
    };
    
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('Admintoken');
      
      if (isEditMode) {
        // Update existing department
        await axios.put(
          `${API_URL}/api/departments/${formData.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new department
        await axios.post(
          `${API_URL}/api/departments`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setFormSuccess(true);
      
      // Close modal after a short delay and refresh the departments list
      setTimeout(() => {
        setDepartmentModalOpen(false);
        fetchDepartments(); // Refresh the list to get updated data
      }, 1500);
      
    } catch (error) {
      console.error('Error saving department:', error);
      setError(error.response?.data?.message || 'Failed to save department. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;
    
    try {
      const token = localStorage.getItem('Admintoken');
      await axios.delete(`${API_URL}/api/departments/${departmentToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the departments list
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      setError(error.response?.data?.message || 'Failed to delete department. Please try again later.');
    } finally {
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDepartmentToDelete(null);
  };

  const handleCloseDepartmentModal = () => {
    setDepartmentModalOpen(false);
  };

  const handleMenuOpen = (event, departmentId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDepartmentId(departmentId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDepartmentId(null);
  };

  const handleMenuEdit = () => {
    handleEditDepartment(selectedDepartmentId);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    const departmentToDelete = departments.find(dept => dept.id === selectedDepartmentId);
    if (departmentToDelete) {
      setDepartmentToDelete(departmentToDelete);
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
              Department Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                placeholder="Search departments..."
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
                onClick={handleAddDepartment}
              >
                Create Department
              </Button>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={fetchDepartments} 
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
                      Department Name
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
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((department) => (
                        <TableRow 
                          key={department.id} 
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
                                <Building size={16} />
                              </Avatar>
                              <Typography sx={{ color: '#202124', fontWeight: 500 }}>
                                {department.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#5f6368' }}>
                            {department.description || '—'}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="More actions">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleMenuOpen(e, department.id)}
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
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Info size={40} color="#80868b" />
                          <Typography sx={{ color: '#5f6368', mt: 1 }}>
                            No departments found
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#80868b' }}>
                            Create a new department to get started
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
              count={filteredDepartments.length}
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
          Delete department
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#5f6368' }}>
            Are you sure you want to delete the department "{departmentToDelete?.name}"? This action cannot be undone.
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

      {/* Department Add/Edit Modal */}
      <Dialog
        open={departmentModalOpen}
        onClose={handleCloseDepartmentModal}
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
          {isEditMode ? 'Edit Department' : 'Create Department'}
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
              Department {isEditMode ? 'updated' : 'created'} successfully!
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

          <form onSubmit={handleDepartmentFormSubmit}>
            <TextField
              label="Department Name"
              id="name"
              name="name"
              value={departmentFormData.name}
              onChange={handleInputChange}
              placeholder="e.g., Human Resources, Finance, etc."
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
              value={departmentFormData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this department"
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

            {/* No parent department field needed */}
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDepartmentModal} 
            sx={{ 
              color: '#5f6368', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#f1f3f4' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDepartmentFormSubmit}
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

export default Departments;
