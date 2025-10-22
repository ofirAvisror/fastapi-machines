// Edit Machine Page
import React, { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Alert, Typography, Paper } from '@mui/material';
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

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper 
          elevation={6}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            maxWidth: 400
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading machine data...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error || !machineData) {
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
          <Paper 
            elevation={6}
            sx={{ 
              p: 4, 
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
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
          formType="update"
          rawData={machineData}
          machineId={Number(id)}
          onSuccess={handleSuccess}
        />
      </Box>
    </Box>
  );
};

export default EditMachine;

