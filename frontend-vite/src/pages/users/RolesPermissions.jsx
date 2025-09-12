import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { Plus, Edit, Trash2, Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RolesPermissions = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Roles state
  const [roles, setRoles] = useState([]);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ name: '', description: '', isDefault: false });
  const [isEditingRole, setIsEditingRole] = useState(false);
  
  // Permissions state
  const [permissions, setPermissions] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [rolePermissions, setRolePermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [savingPermissions, setSavingPermissions] = useState(false);
  
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('Admintoken');
      
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Mock roles data
      const mockRoles = [
        { id: 1, name: 'Admin', description: 'Full system access', isDefault: false },
        { id: 2, name: 'Manager', description: 'Department management access', isDefault: false },
        { id: 3, name: 'User', description: 'Standard user access', isDefault: true },
        { id: 4, name: 'Guest', description: 'Limited read-only access', isDefault: false }
      ];
      
      // Mock permissions data
      const mockPermissions = [
        { id: 1, name: 'users.view', description: 'View users', module: 'Users' },
        { id: 2, name: 'users.create', description: 'Create users', module: 'Users' },
        { id: 3, name: 'users.edit', description: 'Edit users', module: 'Users' },
        { id: 4, name: 'users.delete', description: 'Delete users', module: 'Users' },
        { id: 5, name: 'roles.view', description: 'View roles', module: 'Roles' },
        { id: 6, name: 'roles.create', description: 'Create roles', module: 'Roles' },
        { id: 7, name: 'roles.edit', description: 'Edit roles', module: 'Roles' },
        { id: 8, name: 'roles.delete', description: 'Delete roles', module: 'Roles' },
        { id: 9, name: 'dashboard.view', description: 'View dashboard', module: 'Dashboard' },
        { id: 10, name: 'reports.view', description: 'View reports', module: 'Reports' },
        { id: 11, name: 'reports.create', description: 'Create reports', module: 'Reports' },
        { id: 12, name: 'settings.view', description: 'View settings', module: 'Settings' },
        { id: 13, name: 'settings.edit', description: 'Edit settings', module: 'Settings' }
      ];
      
      // Mock role permissions
      const mockRolePermissions = {
        1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // Admin has all permissions
        2: [1, 3, 5, 9, 10, 11, 12], // Manager permissions
        3: [1, 9, 10], // User permissions
        4: [9] // Guest permissions
      };
      
      setRoles(mockRoles);
      setPermissions(mockPermissions);
      
      // Group permissions by module
      const permsByModule = mockPermissions.reduce((acc, perm) => {
        if (!acc[perm.module]) {
          acc[perm.module] = [];
        }
        acc[perm.module].push(perm);
        return acc;
      }, {});
      
      setPermissionsByModule(permsByModule);
      setRolePermissions(mockRolePermissions);
      setSelectedRole(mockRoles[0]); // Select first role by default
      
    } catch (error) {
      console.error('Error fetching roles and permissions:', error);
      setError('Failed to load roles and permissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Role management functions
  const openRoleDialog = (role = null) => {
    if (role) {
      setCurrentRole({ ...role });
      setIsEditingRole(true);
    } else {
      setCurrentRole({ name: '', description: '', isDefault: false });
      setIsEditingRole(false);
    }
    setRoleDialogOpen(true);
  };

  const handleRoleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setCurrentRole({
      ...currentRole,
      [name]: name === 'isDefault' ? checked : value
    });
  };

  const handleRoleSubmit = async () => {
    try {
      if (isEditingRole) {
        // Update existing role
        const updatedRoles = roles.map(role => 
          role.id === currentRole.id ? { ...currentRole } : role
        );
        setRoles(updatedRoles);
        setSuccess('Role updated successfully');
      } else {
        // Create new role
        const newRole = {
          ...currentRole,
          id: Math.max(...roles.map(r => r.id), 0) + 1
        };
        setRoles([...roles, newRole]);
        setRolePermissions({
          ...rolePermissions,
          [newRole.id]: [] // Initialize with no permissions
        });
        setSuccess('Role created successfully');
      }
      
      setRoleDialogOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving role:', error);
      setError('Failed to save role. Please try again.');
    }
  };

  const handleDeleteRole = (roleId) => {
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        // Remove role from state
        const updatedRoles = roles.filter(role => role.id !== roleId);
        setRoles(updatedRoles);
        
        // Remove role permissions
        const { [roleId]: _, ...updatedRolePermissions } = rolePermissions;
        setRolePermissions(updatedRolePermissions);
        
        // If the deleted role was selected, select the first available role
        if (selectedRole && selectedRole.id === roleId) {
          setSelectedRole(updatedRoles[0] || null);
        }
        
        setSuccess('Role deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error('Error deleting role:', error);
        setError('Failed to delete role. Please try again.');
      }
    }
  };

  // Permission management functions
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handlePermissionToggle = (permissionId) => {
    if (!selectedRole) return;
    
    const roleId = selectedRole.id;
    const currentPermissions = rolePermissions[roleId] || [];
    
    let updatedPermissions;
    if (currentPermissions.includes(permissionId)) {
      // Remove permission
      updatedPermissions = currentPermissions.filter(id => id !== permissionId);
    } else {
      // Add permission
      updatedPermissions = [...currentPermissions, permissionId];
    }
    
    setRolePermissions({
      ...rolePermissions,
      [roleId]: updatedPermissions
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    
    setSavingPermissions(true);
    try {
      // In a real application, you would save this to your API
      // For now, we'll just simulate a successful save
      
      setSuccess('Permissions saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving permissions:', error);
      setError('Failed to save permissions. Please try again.');
    } finally {
      setSavingPermissions(false);
    }
  };

  const isPermissionChecked = (permissionId) => {
    if (!selectedRole) return false;
    const roleId = selectedRole.id;
    return (rolePermissions[roleId] || []).includes(permissionId);
  };

  return (
    <Container maxWidth="xl" className="py-6">
      <Box className="mb-6">
        <Breadcrumbs aria-label="breadcrumb" className="mb-2">
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/users');
            }}
            className="hover:underline"
          >
            User Management
          </Link>
          <Typography color="text.primary">Roles & Permissions</Typography>
        </Breadcrumbs>
        
        <Box className="flex justify-between items-center">
          <Typography variant="h5" component="h1" className="font-bold text-gray-800">
            Roles & Permissions
          </Typography>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/users')}
          >
            Back to Users
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}
      
      <Paper className="shadow-sm">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="roles and permissions tabs">
            <Tab label="Roles" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Permissions" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Roles Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box className="flex justify-end mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Plus size={18} />}
                  onClick={() => openRoleDialog()}
                >
                  Add Role
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Default</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id} hover>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          {role.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openRoleDialog(role)}
                          >
                            <Edit size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.isDefault} // Prevent deleting default role
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            
            {/* Permissions Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Role selection sidebar */}
                <Box className="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="subtitle1" className="font-bold mb-3">
                    Select Role
                  </Typography>
                  
                  <Box className="flex flex-col gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.id}
                        variant={selectedRole?.id === role.id ? "contained" : "outlined"}
                        color={selectedRole?.id === role.id ? "primary" : "inherit"}
                        className="justify-start"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
                
                {/* Permissions grid */}
                <Box className="md:col-span-3">
                  {selectedRole ? (
                    <>
                      <Box className="flex justify-between items-center mb-4">
                        <Typography variant="h6">
                          Permissions for {selectedRole.name}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={savingPermissions ? <CircularProgress size={20} color="inherit" /> : <Save size={18} />}
                          onClick={handleSavePermissions}
                          disabled={savingPermissions}
                        >
                          {savingPermissions ? 'Saving...' : 'Save Permissions'}
                        </Button>
                      </Box>
                      
                      {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                        <Box key={module} className="mb-6">
                          <Typography variant="subtitle1" className="font-bold mb-2">
                            {module}
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Permission</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell align="center">Granted</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {modulePermissions.map((permission) => (
                                  <TableRow key={permission.id} hover>
                                    <TableCell>{permission.name}</TableCell>
                                    <TableCell>{permission.description}</TableCell>
                                    <TableCell align="center">
                                      <Checkbox
                                        checked={isPermissionChecked(permission.id)}
                                        onChange={() => handlePermissionToggle(permission.id)}
                                        color="primary"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Box className="flex justify-center items-center p-8">
                      <Typography variant="body1" color="textSecondary">
                        Select a role to manage permissions
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>
          </>
        )}
      </Paper>
      
      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 pt-2">
            <TextField
              label="Role Name"
              name="name"
              value={currentRole.name}
              onChange={handleRoleInputChange}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              name="description"
              value={currentRole.description}
              onChange={handleRoleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={currentRole.isDefault}
                  onChange={handleRoleInputChange}
                  name="isDefault"
                  color="primary"
                />
              }
              label="Set as default role"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRoleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!currentRole.name}
          >
            {isEditingRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RolesPermissions;
