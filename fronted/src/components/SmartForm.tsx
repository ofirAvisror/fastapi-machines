// SmartForm Component - Dynamic form generation based on JSON schema
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import type { JSONSchema, SchemaProperty, FormType } from '../types';

interface SmartFormProps {
  topic: string;
  formType: FormType;
  rawData?: Record<string, any>;
  onSuccess?: () => void;
  entityId?: number;  // Generic entity ID (was machineId)
}

const SmartForm: React.FC<SmartFormProps> = ({
  topic,
  formType,
  rawData,
  onSuccess,
  entityId,
}) => {
  const [schema, setSchema] = useState<JSONSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const { mode } = useTheme();

  // Helper function to get theme-specific styles
  const getThemeStyles = () => {
    if (mode === 'dark') {
      return {
        paperBg: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
        inputBg: 'rgba(15, 23, 42, 0.6)',
        inputBorder: 'rgba(96, 165, 250, 0.2)',
        inputBorderFocus: '#60a5fa',
        titleGradient: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
        buttonGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        buttonHover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      };
    } else {
      return {
        paperBg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        inputBg: 'rgba(255, 255, 255, 0.9)',
        inputBorder: 'rgba(102, 126, 234, 0.2)',
        inputBorderFocus: '#667eea',
        titleGradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
        buttonGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        buttonHover: 'linear-gradient(135deg, #4c63d2 0%, #5a3a7c 100%)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  // Fetch schema on component mount
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/${topic}/schema/${formType}`);
        setSchema(response.data);

        // Initialize form data with defaults or raw data
        const initialData: Record<string, any> = {};
        const properties = response.data.properties;

        Object.keys(properties).forEach((key) => {
          const prop = properties[key];
          
          // If rawData exists (update form), use it
          if (rawData && rawData[key] !== undefined) {
            initialData[key] = rawData[key];
          }
          // Otherwise use default value from schema
          else if (prop.default !== undefined) {
            initialData[key] = prop.default;
          }
          // Or set empty value based on type
          else {
            initialData[key] = getDefaultValue(prop);
          }
        });

        setFormData(initialData);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to load schema: ${err.message}`);
        setLoading(false);
      }
    };

    fetchSchema();
  }, [topic, formType, rawData]);

  // Get default value based on type
  const getDefaultValue = (prop: SchemaProperty): any => {
    if (prop.type === 'integer' || prop.type === 'number') return 0;
    if (prop.type === 'boolean') return false;
    if (prop.enum && prop.enum.length > 0) return prop.enum[0];
    return '';
  };

  // Resolve $ref to actual enum values
  const resolveRef = (ref: string): string[] => {
    if (!schema?.$defs) return [];
    const defName = ref.split('/').pop();
    if (defName && schema.$defs[defName]?.enum) {
      return schema.$defs[defName].enum;
    }
    return [];
  };

  // Format enum value for display (e.g., "not_active" → "NOT ACTIVE")
  const formatEnumValue = (value: string): string => {
    return value
      .replace(/_/g, ' ')  // Replace underscores with spaces
      .toUpperCase();       // Convert to uppercase
  };

  // Validate a single field
  const validateField = (fieldName: string, value: any): string => {
    if (!schema?.properties) return '';
    
    const prop = schema.properties[fieldName];
    if (!prop) return '';

    // Check if field is required (no default value and not optional)
    const isRequired = prop.default === undefined && !fieldName.includes('password');
    
    // Required field validation
    if (isRequired) {
      if (value === '' || value === null || value === undefined) {
        return `${prop.title || fieldName} is required`;
      }
    }

    // Email validation
    if (prop.format === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // String length validation
    if (prop.type === 'string' && prop.maxLength && value) {
      if (value.length > prop.maxLength) {
        return `Maximum ${prop.maxLength} characters allowed`;
      }
    }

    // Number range validation
    if ((prop.type === 'integer' || prop.type === 'number') && value !== '') {
      if (prop.minimum !== undefined && value < prop.minimum) {
        return `Minimum value is ${prop.minimum}`;
      }
      if (prop.maximum !== undefined && value > prop.maximum) {
        return `Maximum value is ${prop.maximum}`;
      }
    }

    return '';
  };

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate if field was already touched
    if (touchedFields[field]) {
      const errorMsg = validateField(field, value);
      setFieldErrors((prev) => ({
        ...prev,
        [field]: errorMsg,
      }));
    }
  };

  // Handle field blur (when user leaves the field)
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const errorMsg = validateField(fieldName, formData[fieldName]);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: errorMsg,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    
    if (schema?.properties) {
      Object.keys(schema.properties).forEach((fieldName) => {
        touched[fieldName] = true;
        const errorMsg = validateField(fieldName, formData[fieldName]);
        if (errorMsg) {
          errors[fieldName] = errorMsg;
        }
      });
    }

    setTouchedFields(touched);
    setFieldErrors(errors);

    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      setError('Please fix all errors before submitting');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (formType === 'create') {
        await api.post(`/${topic}/create`, formData);
      } else {
        // Use dynamic parameter name based on topic (e.g., machine_id, user_id, etc.)
        await api.put(`/${topic}/update?${topic}_id=${entityId}`, formData);
      }
      
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message;
      setError(`Failed to ${formType}: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Render form field based on property type
  const renderField = (fieldName: string, prop: SchemaProperty) => {
    const value = formData[fieldName] || '';

    // Handle enum fields (including $ref)
    if (prop.enum || prop.$ref) {
      const enumValues = prop.enum || (prop.$ref ? resolveRef(prop.$ref) : []);
      const isRequired = prop.default === undefined;
      const hasError = touchedFields[fieldName] && !!fieldErrors[fieldName];
      
      return (
        <FormControl 
          fullWidth 
          key={fieldName}
          required={isRequired}
          error={hasError}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              backgroundColor: themeStyles.inputBg,
              transition: 'all 0.3s ease',
              '& fieldset': {
                borderColor: themeStyles.inputBorder,
              },
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 1)',
              },
              '&:hover fieldset': {
                borderColor: hasError ? 'error.main' : themeStyles.inputBorderFocus,
                borderWidth: 2,
              },
              '&.Mui-focused': {
                backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.02)',
              },
              '&.Mui-focused fieldset': {
                borderColor: hasError ? 'error.main' : themeStyles.inputBorderFocus,
                borderWidth: 2,
                boxShadow: hasError 
                  ? '0 0 0 3px rgba(248, 113, 113, 0.2)'
                  : mode === 'dark' 
                    ? '0 0 0 3px rgba(96, 165, 250, 0.2)'
                    : '0 0 0 3px rgba(102, 126, 234, 0.15)',
              }
            }
          }}
        >
          <InputLabel>{prop.title || fieldName}</InputLabel>
          <Select
            value={value}
            label={prop.title || fieldName}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            onBlur={() => handleBlur(fieldName)}
            renderValue={(selected) => (
              <Box sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                {formatEnumValue(selected as string)}
              </Box>
            )}
          >
            {enumValues.map((option) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  py: 1.5
                }}
              >
                {formatEnumValue(option)}
              </MenuItem>
            ))}
          </Select>
          {hasError && (
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ 
                ml: 1.75, 
                mt: 0.5,
                display: 'block',
                fontSize: '0.75rem'
              }}
            >
              {fieldErrors[fieldName]}
            </Typography>
          )}
        </FormControl>
      );
    }

    // Handle different input types
    let inputType = 'text';
    if (prop.type === 'integer' || prop.type === 'number') {
      inputType = 'number';
    } else if (prop.format === 'email') {
      inputType = 'email';
    } else if (fieldName.toLowerCase().includes('password')) {
      inputType = 'password';
    }

    // Check if field is required
    const isRequired = prop.default === undefined && !fieldName.includes('password');
    const hasError = touchedFields[fieldName] && !!fieldErrors[fieldName];
    
    return (
      <TextField
        key={fieldName}
        fullWidth
        required={isRequired}
        label={prop.title || fieldName}
        type={inputType}
        value={value}
        error={hasError}
        onChange={(e) => {
          const val = inputType === 'number' ? Number(e.target.value) : e.target.value;
          handleChange(fieldName, val);
        }}
        onBlur={() => handleBlur(fieldName)}
        inputProps={{
          maxLength: prop.maxLength,
          step: prop.type === 'number' ? 'any' : undefined,
        }}
        helperText={
          hasError 
            ? fieldErrors[fieldName]
            : prop.maxLength 
              ? `Max ${prop.maxLength} characters` 
              : prop.format === 'email' 
                ? 'Enter a valid email' 
                : ''
        }
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            backgroundColor: themeStyles.inputBg,
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: themeStyles.inputBorder,
            },
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 1)',
              '& fieldset': {
                borderColor: hasError ? 'error.main' : themeStyles.inputBorderFocus,
                borderWidth: 2,
              }
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.02)',
              '& fieldset': {
                borderColor: hasError ? 'error.main' : themeStyles.inputBorderFocus,
                borderWidth: 2,
                boxShadow: hasError 
                  ? '0 0 0 3px rgba(248, 113, 113, 0.2)'
                  : mode === 'dark' 
                    ? '0 0 0 3px rgba(96, 165, 250, 0.2)'
                    : '0 0 0 3px rgba(102, 126, 234, 0.15)',
              }
            }
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: hasError ? 'error.main' : themeStyles.inputBorderFocus,
            fontWeight: 600,
          },
          '& .MuiFormHelperText-root': {
            color: hasError ? 'error.main' : mode === 'dark' ? '#94a3b8' : '#64748b',
          }
        }}
      />
    );
  };

  return (
    <Fade in timeout={600}>
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: 700,
          mx: 'auto',
          background: themeStyles.paperBg,
          backdropFilter: 'blur(20px)',
          borderRadius: 3,
          border: mode === 'dark' ? '1px solid rgba(96, 165, 250, 0.1)' : '1px solid rgba(102, 126, 234, 0.15)',
          boxShadow: mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: themeStyles.titleGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            {formType === 'create' ? `Create New ${topic.charAt(0).toUpperCase() + topic.slice(1)}` : `Update ${topic.charAt(0).toUpperCase() + topic.slice(1)}`}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
          >
            {formType === 'create' ? 'Fill in the details below to create a new entry' : 'Modify the fields below to update the entry'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
            {schema?.properties && Object.keys(schema.properties).map((fieldName, index) => {
              const prop = schema.properties[fieldName];
              return (
                <Grow 
                  in 
                  timeout={400 + index * 100}
                  style={{ transformOrigin: '0 0 0' }}
                  key={fieldName}
                >
                  <Box>
                    {renderField(fieldName, prop)}
                  </Box>
                </Grow>
              );
            })}
          </Box>

          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in>
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)'
                }}
              >
                {formType === 'create' ? 'Created successfully! Redirecting...' : 'Updated successfully! Redirecting...'}
              </Alert>
            </Fade>
          )}

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
              size="large"
              startIcon={submitting ? null : (formType === 'create' ? <AddIcon /> : <SaveIcon />)}
              sx={{
                background: submitting 
                  ? mode === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(102, 126, 234, 0.3)'
                  : themeStyles.buttonGradient,
                py: { xs: 1.5, sm: 1.8 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: submitting 
                  ? 'none' 
                  : mode === 'dark' ? '0 4px 14px 0 rgba(96, 165, 250, 0.39)' : '0 4px 14px 0 rgba(102, 126, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: themeStyles.buttonHover,
                  boxShadow: mode === 'dark' ? '0 6px 20px rgba(96, 165, 250, 0.50)' : '0 6px 20px rgba(102, 126, 234, 0.30)',
                  transform: 'translateY(-3px) scale(1.02)',
                  transition: 'all 0.3s ease'
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                },
                '&:disabled': {
                  background: mode === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(102, 126, 234, 0.3)',
                  color: mode === 'dark' ? 'rgba(241, 245, 249, 0.5)' : 'rgba(30, 41, 59, 0.5)',
                }
              }}
            >
              {submitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                  <span>{formType === 'create' ? 'Creating...' : 'Updating...'}</span>
                </Box>
              ) : (
                formType === 'create' ? `Create ${topic.charAt(0).toUpperCase() + topic.slice(1)}` : 'Save Changes'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default SmartForm;

