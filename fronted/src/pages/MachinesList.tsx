// Machines List Page
import React from 'react';
import { Container } from '@mui/material';
import DataTable from '../components/DataTable';

const MachinesList: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <DataTable
        topic="machine"
        title="Machines"
        createPath="/machines/create"
        editPathPrefix="/machines/edit"
      />
    </Container>
  );
};

export default MachinesList;

