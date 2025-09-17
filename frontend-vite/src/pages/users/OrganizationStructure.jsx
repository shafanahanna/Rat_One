import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Container, 
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { Building, Users } from 'lucide-react';
import Designations from './Designations';
import Departments from './Departments';

const OrganizationStructure = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card elevation={0} sx={{ mb: 3, borderRadius: '16px', overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 500, 
              color: '#202124',
              fontSize: '1.5rem',
              mb: 2
            }}
          >
            Organization Structure
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              aria-label="organization structure tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#1a73e8',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  color: '#5f6368',
                  '&.Mui-selected': {
                    color: '#1a73e8',
                  },
                },
              }}
            >
              <Tab 
                icon={<Users size={18} />} 
                iconPosition="start" 
                label="Designations" 
                sx={{ minHeight: '48px' }}
              />
              <Tab 
                icon={<Building size={18} />} 
                iconPosition="start" 
                label="Departments" 
                sx={{ minHeight: '48px' }}
              />
            </Tabs>
          </Box>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <Box sx={{ mt: 0 }}>
        {activeTab === 0 && <Designations />}
        {activeTab === 1 && <Departments />}
      </Box>
    </Container>
  );
};

export default OrganizationStructure;
