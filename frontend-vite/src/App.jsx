import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import UsersList from './pages/users/UsersList';
import AddUser from './pages/users/AddUser';
import RolesPermissions from './pages/users/RolesPermissions';
import CustomRoles from './pages/users/CustomRoles';
import DirectorSettings from './pages/settings/DirectorSettings';
import Layout from './components/Layout';
import './App.css';
import HRDashboard from './pages/HolidayManagement/HRDashboard';
import EmployeeList from './pages/HolidayManagement/EmployeeList';
import AddEmployee from './pages/HolidayManagement/EmployeeForm';
import EmployeeDetails from './pages/HolidayManagement/EmployeeDetail';
import Payroll from './pages/HolidayManagement/payroll';
import PayrollForm from './pages/HolidayManagement/PayrollForm';
import Attendance from './pages/HolidayManagement/Attendance';
import EditEmployee from './pages/HolidayManagement/EditEmployee';
import ProfilePage from './pages/Profile/ProfilePage';
import LeaveManagement from './pages/HolidayManagement/LeaveManagement';
import LeaveBalanceManagement from './pages/HolidayManagement/Components/LeaveBalanceManagement';
import LeaveConfiguration from './pages/HolidayManagement/LeaveConfiguration';

// HR Module imports


// Simple Protected Route component
const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage directly
  const isAuthenticated = !!localStorage.getItem('Admintoken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Simple Role Protected Route component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  // Check if token exists in localStorage directly
  const isAuthenticated = !!localStorage.getItem('Admintoken');
  const userRole = localStorage.getItem('role');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Simple role check
  const hasAllowedRole = allowedRoles.some(role => 
    role.toLowerCase() === (userRole || '').toLowerCase()
  );
  
  if (hasAllowedRole) {
    return <Layout>{children}</Layout>;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  // Simple authentication check
  const isAuthenticated = !!localStorage.getItem('Admintoken');
  
  return (
    <Router >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* User Management Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users/new" 
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users/edit/:id" 
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users/roles" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <RolesPermissions />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/users/custom-roles" 
            element={
              <RoleProtectedRoute allowedRoles={['Director']}>
                <CustomRoles />
              </RoleProtectedRoute>
            } 
          />
          
          {/* Director Settings Routes */}
          <Route 
            path="/settings/director" 
            element={
              <RoleProtectedRoute allowedRoles={['Director', 'director', 'TC']}>
                <DirectorSettings />
              </RoleProtectedRoute>
            } 
          />
          
          {/* HR Module Routes */}
          <Route 
            path="/hr" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <HRDashboard />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/hr/employees" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <EmployeeList />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/hr/employees" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <EmployeeList />
              </RoleProtectedRoute>
            } 
          />



          
          <Route 
            path="/hr/leave-balance" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <LeaveBalanceManagement />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/hr/leave" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <LeaveManagement />
              </RoleProtectedRoute>
            } 
          />

<Route 
            path="/hr/leave-configuration" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <LeaveConfiguration />
              </RoleProtectedRoute>
            } 
          />
          
         
          
          <Route 
            path="/hr/add-employee" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC',"DM"]}>
                <AddEmployee />
              </RoleProtectedRoute>
            } 
          />
          
          <Route 
            path="/hr/employees/:id" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC','DM' ]}>
                <EmployeeDetails />
              </RoleProtectedRoute>
            } 
          />


<Route 
            path="/hr/payroll" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC','DM']}>
                <Payroll />
              </RoleProtectedRoute>
            } 
          />

          <Route 
            path="/hr/attendance" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director', 'TC','DM']}>
                <Attendance />
              </RoleProtectedRoute>
            } 
          />


<Route 
            path="/hr/edit-employee/:id" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director']}>
                <EditEmployee />
              </RoleProtectedRoute>
            } 
          />

<Route 
            path="/profile" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director','TC','DM']}>
                <ProfilePage />
              </RoleProtectedRoute>
            } 
          />

          <Route 
            path="/hr/payroll/:id" 
            element={
              <RoleProtectedRoute allowedRoles={['HR', 'Director','TC','DM']}>
                <PayrollForm />
              </RoleProtectedRoute>
            } 
          />


          



          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route 
            path="/" 
            element={
              isAuthenticated 
                ? <Navigate to="/dashboard" replace /> 
                : <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </Router>
  );
}

export default App;
