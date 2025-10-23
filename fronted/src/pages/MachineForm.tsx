// Entity Form Page - Unified Create/Edit (Generic for any entity)
import React, { useState, useEffect } from 'react';
import { Button, Box, Fade, Slide, Alert, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import SmartForm from '../components/SmartForm';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { ENTITY_CONFIG, getRoutePath } from '../config/entities';
import api from '../api/axios';

const EntityForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { mode } = useTheme();
  
  const [entityData, setEntityData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine if this is edit mode (has ID) or create mode (no ID)
  const isEditMode = !!id;

  // Theme styles
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

  // Fetch entity data if in edit mode
  useEffect(() => {
    if (!id) return;

    const fetchEntity = async () => {
      try {
        const response = await api.get(`/${ENTITY_CONFIG.apiName}/get?id=${id}`);
        if (response.data && response.data.length > 0) {
          setEntityData(response.data[0]);
        } else {
          setError(`${ENTITY_CONFIG.displayName} not found`);
        }
      } catch (err: any) {
        setError(`Failed to load ${ENTITY_CONFIG.apiName}: ${err.message}`);
      }
    };

    fetchEntity();
  }, [id]);

  const handleSuccess = () => {
    navigate(getRoutePath());
  };

  // Error state
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
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate(getRoutePath())}
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
              Back
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Main form
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
            onClick={() => navigate(getRoutePath())}
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
            Back
          </Button>
        </Fade>
        
        <Slide direction="up" in timeout={900}>
          <Box>
            <SmartForm
              topic={ENTITY_CONFIG.apiName}
              formType={isEditMode ? 'update' : 'create'}
              rawData={isEditMode ? entityData : undefined}
              entityId={isEditMode ? Number(id) : undefined}
              onSuccess={handleSuccess}
            />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default EntityForm;

