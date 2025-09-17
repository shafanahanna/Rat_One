import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees as fetchEmployeesThunk, deleteEmployee as deleteEmployeeThunk, updateSalaryStatus as updateSalaryStatusThunk } from '../../redux/slices/employeeSlice';
import { 
  Container, 
  Typography, 
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
  Avatar,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  RefreshCw, 
  MoreVertical, 
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Users,
  Briefcase,
  Filter,
  Plus
} from 'lucide-react';
import { useIsMobile } from "../../hooks/useIsMobile";

const EmployeeList = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  
  // Redux hooks
  const dispatch = useDispatch();
  const { employees, loading, departments, presentToday } = useSelector(state => state.employees);
  
  const isMobile = useIsMobile();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Use Redux thunk to fetch employees
  const fetchEmployees = () => {
    dispatch(fetchEmployeesThunk());
  };

  useEffect(() => {
    console.log('EmployeeList component - Dispatching fetchEmployeesThunk');
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);
  
  // Log when employees data changes
  useEffect(() => {
    console.log('EmployeeList component - Employees data updated:', employees);
  }, [employees]);
  
  // Filter employees based on department and search term
  const filteredEmployees = employees.filter(employee => {
    const matchesDepartment = selectedDepartment ? employee.department === selectedDepartment : true;
    const matchesSearch = searchTerm
      ? employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.emp_code?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDepartment && matchesSearch;
  });

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
  
  const handleMenuOpen = (event, employeeId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEmployeeId(null);
  };
  
  const handleMenuEdit = () => {
    handleEditEmployee(selectedEmployeeId);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    const employee = employees.find(employee => employee.id === selectedEmployeeId);
    if (employee) {
      setEmployeeToDelete(employee);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };
  
  const handleMenuView = () => {
    handleViewEmployee(selectedEmployeeId);
    handleMenuClose();
  };
  
  const handleAddEmployee = () => {
    navigate("/hr/add-employee");
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/hr/edit-employee/${employeeId}`);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/hr/employee/${employeeId}`);
  };

  const handleUpdateSalaryStatus = (employeeId, status) => {
    dispatch(updateSalaryStatusThunk({ id: employeeId, status }));
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!employeeToDelete) return;
    
    dispatch(deleteEmployeeThunk(employeeToDelete.id));
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const SalaryStatus = ({ employee }) => {
    const isMobile = useIsMobile();
    const statusMap = {
      Pending: { 
        icon: Clock, 
        bgColor: '#fff8e1', 
        textColor: '#ff8f00', 
        label: 'Pending' 
      },
      Approved: {
        icon: CheckCircle,
        bgColor: '#e6f4ea',
        textColor: '#1e8e3e',
        label: 'Approved',
      },
      Rejected: { 
        icon: XCircle, 
        bgColor: '#fce8e6', 
        textColor: '#d93025', 
        label: 'Rejected' 
      },
    };

    const currentStatus = statusMap[employee.salary_status] || {
      icon: null,
      bgColor: '#f1f3f4',
      textColor: '#5f6368',
      label: 'Approved'
    };
    
    const Icon = currentStatus.icon;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          size="small"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {Icon && <Icon size={14} />}
              {currentStatus.label}
            </Box>
          }
          sx={{
            bgcolor: currentStatus.bgColor,
            color: currentStatus.textColor,
            fontWeight: 500,
            fontSize: '0.75rem',
            height: '24px',
            borderRadius: '16px',
            '& .MuiChip-label': { px: 1.5 }
          }}
        />
        
        {!isMobile && employee.salary_status === 'Pending' && (
          <Typography variant="caption" sx={{ color: '#5f6368' }}>
            Proposed: ₹{employee.proposed_salary}
          </Typography>
        )}
        
        {userRole === 'Director' && employee.salary_status === 'Pending' && (
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleUpdateSalaryStatus(employee.id, 'Approved')}
              sx={{ 
                p: 0.5, 
                bgcolor: '#e6f4ea', 
                color: '#1e8e3e',
                '&:hover': { bgcolor: '#ceead6' }
              }}
              title="Approve"
            >
              <CheckCircle size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleUpdateSalaryStatus(employee.id, 'Rejected')}
              sx={{ 
                p: 0.5, 
                bgcolor: '#fce8e6', 
                color: '#d93025',
                '&:hover': { bgcolor: '#f6cbc7' }
              }}
              title="Reject"
            >
              <XCircle size={16} />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  const EmployeeRow = ({ employee }) => {
    return (
      <TableRow 
        hover
        sx={{ 
          '&:hover': { bgcolor: '#f8f9fa' },
          '& td': { borderBottom: '1px solid #e0e0e0', py: 2 }
        }}
      >
        <TableCell>
          <Typography sx={{ color: '#202124', fontWeight: 500 }}>
            {employee.empCode || `EMP-${employee.id?.substring(0, 6)}`}
          </Typography>
        </TableCell>
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
              {employee.fullName ? employee.fullName.substring(0, 1).toUpperCase() : ''}
            </Avatar>
            <Typography sx={{ color: '#202124', fontWeight: 500 }}>
              {employee.fullName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: '#5f6368' }}>
          {employee.user?.email}
        </TableCell>
        <TableCell>
          <Chip 
            label={employee.designation} 
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
        </TableCell>
        <TableCell sx={{ color: '#5f6368' }}>
          {employee.department}
        </TableCell>
        <TableCell>
          <SalaryStatus employee={employee} />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="More actions">
            <IconButton 
              size="small"
              onClick={(e) => handleMenuOpen(e, employee.id)}
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
    );
  };
  
  const MobileEmployeeCard = ({ employee }) => {
    // Format employee code or use a fallback
    const employeeCode = employee.empCode || `EMP-${employee.id?.substring(0, 6)}`;
    
    return (
      <Card 
        elevation={0} 
        sx={{ 
          mb: 2, 
          borderRadius: '12px', 
          border: '1px solid #dadce0',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: '#e8f0fe', 
                  color: '#1a73e8',
                  fontSize: '1rem',
                  fontWeight: 500,
                  mr: 1.5
                }}
              >
                {employee.fullName ? employee.fullName.substring(0, 2).toUpperCase() : "NA"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#202124' }}>
                  {employee.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5f6368', mb: 1 }}>
                  {employee.user?.email}
                </Typography>
                <Chip 
                  label={employee.designation} 
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
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={() => handleViewEmployee(employee.id)}
                sx={{ 
                  bgcolor: '#e8f0fe',
                  color: '#1a73e8',
                  '&:hover': { bgcolor: '#d4e6fc' }
                }}
                size="small"
              >
                <Eye size={16} />
              </IconButton>
              <IconButton
                onClick={(e) => handleMenuOpen(e, employee.id)}
                sx={{ 
                  bgcolor: '#e8f0fe',
                  color: '#1a73e8',
                  '&:hover': { bgcolor: '#d4e6fc' }
                }}
                size="small"
              >
                <MoreVertical size={16} />
              </IconButton>
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 2, 
              mt: 2,
              pt: 2,
              borderTop: '1px solid #f1f3f4'
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Department
              </Typography>
              <Typography sx={{ fontWeight: 500, color: '#202124', mt: 0.5 }}>
                {employee.department}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ID
              </Typography>
              <Typography sx={{ fontWeight: 500, color: '#202124', mt: 0.5 }}>
                {employeeCode}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <Typography variant="caption" sx={{ color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Salary Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <SalaryStatus employee={employee} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
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
              Employee Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                placeholder="Search employees..."
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
              <FormControl sx={{ width: { xs: '100%', sm: '200px' } }}>
                <Select
                  displayEmpty
                  size="small"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  sx={{ 
                    borderRadius: '24px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dadce0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bdc1c6' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a73e8' }
                  }}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                onClick={handleAddEmployee}
              >
                Add Employee
              </Button>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={fetchEmployees} 
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

          {/* Statistics Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mt: 3 }}>
            <Card elevation={0} sx={{ p: 2, border: '1px solid #dadce0', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', mr: 2 }}>
                  <Users size={20} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>Total Employees</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202124' }}>{employees.length}</Typography>
                </Box>
              </Box>
            </Card>

            <Card elevation={0} sx={{ p: 2, border: '1px solid #dadce0', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', mr: 2 }}>
                  <CheckCircle size={20} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>Present Today</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202124' }}>{presentToday}</Typography>
                </Box>
              </Box>
            </Card>

            <Card elevation={0} sx={{ p: 2, border: '1px solid #dadce0', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', mr: 2 }}>
                  <Briefcase size={20} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>Departments</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202124' }}>{departments.length}</Typography>
                </Box>
              </Box>
            </Card>

            <Card elevation={0} sx={{ p: 2, border: '1px solid #dadce0', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', mr: 2 }}>
                  <Filter size={20} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>Filtered Results</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202124' }}>{filteredEmployees.length}</Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* Employee List Content */}
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
            {isMobile ? (
              // Mobile View
              <Box sx={{ p: 2 }}>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <MobileEmployeeCard
                        key={employee.id}
                        employee={employee}
                      />
                    ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Info size={40} color="#80868b" />
                    <Typography sx={{ color: '#5f6368', mt: 1 }}>
                      No employees found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#80868b' }}>
                      {searchTerm || selectedDepartment ? "Try adjusting your filters" : "Add your first employee to get started"}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ position: 'fixed', bottom: { xs: '80px', lg: '40px' }, right: '24px', zIndex: 50 }}>
                  <Tooltip title="Add Employee">
                    <IconButton
                      onClick={handleAddEmployee}
                      sx={{ 
                        bgcolor: '#1a73e8', 
                        color: 'white',
                        width: 56,
                        height: 56,
                        boxShadow: '0 2px 10px rgba(60,64,67,.3)',
                        '&:hover': { bgcolor: '#1765cc' }
                      }}
                    >
                      <UserPlus size={24} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              // Desktop View
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
                          Employee ID
                        </TableCell>
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
                          sx={{ 
                            fontWeight: 500, 
                            color: '#5f6368', 
                            borderBottom: '1px solid #e0e0e0',
                            py: 2
                          }}
                        >
                          Department
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            fontWeight: 500, 
                            color: '#5f6368', 
                            borderBottom: '1px solid #e0e0e0',
                            py: 2
                          }}
                        >
                          Status
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
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((employee) => (
                            <EmployeeRow
                              key={employee.id}
                              employee={employee}
                            />
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <Info size={40} color="#80868b" />
                              <Typography sx={{ color: '#5f6368', mt: 1 }}>
                                No employees found
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#80868b' }}>
                                {searchTerm || selectedDepartment ? "Try adjusting your filters" : "Add your first employee to get started"}
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
                  count={filteredEmployees.length}
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
        <MenuItem onClick={handleMenuView}>
          <Eye size={16} style={{ marginRight: 8, color: '#5f6368' }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuEdit}>
          <Edit size={16} style={{ marginRight: 8, color: '#5f6368' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuDelete} sx={{ color: '#d93025' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
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
          Delete employee
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#5f6368' }}>
            Are you sure you want to delete the employee "{employeeToDelete?.fullName}"? This action cannot be undone.
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
    </Container>
  );
};

export default EmployeeList;
