// Create Machine Page
import React from 'react';
import { Button, Box, Fade, Slide } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SmartForm from '../components/SmartForm';

const CreateMachine: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/machines');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Fade in timeout={600}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/machines')}
            sx={{
              mb: 3,
              color: '#60a5fa',
              borderColor: 'rgba(96, 165, 250, 0.5)',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2.5,
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '&:hover': {
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                transform: 'translateX(-5px)',
                boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Back to Machines
          </Button>
        </Fade>
        
        <Slide direction="up" in timeout={900}>
          <Box>
            <SmartForm
              topic="machine"
              formType="create"
              onSuccess={handleSuccess}
            />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default CreateMachine;

