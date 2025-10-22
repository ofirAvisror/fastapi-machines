// Machines List Page
import React from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/DataTable';

const MachinesList: React.FC = () => {
  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <DataTable
        topic="machine"
        title="Machines"
        createPath="/machines/create"
        editPathPrefix="/machines/edit"
      />
    </Box>
  );
};

export default MachinesList;

