import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Badge
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../../redux/slices/authSlice';
import { BarChart, TrendingUp, Users, MessageSquare, FileText } from 'lucide-react';

const Dashboard = () => {

  
  

  

  return (

    <h>Dashboard</h>
  )
      
        
        
  
}

export default Dashboard;
