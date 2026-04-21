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
} from '@mui/material';
import { reviewsService, employeesService } from '../services';

interface Review {
  id: string;
  assignee_id: string;
  reviewer_id: string;
  description: string;
  status: string;
  due_date: string;
  assignee: { name: string; email: string };
  reviewer: { name: string; email: string };
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    assignee_id: '',
    reviewer_id: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, employeesRes] = await Promise.all([
        reviewsService.getAll(),
        employeesService.getAll(),
      ]);
      setReviews(reviewsRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setEditingId(review.id);
      setFormData({
        assignee_id: review.assignee_id,
        reviewer_id: review.reviewer_id,
        description: review.description || '',
        due_date: review.due_date ? review.due_date.split('T')[0] : '',
      });
    } else {
      setEditingId(null);
      setFormData({ assignee_id: '', reviewer_id: '', description: '', due_date: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await reviewsService.update(editingId, formData);
      } else {
        await reviewsService.create(formData);
      }
      fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save review');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await reviewsService.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete review');
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5">Performance Reviews</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Create Review
        </Button>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Assignee</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.assignee?.name}</TableCell>
                <TableCell>{review.reviewer?.name}</TableCell>
                <TableCell>{review.status}</TableCell>
                <TableCell>{review.due_date ? review.due_date.split('T')[0] : '-'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleOpenDialog(review)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(review.id)}
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
        <DialogTitle>{editingId ? 'Edit Review' : 'Create Review'}</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <TextField
            label="Assignee (Employee Being Reviewed)"
            select
            fullWidth
            margin="normal"
            value={formData.assignee_id}
            onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select assignee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Reviewer (Person Giving Feedback)"
            select
            fullWidth
            margin="normal"
            value={formData.reviewer_id}
            onChange={(e) => setFormData({ ...formData, reviewer_id: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select reviewer</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Description (Review Topic)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
