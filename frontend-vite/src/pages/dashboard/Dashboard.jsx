import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { BarChart, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <Container maxWidth="xl" className="py-6">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 h-full">
            <Box className="flex items-center mb-3">
              <Users className="text-blue-500 mr-2" size={24} />
              <Typography variant="h6">Employees</Typography>
            </Box>
            <Typography variant="h3" className="font-bold mb-2">0</Typography>
            <Typography variant="body2" color="textSecondary">
              Total employees in the system
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="p-4 h-full">
            <Box className="flex items-center mb-3">
              <BarChart className="text-green-500 mr-2" size={24} />
              <Typography variant="h6">Attendance</Typography>
            </Box>
            <Typography variant="h3" className="font-bold mb-2">0%</Typography>
            <Typography variant="body2" color="textSecondary">
              Average attendance this month
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className="p-4 h-full">
            <Box className="flex items-center mb-3">
              <Users className="text-purple-500 mr-2" size={24} />
              <Typography variant="h6">On Leave</Typography>
            </Box>
            <Typography variant="h3" className="font-bold mb-2">0</Typography>
            <Typography variant="body2" color="textSecondary">
              Employees currently on leave
            </Typography>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Recent Activity</Typography>
            <Box className="p-6 text-center">
              <Typography variant="body1" color="textSecondary">
                No recent activity to display
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
