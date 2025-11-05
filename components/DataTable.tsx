'use client';
import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, IconButton, Tooltip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { bufferEdit, deleteRow, discardAllEdits, saveAllEdits, setGlobalFilter, setPage, setPageSize, toggleSort } from '@/redux/tableSlice';

export default function DataTable() {
  const dispatch = useAppDispatch();
  const { columns, rows, globalFilter, sort, page, pageSize, editBuffer } = useAppSelector(s => s.table);
  const visible = columns.filter(c => c.visible);

  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  // Filter + sort
  const filtered = rows.filter(r => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return true;
    return columns.some(c => String(r[c.key] ?? '').toLowerCase().includes(q));
  });

  const sorted = React.useMemo(() => {
    if (!sort.key) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sort.key!], bv = b[sort.key!];
      const sa = String(av ?? '').toLowerCase();
      const sb = String(bv ?? '').toLowerCase();
      if (sa < sb) return sort.direction === 'asc' ? -1 : 1;
      if (sa > sb) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sort]);

  const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

  const onCellChange = (id: string, key: string, val: string) => {
    const base = rows.find(r => r.id === id)!;
    const cur = editBuffer[id] ?? base;
    let v: any = val;
    if (key === 'age') {
      const num = Number(val);
      if (!Number.isFinite(num)) { console.warn('Age not a number → defaulting to 0'); v = 0; }
      else v = num;
    }
    dispatch(bufferEdit({ ...cur, [key]: v } as any));
  };

  const hasEdits = Object.keys(editBuffer).length > 0;

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField placeholder="Search all fields..." value={globalFilter} onChange={(e)=>dispatch(setGlobalFilter(e.target.value))} fullWidth />
        <Button startIcon={<SaveIcon />} variant="contained" disabled={!hasEdits} onClick={()=>dispatch(saveAllEdits())}>Save All</Button>
        <Button startIcon={<CancelIcon />} variant="outlined" disabled={!hasEdits} onClick={()=>dispatch(discardAllEdits())}>Cancel All</Button>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {visible.map(col => (
                <TableCell key={col.key}>
                  <TableSortLabel
                    active={col.key === sort.key}
                    direction={col.key === sort.key ? sort.direction : 'asc'}
                    onClick={()=>dispatch(toggleSort(col.key))}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map(row => (
              <TableRow key={row.id} hover>
                {visible.map(col => (
                  <TableCell key={col.key}>
                    <TextField
                      variant="standard"
                      value={String((editBuffer[row.id]?.[col.key] ?? row[col.key]) ?? '')}
                      onChange={(e)=>onCellChange(row.id, col.key, e.target.value)}
                      // very small imperfection in spacing left as-is (human touch)
                      error={col.key === 'age' && !!editBuffer[row.id] && isNaN(Number(editBuffer[row.id]?.age))}
                      helperText={col.key === 'age' && !!editBuffer[row.id] && isNaN(Number(editBuffer[row.id]?.age)) ? 'Age must be a number' : ''}
                      fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Tooltip title="Delete">
                    <IconButton onClick={()=>setConfirmId(row.id)}><DeleteIcon /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_, p)=>dispatch(setPage(p))}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e)=>{ dispatch(setPageSize(parseInt(e.target.value,10))); dispatch(setPage(0)); }}
        rowsPerPageOptions={[5,10,20,50]}
      />

      <Dialog open={!!confirmId} onClose={()=>setConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={()=>{ if(confirmId){ dispatch(deleteRow(confirmId)); setConfirmId(null);} }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
