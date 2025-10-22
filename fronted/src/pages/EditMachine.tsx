// Edit Machine Page
import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Alert, Typography, Paper, Fade, Slide } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SmartForm from '../components/SmartForm';
import api from '../api/axios';

const EditMachine: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [machineData, setMachineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Paper 
            elevation={8}
            sx={{ 
              p: 4, 
              background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
              borderRadius: 3,
              border: '1px solid rgba(96, 165, 250, 0.1)',
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
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 6px 20px rgba(96, 165, 250, 0.50)',
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

