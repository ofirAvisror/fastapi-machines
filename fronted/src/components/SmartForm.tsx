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
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../api/axios';
import type { JSONSchema, SchemaProperty, FormType } from '../types';

interface SmartFormProps {
  topic: string;
  formType: FormType;
  rawData?: Record<string, any>;
  onSuccess?: () => void;
  machineId?: number;
}

const SmartForm: React.FC<SmartFormProps> = ({
  topic,
  formType,
  rawData,
  onSuccess,
  machineId,
}) => {
  const [schema, setSchema] = useState<JSONSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (formType === 'create') {
        await api.post(`/${topic}/create`, formData);
      } else {
        await api.put(`/${topic}/update?machine_id=${machineId}`, formData);
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
      
      return (
        <FormControl 
          fullWidth 
          key={fieldName}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.02)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              }
            }
          }}
        >
          <InputLabel>{prop.title || fieldName}</InputLabel>
          <Select
            value={value}
            label={prop.title || fieldName}
            onChange={(e) => handleChange(fieldName, e.target.value)}
          >
            {enumValues.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
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

    return (
      <TextField
        key={fieldName}
        fullWidth
        label={prop.title || fieldName}
        type={inputType}
        value={value}
        onChange={(e) => {
          const val = inputType === 'number' ? Number(e.target.value) : e.target.value;
          handleChange(fieldName, val);
        }}
        inputProps={{
          maxLength: prop.maxLength,
          step: prop.type === 'number' ? 'any' : undefined,
        }}
        helperText={
          prop.maxLength ? `Max ${prop.maxLength} characters` : 
          prop.format === 'email' ? 'Enter a valid email' : ''
        }
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              }
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.02)',
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              }
            }
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'primary.main',
            fontWeight: 600,
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading form...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!schema) {
    return (
      <Paper elevation={3} sx={{ p: 4, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Alert severity="error">Failed to load form schema</Alert>
      </Paper>
    );
  }

  return (
    <Fade in timeout={600}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: 700,
          mx: 'auto',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            {Object.keys(schema.properties).map((fieldName) => {
              const prop = schema.properties[fieldName];
              return renderField(fieldName, prop);
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
                  ? 'rgba(102, 126, 234, 0.5)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: { xs: 1.5, sm: 1.8 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: submitting 
                  ? 'none' 
                  : '0 4px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-3px) scale(1.02)',
          