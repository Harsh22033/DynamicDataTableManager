'use client';
import * as React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

function ThemeWrap({ children }: { children: React.ReactNode }) {
  const mode = useSelector((s: any) => s.table.themeMode);
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);
  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ThemeWrap>{children}</ThemeWrap>
      </PersistGate>
    </Provider>
  );
}
