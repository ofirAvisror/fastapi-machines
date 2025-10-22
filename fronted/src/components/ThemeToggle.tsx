// Theme Toggle Button - Beautiful dark/light mode switcher
import React from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: 1000,
      }}
    >
      <Tooltip 
        title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        placement="left"
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
            color: 'white',
            boxShadow: mode === 'dark'
              ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)'
              : '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #4c63d2 0%, #c961e8 100%)',
              transform: 'scale(1.1) rotate(15deg)',
              boxShadow: mode === 'dark'
                ? '0 6px 20px rgba(96, 165, 250, 0.50)'
                : '0 6px 20px rgba(102, 126, 234, 0.50)',
            },
            '&:active': {
              transform: 'scale(0.95) rotate(-15deg)',
            },
          }}
        >
          {mode === 'dark' ? (
            <Brightness7 sx={{ fontSize: { xs: 24, sm: 28 } }} />
          ) : (
            <Brightness4 sx={{ fontSize: { xs: 24, sm: 28 } }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle;

