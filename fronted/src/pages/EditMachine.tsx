// Edit Machine Page
import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Alert, Typography, Paper, Fade, Slide } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SmartForm from '../components/SmartForm';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

const EditMachine: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [machineData, setMachineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useTheme();

  const bgGradient = mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)';

  const paperBg = mode === 'dark'
    ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';

  const buttonColor = mode === 'dark' ? '#60a5fa' : '#667eea';
  const buttonBorder = mode === 'dark' ? 'rgba(96, 165, 250, 0.5)' : 'rgba(102, 126, 234, 0.5)';
  const buttonBg = mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)';
  const buttonGradient = mode === 'dark'
    ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/machine/get?id=${id}`);
        if (response.data && response.data.length > 0) {
          setMachineData(response.data[0]);
        } else {
          setError('Machine not found');
        }
      } catch (err: any) {
        setError(`Failed to load machine: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMachine();
    }
  }, [id]);

  const handleSuccess = () => {
    navigate('/machines');
  };

  if (error) {
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
          <Paper 
            elevation={8}
            sx={{ 
              p: 4, 
              background: paperBg,
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
            }}
          >
            <Alert 
              severity="error"
              sx={{ 
                mb: 3,
                borderRadius: 2,
                fontSize: '1rem'
              }}
            >
              {error || 'Machine not found'}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/machines')}
              sx={{
                background: buttonGradient,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
                '&:hover': {
                  background: mode === 'dark' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(135deg, #4c63d2 0%, #5a3a7c 100%)',
                  boxShadow: mode === 'dark' ? '0 6px 20px rgba(96, 165, 250, 0.50)' : '0 6px 20px rgba(102, 126, 234, 0.30)',
                  transform: 'translateX(-5px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Back to Machines
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

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
              formType="update"
              rawData={machineData}
              machineId={Number(id)}
              onSuccess={handleSuccess}
            />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default EditMachine;

