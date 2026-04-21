import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert } from '@mui/material';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';

export const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(oldPassword, newPassword);
      setSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Paper elevation={2} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>

          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ marginBottom: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Change Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
