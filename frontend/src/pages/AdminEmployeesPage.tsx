import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { employeesService } from '../services';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const AdminEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', default_password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeesService.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({ name: employee.name, email: employee.email, default_password: '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', default_password: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await employeesService.update(editingId, {
          name: formData.name,
          email: formData.email,
        });
      } else {
        await employeesService.create(formData);
      }
      fetchEmployees();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save employee');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesService.delete(id);
        fetchEmployees();
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete employee';
        if (errorMsg.includes('foreign key constraint')) {
          setErrorMessage('Cannot delete this employee because they have reviews assigned to them. Please delete or reassign their reviews first.');
        } else {
          setErrorMessage(errorMsg);
        }
        setOpenErrorDialog(true);
      }
    }
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm('Reset password to default?')) {
      try {
        await employeesService.resetPassword(id);
        alert('Password reset to Default@123');
      } catch (err) {
        console.error('Failed to reset password');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5">Employees</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Employee
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleOpenDialog(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleResetPassword(emp.id)}
                  >
                    Reset Pass
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {!editingId && (
            <TextField
              label="Default Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.default_password}
              onChange={(e) =>
                setFormData({ ...formData, default_password: e.target.value })
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
