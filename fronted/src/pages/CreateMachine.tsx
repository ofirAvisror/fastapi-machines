// Create Machine Page
import React from 'react';
import { Button, Box } from '@mui/material';
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/machines')}
          sx={{
            mb: 3,
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateX(-5px)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Back to Machines
        </Button>
        
        <SmartForm
          topic="machine"
          formType="create"
          onSuccess={handleSuccess}
        />
      </Box>
    </Box>
  );
};

export default CreateMachine;

