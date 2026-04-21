import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { AdminEmployeesPage } from './pages/AdminEmployeesPage';
import { AdminReviewsPage } from './pages/AdminReviewsPage';
import { EmployeeReviewsPage } from './pages/EmployeeReviewsPage';
import { ProtectedRoute } from './context/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {isAuthenticated && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Performance Review System
            </Typography>

            {user?.role === 'admin' ? (
              <>
                <Button color="inherit" onClick={() => handleNavigate('/admin/employees')}>
                  Employees
                </Button>
                <Button color="inherit" onClick={() => handleNavigate('/admin/reviews')}>
                  Reviews
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => handleNavigate('/employee/dashboard')}>
                My Reviews
              </Button>
            )}

            <Button color="inherit" onClick={() => handleNavigate('/change-password')}>
              Change Password
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminEmployeesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Box>
                <Container maxWidth="lg" sx={{ marginTop: 4 }}>
                  <Typography variant="h4">Admin Dashboard</Typography>
                  <Typography>
                    Use the menu to manage employees and performance reviews.
                  </Typography>
                </Container>
              </Box>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <EmployeeReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
