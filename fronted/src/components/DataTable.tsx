// Generic Data Table Component
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface DataTableProps {
  topic: string;
  title: string;
  createPath: string;
  editPathPrefix: string;
}

const DataTable: React.FC<DataTableProps> = ({
  topic,
  title,
  createPath,
  editPathPrefix,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [topic]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${topic}/get`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === 'active') {
      return <Chip label="Active" color="success" size="small" />;
    }
    if (value === 'not_active') {
      return <Chip label="Not Active" color="default" size="small" />;
    }
    if (typeof value === 'string' && (value.includes('T') || value.includes('-'))) {
      // Format datetime - handle UTC times from server
      try {
        // If the datetime doesn't have timezone info, assume it's UTC
        let dateStr = value;
        if (value.includes('T') && !value.includes('Z') && !value.includes('+')) {
          dateStr = value + 'Z'; // Add Z to indicate UTC
        }
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
        }
        return value;
      } catch {
        return value;
      }
    }
    return String(value);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading {title}...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 4,
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button 
            onClick={fetchData} 
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 1.5
            }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            maxWidth: '500px'
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            No {title} Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Get started by creating your first {title.toLowerCase()}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate(createPath)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            Create First {title}
          </Button>
        </Paper>
      </Box>
    );
  }

  const columns = Object.keys(data[0]);
  const displayColumns = columns.filter(col => col !== 'password');

  // Filter data based on search term (searches in 'name' field)
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    const name = row.name || '';
    return name.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: '100%', md: '1400px' },
        mx: 'auto', 
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        {/* Header Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 2, sm: 2.5, md: 3 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Manage your {title.toLowerCase()} efficiently
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate(createPath)}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-3px) scale(1.03)',
                  transition: 'all 0.3s ease'
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                }
              }}
            >
              Create New
            </Button>
          </Box>

          {/* Search Section */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  }
                }
              }}
            />
          </Box>
        </Paper>

        {/* Table Section */}
        {filteredData.length === 0 && searchTerm ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h5" 
              color="text.secondary" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
              }}
            >
              No results found for "{searchTerm}"
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Try adjusting your search term
            </Typography>
          </Paper>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              overflow: 'auto',
              maxWidth: '100%',
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              '&::-webkit-scrollbar': {
                height: 10,
                width: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(102, 126, 234, 0.5)',
                borderRadius: 4,
                border: '2px solid rgba(255,255,255,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.8)',
                }
              },
              '&::-webkit-scrollbar-corner': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <Table 
              sx={{ 
                minWidth: 800,  // רוחב מינימלי קבוע לטבלה
                tableLayout: 'auto'  // מאפשר לעמודות להתאים את עצמן
              }}
            >
              <TableHead>
                <TableRow 
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {displayColumns.map((column) => (
                    <TableCell 
                      key={column} 
                      align="center"
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        py: { xs: 1.5, sm: 2, md: 2.5 },
                        px: { xs: 1, sm: 2 },
                        borderBottom: '2px solid rgba(255,255,255,0.1)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {column.replace(/_/g, ' ')}
                    </TableCell>
                  ))}
                  <TableCell 
                    align="center"
                    sx={{ 
                      color: 'white', 
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: { xs: 1.5, sm: 2, md: 2.5 },
                      px: { xs: 1, sm: 2 },
                      borderBottom: '2px solid rgba(255,255,255,0.1)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
                        transform: { xs: 'none', md: 'scale(1.001)' },
                        transition: 'all 0.2s ease'
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    {displayColumns.map((column) => (
                      <TableCell 
                        key={column}
                        align="center"
                        sx={{
                          py: { xs: 1.5, sm: 2 },
                          px: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                          color: 'text.primary',
                          whiteSpace: 'nowrap',  // תמיד לא לשבור שורות
                          minWidth: { xs: '80px', sm: 'auto' }  // רוחב מינימלי
                        }}
                      >
                        {formatValue(row[column])}
                      </TableCell>
                    ))}
                    <TableCell 
                      align="center" 
                      sx={{ 
                        py: { xs: 1.5, sm: 2 }, 
                        px: { xs: 1.5, sm: 2 },
                        minWidth: '100px',  // רוחב מינימלי לעמודת Actions
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
                        onClick={() => navigate(`${editPathPrefix}/${row.id}`)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          textTransform: 'none',
                          px: { xs: 2, sm: 3 },
                          py: { xs: 0.6, sm: 0.8 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease'
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Footer Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            mt: { xs: 2, sm: 2.5, md: 3 },
            p: { xs: 1.5, sm: 2 },
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box component="span">Showing</Box>
            <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>{filteredData.length}</Box>
            <Box component="span">of</Box>
            <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>{data.length}</Box>
            <Box component="span">{title.toLowerCase()}</Box>
            {searchTerm && (
              <Box component="span" sx={{ fontStyle: 'italic', color: 'text.secondary', display: { xs: 'block', sm: 'inline' }, width: { xs: '100%', sm: 'auto' }, mt: { xs: 0.5, sm: 0 } }}>
                (filtere