// Main App Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MachinesList from './pages/MachinesList';
import CreateMachine from './pages/CreateMachine';
import EditMachine from './pages/EditMachine';
import './App.css';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
