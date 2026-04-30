import api from './api';

export const eventService = {
  getAll: () => api.get('/events').then((r) => r.data),
  getById: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (data) => api.post('/events', data).then((r) => r.data),
  update: (id, data) => api.put(`/events/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}`).then((r) => r.data),
};

export const venueService = {
  getAll: () => api.get('/venues').then((r) => r.data),
  getById: (id) => api.get(`/venues/${id}`).then((r) => r.data),
  create: (data) => api.post('/venues', data).then((r) => r.data),
  update: (id, data) => api.put(`/venues/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/venues/${id}`).then((r) => r.data),
};

export const attendeeService = {
  getAll: () => api.get('/attendees').then((r) => r.data),
  getByEvent: (eventId) =>
    api.get(`/events/${eventId}/attendees`).then((r) => r.data),
  create: (data) => api.post('/attendees', data).then((r) => r.data),
  update: (id, data) => api.put(`/attendees/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/attendees/${id}`).then((r) => r.data),
};

export const sponsorService = {
  getAll: () => api.get('/sponsors').then((r) => r.data),
  getByEvent: (eventId) =>
    api.get(`/events/${eventId}/sponsors`).then((r) => r.data),
  create: (data) => api.post('/sponsors', data).then((r) => r.data),
  update: (id, data) => api.put(`/sponsors/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/sponsors/${id}`).then((r) => r.data),
};
