// Entities List Page (Generic for any entity)
import React from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/DataTable';
import ThemeToggle from '../components/ThemeToggle';
import { ENTITY_CONFIG, getRoutePath } from '../config/entities';

const EntitiesList: React.FC = () => {
  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <ThemeToggle />
      <DataTable
        topic={ENTITY_CONFIG.apiName}
        title={ENTITY_CONFIG.displayNamePlural}
        createPath={getRoutePath('create')}
        editPathPrefix={getRoutePath('edit')}
      />
    </Box>
  );
};

export default EntitiesList;

