import api from './api';

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    }),
};

export const employeesService = {
  getAll: () => api.get('/employees'),

  getById: (id: string) => api.get(`/employees/${id}`),

  create: (data: { email: string; name: string; default_password?: string }) =>
    api.post('/employees', data),

  update: (id: string, data: { email?: string; name?: string }) =>
    api.patch(`/employees/${id}`, data),

  delete: (id: string) => api.delete(`/employees/${id}`),

  resetPassword: (id: string, password?: string) =>
    api.post(`/employees/${id}/reset-password`, { password }),
};

export const reviewsService = {
  getAll: (filters?: any) =>
    api.get('/reviews', { params: filters }),

  getById: (id: string) => api.get(`/reviews/${id}`),

  create: (data: any) => api.post('/reviews', data),

  update: (id: string, data: any) =>
    api.patch(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),

  submitFeedback: (id: string, feedback: string) =>
    api.post(`/reviews/${id}/feedback`, { feedback }),

  updateStatus: (id: string, status: string) =>
    api.patch(`/reviews/${id}/status`, { status }),
};
