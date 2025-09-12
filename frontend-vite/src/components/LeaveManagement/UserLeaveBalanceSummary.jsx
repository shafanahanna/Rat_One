// import { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Grid, 
//   Card, 
//   CardContent, 
//   CardHeader,
//   LinearProgress,
//   Divider,
//   Skeleton,
//   Alert
// } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';

// const UserLeaveBalanceSummary = () => {
//   const [leaveBalances, setLeaveBalances] = useState([]);
//   const [pendingApplications, setPendingApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const auth = useAuth();
//   const currentYear = new Date().getFullYear();
  
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // First get the employee ID from the user ID
//         const token = localStorage.getItem('Admintoken');
//         const userId = auth?.currentUser?.id;
        
//         if (!userId || !token) {
//           setError('Authentication required');
//           setLoading(false);
//           return;
//         }
        
//         // Get employee ID from user ID
//         const employeeResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/employees/by-user/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         const employeeId = employeeResponse.data?.data?.id;
        
//         if (!employeeId) {
//           setError('Employee record not found');
//           setLoading(false);
//           return;
//         }
        
//         // Get leave balances for the employee
//         const balanceResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/leave-balances/employee/${employeeId}?year=${currentYear}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         // Get pending leave applications using the direct endpoint
//         const applicationsResponse = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/leave-applications/employee/${employeeId}?status=pending`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (balanceResponse.data?.data) {
//           setLeaveBalances(balanceResponse.data.data);
//         } else {
//           setLeaveBalances([]);
//         }
        
//         if (applicationsResponse.data?.data) {
//           setPendingApplications(applicationsResponse.data.data);
//         } else {
//           setPendingApplications([]);
//         }
//       } catch (err) {
//         console.error('Failed to fetch leave data:', err);
//         setError('Failed to load leave balances');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchUserData();
//   }, [auth?.currentUser?.id]);
  
//   // Calculate pending days for each leave type
//   const calculatePendingDays = (leaveTypeId) => {
//     if (!pendingApplications || pendingApplications.length === 0) return 0;
    
//     // Filter applications for this leave type and sum the days
//     return pendingApplications
//       .filter(app => app.leave_type_id === leaveTypeId && app.status === 'pending')
//       .reduce((total, app) => {
//         // Calculate days between start and end date
//         const startDate = new Date(app.start_date);
//         const endDate = new Date(app.end_date);
//         const diffTime = Math.abs(endDate - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        
//         return total + diffDays;
//       }, 0);
//   };
  
//   if (loading) {
//     return (
//       <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>Leave Balances</Typography>
//         <Divider sx={{ mb: 2 }} />
//         <Grid container spacing={2}>
//           {[1, 2, 3].map((item) => (
//             <Grid item xs={12} md={4} key={item}>
//               <Skeleton variant="rectangular" height={120} />
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>
//     );
//   }
  
//   if (error) {
//     return (
//       <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>Leave Balances</Typography>
//         <Divider sx={{ mb: 2 }} />
//         <Alert severity="error">{error}</Alert>
//       </Paper>
//     );
//   }
  
//   return (
//     <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
//       <Typography variant="h6" gutterBottom>Leave Balances ({currentYear})</Typography>
//       <Divider sx={{ mb: 2 }} />
      
//       {leaveBalances.length === 0 ? (
//         <Alert severity="info">No leave balances found for the current year</Alert>
//       ) : (
//         <Grid container spacing={2}>
//           {leaveBalances.map((balance) => {
//             const allocated = balance.allocated_days || 0;
//             const used = balance.used_days || 0;
//             const pending = calculatePendingDays(balance.leave_type_id) || 0;
//             const remaining = allocated - used - pending;
//             const progress = allocated > 0 ? (used / allocated) * 100 : 0;
            
//             // Get color from leave type or use default
//             const leaveColor = balance.leave_type?.color || '#1976d2';
            
//             return (
//               <Grid item xs={12} md={4} key={balance.id}>
//                 <Card sx={{ 
//                   height: '100%',
//                   borderTop: `4px solid ${leaveColor}`
//                 }}>
//                   <CardHeader
//                     title={balance.leave_type?.name || 'Unknown Leave Type'}
//                     titleTypographyProps={{ variant: 'subtitle1' }}
//                     sx={{ pb: 0 }}
//                   />
//                   <CardContent>
//                     <Box sx={{ mb: 2 }}>
//                       <LinearProgress 
//                         variant="determinate" 
//                         value={progress} 
//                         sx={{ 
//                           height: 8, 
//                           borderRadius: 5,
//                           backgroundColor: 'rgba(0,0,0,0.1)',
//                           '& .MuiLinearProgress-bar': {
//                             backgroundColor: leaveColor
//                           }
//                         }} 
//                       />
//                     </Box>
                    
//                     <Grid container spacing={1}>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary">
//                           Allocated
//                         </Typography>
//                         <Typography variant="body1" fontWeight="medium">
//                           {allocated} days
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary">
//                           Used
//                         </Typography>
//                         <Typography variant="body1" fontWeight="medium">
//                           {used} days
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary">
//                           Pending
//                         </Typography>
//                         <Typography variant="body1" fontWeight="medium">
//                           {pending} days
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6}>
//                         <Typography variant="body2" color="text.secondary">
//                           Remaining
//                         </Typography>
//                         <Typography variant="body1" fontWeight="medium" color={remaining <= 0 ? 'error.main' : 'success.main'}>
//                           {remaining} days
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             );
//           })}
//         </Grid>
//       )}
//     </Paper>
//   );
// };

// export default UserLeaveBalanceSummary;
