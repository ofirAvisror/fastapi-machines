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
  Fade,
  Grow,
  Slide,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
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
  const { mode } = useTheme();

  // Helper function to get theme-specific styles
  const getThemeStyles = () => {
    if (mode === 'dark') {
      return {
        bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        paperBg: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
        searchBg: 'rgba(15, 23, 42, 0.6)',
        searchBorder: 'rgba(96, 165, 250, 0.2)',
        searchBorderFocus: '#60a5fa',
        textColor: '#f1f5f9',
        titleGradient: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
        buttonGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        buttonHover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        editButton: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        editButtonHover: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        tableHeaderBg: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
        tableRowHover: 'rgba(96, 165, 250, 0.08)',
        tableRowEven: 'rgba(15, 23, 42, 0.3)',
      };
    } else {
      return {
        bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
        paperBg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        searchBg: 'rgba(255, 255, 255, 0.9)',
        searchBorder: 'rgba(102, 126, 234, 0.2)',
        searchBorderFocus: '#667eea',
        textColor: '#1e293b',
        titleGradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
        buttonGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        buttonHover: 'linear-gradient(135deg, #4c63d2 0%, #5a3a7c 100%)',
        editButton: 'linear-gradient(135deg, #f093fb 0%, #c961e8 100%)',
        editButtonHover: 'linear-gradient(135deg, #c961e8 0%, #a145c5 100%)',
        tableHeaderBg: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
        tableRowHover: 'rgba(102, 126, 234, 0.08)',
        tableRowEven: 'rgba(102, 126, 234, 0.03)',
      };
    }
  };

  const themeStyles = getThemeStyles();

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
      return (
        <Chip 
          label="ACTIVE" 
          color="success" 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.5px',
            px: 1
          }} 
        />
      );
    }
    if (value === 'not_active') {
      return (
        <Chip 
          label="NOT ACTIVE" 
          color="default" 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.5px',
            px: 1
          }} 
        />
      );
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

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: themeStyles.bgGradient,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}>
        <Paper 
          elevation={8}
          sx={{ 
            p: 4,
            maxWidth: '500px',
            background: themeStyles.paperBg,
            borderRadius: 3,
            border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button 
            onClick={fetchData} 
            variant="contained"
            fullWidth
            sx={{
              background: themeStyles.buttonGradient,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2.5,
              boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
              '&:hover': {
                background: themeStyles.buttonHover,
                boxShadow: mode === 'dark' ? '0 6px 20px rgba(96, 165, 250, 0.50)' : '0 6px 20px rgba(102, 126, 234, 0.30)',
              }
            }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
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
      height: 'auto',
      width: '100%',
      background: themeStyles.bgGradient,
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2, md: 3 },
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: '100%', md: '1400px' },
        mx: 'auto'
      }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper 
            elevation={8} 
            sx={{ 
              p: { xs: 2, sm: 2.5, md: 3 },
              mb: { xs: 2, sm: 2.5, md: 3 },
              background: themeStyles.paperBg,
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
              boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
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
                  background: themeStyles.titleGradient,
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
                background: themeStyles.buttonGradient,
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
                whiteSpace: 'nowrap',
                borderRadius: 2.5,
                '&:hover': {
                  background: themeStyles.buttonHover,
                  boxShadow: mode === 'dark' ? '0 6px 20px rgba(96, 165, 250, 0.50)' : '0 6px 20px rgba(102, 126, 234, 0.30)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
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
                    <SearchIcon sx={{ color: mode === 'dark' ? '#60a5fa' : '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: themeStyles.searchBg,
                  borderRadius: 2.5,
                  '& fieldset': {
                    borderColor: themeStyles.searchBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(102, 126, 234, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: themeStyles.searchBorderFocus,
                    borderWidth: '2px',
                  }
                },
                '& .MuiOutlinedInput-input': {
                  color: themeStyles.textColor,
                }
              }}
            />
          </Box>
        </Paper>
        </Fade>

        {/* Table Section */}
        {data.length === 0 && !loading ? (
          <Fade in timeout={1000}>
            <Paper 
            elevation={8} 
            sx={{ 
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: 'center',
              background: themeStyles.paperBg,
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: mode === 'dark' ? '#60a5fa' : '#667eea' }}>
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
                background: themeStyles.buttonGradient,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2.5,
                boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
                '&:hover': {
                  background: themeStyles.buttonHover,
                  boxShadow: mode === 'dark' ? '0 6px 20px rgba(96, 165, 250, 0.50)' : '0 6px 20px rgba(102, 126, 234, 0.30)',
                }
              }}
            >
              Create First {title}
            </Button>
          </Paper>
          </Fade>
        ) : filteredData.length === 0 && searchTerm ? (
          <Fade in timeout={1000}>
            <Paper 
            elevation={8} 
            sx={{ 
              p: { xs: 3, sm: 4, md: 6 },
              textAlign: 'center',
              background: themeStyles.paperBg,
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
                color: mode === 'dark' ? '#cbd5e1' : '#64748b',
                mb: 1
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
          </Fade>
        ) : data.length > 0 ? (
          <Slide direction="up" in timeout={1000}>
            <TableContainer 
            component={Paper} 
            elevation={8}
            sx={{ 
              background: themeStyles.paperBg,
              borderRadius: 3,
              overflow: 'auto',
              maxWidth: '100%',
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
              boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: 10,
                width: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(96, 165, 250, 0.5)',
                borderRadius: 4,
                border: '2px solid rgba(30, 41, 59, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.8)',
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
                    background: themeStyles.tableHeaderBg,
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
                      {column === 'enum' ? 'Status' : column.replace(/_/g, ' ')}
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
                        backgroundColor: themeStyles.tableRowHover,
                        transition: 'background-color 0.3s ease'
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: themeStyles.tableRowEven
                      },
                      borderBottom: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.1)'
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
                          background: themeStyles.editButton,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: { xs: 2, sm: 3 },
                          py: { xs: 0.6, sm: 0.8 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          borderRadius: 2,
                          boxShadow: mode === 'dark' ? '0 4px 14px 0 rgba(167, 139, 250, 0.39)' : '0 4px 14px 0 rgba(240, 147, 251, 0.2)',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            background: themeStyles.editButtonHover,
                            boxShadow: mode === 'dark' ? '0 6px 20px rgba(167, 139, 250, 0.50)' : '0 6px 20px rgba(240, 147, 251, 0.30)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
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
          </Slide>
        ) : null}

        {/* Footer Section */}
        {data.length > 0 && (
          <Fade in timeout={1200}>
            <Paper 
            elevation={8} 
            sx={{ 
              mt: { xs: 2, sm: 2.5, md: 3 },
              p: { xs: 1.5, sm: 2 },
              textAlign: 'center',
              background: themeStyles.paperBg,
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
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
                (filtered by: "{searchTerm}")
              </Box>
            )}
          </Typography>
        </Paper>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default DataTable;

