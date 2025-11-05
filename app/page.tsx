'use client';
import * as React from 'react';
import { Container, Box } from '@mui/material';
import DataTable from '@/components/DataTable';
import TopBar from '@/components/TopBar';
import ManageColumnsDialog from '@/components/ManageColumnsDialog';
import { useAppSelector } from '@/redux/store';

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const { columns, rows } = useAppSelector(s => s.table);

  const getExportData = React.useCallback(()=>{
    const vis = columns.filter(c => c.visible);
    return { columns: vis.map(c=>({key:c.key,label:c.label})), rows: rows.map(r=>r) };
  }, [columns, rows]);

  return (
    <Box>
      <TopBar onOpenManageCols={()=>setOpen(true)} getExportData={getExportData} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DataTable />
      </Container>
      <ManageColumnsDialog open={open} onClose={()=>setOpen(false)} />
    </Box>
  );
}
