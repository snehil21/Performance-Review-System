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
  Select,
  MenuItem,
} from '@mui/material';
import { reviewsService } from '../services';
import { useAuth } from '../context/AuthContext';

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

export const EmployeeReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('todo');

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  const fetchReviews = async () => {
    try {
      if (user?.id) {
        const response = await reviewsService.getAll({ reviewer_id: user.id });
        setReviews(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (review: Review) => {
    setSelectedReview(review);
    setFeedback(review.description || '');
    setNewStatus(review.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleSubmitFeedback = async () => {
    try {
      if (selectedReview && feedback) {
        await reviewsService.submitFeedback(selectedReview.id, feedback);
        if (newStatus !== selectedReview.status) {
          await reviewsService.updateStatus(selectedReview.id, newStatus);
        }
        fetchReviews();
        handleCloseDialog();
      }
    } catch (err) {
      console.error('Failed to submit feedback');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="textSecondary">No reviews assigned yet</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Employee Being Reviewed</TableCell>
                <TableCell>Review Topic</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.assignee?.name}</TableCell>
                  <TableCell>{review.description || 'No description'}</TableCell>
                  <TableCell>{review.status}</TableCell>
                  <TableCell>{review.due_date ? review.due_date.split('T')[0] : '-'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenDialog(review)}
                    >
                      Submit Feedback
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          {selectedReview && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Employee:</strong> {selectedReview.assignee?.name}
              </Typography>

              <TextField
                label="Feedback"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <TextField
                label="Status"
                select
                fullWidth
                margin="normal"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitFeedback} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
