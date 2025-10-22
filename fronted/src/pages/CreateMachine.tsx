// Create Machine Page
import React from 'react';
import { Button, Box, Fade, Slide } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SmartForm from '../components/SmartForm';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const CreateMachine: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();

  const handleSuccess = () => {
    navigate('/machines');
  };

  const bgGradient = mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)';

  const buttonColor = mode === 'dark' ? '#60a5fa' : '#667eea';
  const buttonBorder = mode === 'dark' ? 'rgba(96, 165, 250, 0.5)' : 'rgba(102, 126, 234, 0.5)';
  const buttonBg = mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)';

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: bgGradient,
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <ThemeToggle />
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Fade in timeout={600}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/machines')}
            sx={{
              mb: 3,
              color: buttonColor,
              borderColor: buttonBorder,
              backgroundColor: buttonBg,
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2.5,
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              '&:hover': {
                borderColor: buttonColor,
                backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                transform: 'translateX(-5px)',
                boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
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

