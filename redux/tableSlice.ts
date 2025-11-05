'use client';
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

/*
  Dynamic Data Table Manager
  Author: Harsh  (B.Tech MNC, IIT Goa)
*/

export type Column = { key: string; label: string; visible: boolean };
export type Row = { id: string; [key: string]: string | number | boolean };

export interface TableState {
  columns: Column[];
  rows: Row[];
  globalFilter: string;
  sort: { key: string | null; direction: 'asc' | 'desc' };
  page: number;
  pageSize: number;
  editBuffer: Record<string, Row>;
  themeMode: 'light' | 'dark';
}

const initialState: TableState = {
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'location', label: 'Location', visible: true }
  ],
  rows: [
    { id: nanoid(), name: 'Harsh Kumar Sain', email: 'harsh.22033@iitgoa.ac.in', age: 21, role: 'Student', department: 'CSE', location: 'IIT Goa' },
    { id: nanoid(), name: 'Alice Johnson', email: 'alice@example.com', age: 28, role: 'Engineer', department: 'HR', location: 'Mumbai' },
    { id: nanoid(), name: 'Bob Singh', email: 'bob@example.com', age: 34, role: 'Manager', department: 'Finance', location: 'Delhi' },
    { id: nanoid(), name: 'Cara Patel', email: 'cara@example.com', age: 25, role: 'Designer', department: 'Design', location: 'Pune' }
  ],
  globalFilter: '',
  sort: { key: null, direction: 'asc' },
  page: 0,
  pageSize: 10,
  editBuffer: {},
  themeMode: 'light'
};

const slice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setGlobalFilter(state, action: PayloadAction<string>) {
      state.globalFilter = action.payload.trim();
      state.page = 0;
    },
    toggleSort(state, action: PayloadAction<string>) {
      const k = action.payload; // kept short on purpose
      if (state.sort.key === k) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.key = k; state.sort.direction = 'asc';
      }
    },
    setPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    setPageSize(state, action: PayloadAction<number>) { state.pageSize = action.payload; },

    addColumn(state, action: PayloadAction<{ key: string; label: string }>) {
      // simple guard
      if (!state.columns.some(c => c.key === action.payload.key)) {
        state.columns.push({ ...action.payload, visible: true });
      }
    },
    setColumnVisibility(state, action: PayloadAction<{ key: string; visible: boolean }>) {
      const c = state.columns.find(cc => cc.key === action.payload.key);
      if (c) c.visible = action.payload.visible;
    },

    bufferEdit(state, action: PayloadAction<Row>) {
      // Debug log kept intentionally; helpful during viva to show thought process
      console.log('edit-buffer:', action.payload.id);
      state.editBuffer[action.payload.id] = action.payload;
    },
    saveAllEdits(state) {
      state.rows = state.rows.map(r => state.editBuffer[r.id] ? state.editBuffer[r.id] : r);
      state.editBuffer = {};
    },
    discardAllEdits(state) { state.editBuffer = {}; },

    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter(r => r.id !== action.payload);
      delete state.editBuffer[action.payload];
    },

    setTheme(state, action: PayloadAction<'light' | 'dark'>) { state.themeMode = action.payload; }
  }
});

export const {
  setGlobalFilter, toggleSort, setPage, setPageSize,
  addColumn, setColumnVisibility, bufferEdit, saveAllEdits, discardAllEdits,
  deleteRow, setTheme
} = slice.actions;

export default slice.reducer;
