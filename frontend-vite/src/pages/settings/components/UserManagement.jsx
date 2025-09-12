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
  DialogActions
} from '@mui/material';
import { Search, Edit, Delete, UserPlus, RefreshCw } from 'lucide-react';
import userService from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const UserManagement = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h5" component="h2" className="font-bold text-gray-800">
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
                    <TableCell>Role</TableCell>
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
                                'default'
                              }
                              variant={user.role === 'DM' || user.role === 'TC' || user.role === 'BA' || user.role === 'RT' || user.role === 'AC' ? 'outlined' : 'filled'}
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
                      <TableCell colSpan={4} align="center" className="py-8">
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
    </div>
  );
};

export default UserManagement;
