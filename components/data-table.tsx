"use client"
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Signed at', width: 200 },
  { field: 'col2', headerName: 'From', width: 200 },
  { field: 'col3', headerName: 'To', width: 200 },
  { field: 'col4', headerName: 'Value', width: 200 },
];


export default function DataTable({rows}) {
  return (
    <div style={{ height:"80vh", width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
