import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalise errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

// ----------------------------------------------------------------
// Customers
// ----------------------------------------------------------------
export const customerAPI = {
  list:      (params)     => api.get('/customers',         { params }),
  get:       (id)         => api.get(`/customers/${id}`),
  create:    (data)       => api.post('/customers',        data),
  update:    (id, data)   => api.put(`/customers/${id}`,   data),
  remove:    (id)         => api.delete(`/customers/${id}`),
  analytics: ()           => api.get('/customers/analytics'),
};

export default api;
