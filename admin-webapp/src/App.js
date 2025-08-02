import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Layout
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import Riders from './pages/Riders';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const isAuthenticated = true; // TODO: Get from Redux store

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/restaurants" element={<Restaurants />} />
                      <Route path="/riders" element={<Riders />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </AdminLayout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
