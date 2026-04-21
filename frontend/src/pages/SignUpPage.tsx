import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../services/api';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'user';
}

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: any) => {
    setForm(prev => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!form.email.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // Store token if provided
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect to login or dashboard
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              helperText="Minimum 6 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                label="Role"
                onChange={handleRoleChange}
                disabled={loading}
              >
                <MenuItem value="user">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUpPage;
