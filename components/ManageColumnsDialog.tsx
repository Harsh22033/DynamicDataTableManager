'use client';
import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormGroup, FormControlLabel, Checkbox, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addColumn, setColumnVisibility } from '@/redux/tableSlice';

export default function ManageColumnsDialog({ open, onClose }:{ open:boolean; onClose:()=>void; }) {
  const cols = useAppSelector(s => s.table.columns);
  const dispatch = useAppDispatch();

  const [key, setKey] = React.useState('');
  const [label, setLabel] = React.useState('');

  const addNew = () => {
    if (!key.trim() || !label.trim()) return;
    dispatch(addColumn({ key: key.trim(), label: label.trim() }));
    setKey(''); setLabel('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
          <TextField label="Field key (e.g., department)" value={key} onChange={e=>setKey(e.target.value)} fullWidth />
          <TextField label="Label (e.g., Department)" value={label} onChange={e=>setLabel(e.target.value)} fullWidth />
          <Button onClick={addNew} variant="contained">Add</Button>
        </Stack>
        <FormGroup>
          {cols.map(c => (
            <FormControlLabel
              key={c.key}
              control={<Checkbox checked={c.visible} onChange={(e)=>dispatch(setColumnVisibility({ key: c.key, visible: e.target.checked }))} />}
              label={c.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
