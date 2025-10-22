// Main App Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MachinesList from './pages/MachinesList';
import CreateMachine from './pages/CreateMachine';
import EditMachine from './pages/EditMachine';
import './App.css';

// Create Dark Mode Professional Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Modern blue
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#a78bfa', // Modern purple
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    success: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#10b981',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
    },
    background: {
      default: '#0f172a', // Dark slate
      paper: '#1e293b',   // Lighter slate
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    '0 25px 50px -12px rgb(0 0 0 / 0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(96, 165, 250, 0.50)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/machines" replace />} />
          <Route path="/machines" element={<MachinesList />} />
          <Route path="/machines/create" element={<CreateMachine />} />
          <Route path="/machines/edit/:id" element={<EditMachine />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
