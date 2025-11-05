'use client';
import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Stack, Switch } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { importRows, setTheme } from '@/redux/tableSlice'; 

export default function TopBar({
  onOpenManageCols,
  getExportData
}: {
  onOpenManageCols: () => void;
  getExportData: () => { columns: { key: string; label: string }[]; rows: any[] };
}) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(s => s.table.themeMode);

  const onImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.csv,text/csv';
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: (res) => {
          const data = res.data as any[];
          if (!Array.isArray(data) || data.length === 0) { alert('CSV looks empty.'); return; }
          const req = ['name','email','age','role'];
          const missing = req.filter(k => !(k in data[0]));
          if (missing.length) { alert('Missing columns: ' + missing.join(', ')); return; }
          const rows = data.map(d => ({ ...d, age: Number.isFinite(+d.age) ? +d.age : 0 }));
          // dispatch(importRows(rows as any)); // kept commented; demo focuses on UI/validation
          alert('CSV parsed OK (demo): ' + rows.length + ' rows'); // friendly confirmation
        },
        error: (err) => { alert('CSV parse failed: ' + err.message); }
      });
    };
    input.click();
  };

  const onExport = () => {
    const { columns, rows } = getExportData();
    const csv = Papa.unparse({
      fields: columns.map(c => c.label),
      data: rows.map(r => columns.map(c => r[c.key] ?? ''))
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'table_export.csv');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Dynamic Data Table Manager</Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2 }}>
          <LightModeIcon fontSize="small" />
          <Switch checked={mode === 'dark'} onChange={(e)=>dispatch(setTheme(e.target.checked ? 'dark' : 'light'))} />
          <DarkModeIcon fontSize="small" />
        </Stack>

        <Tooltip title="Manage Columns">
          <IconButton color="inherit" onClick={onOpenManageCols}><ViewColumnIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Import CSV">
          <IconButton color="inherit" onClick={onImport}><UploadFileIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Export CSV (visible)">
          <IconButton color="inherit" onClick={onExport}><DownloadIcon /></IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
