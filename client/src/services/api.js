const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('zestora_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Menu & Categories
  getCategories: () => request('/categories'),
  getMenuItems: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/menu${query ? `?${query}` : ''}`);
  },
  getMenuItemById: (id) => request(`/menu/${id}`),
  getFeaturedDishes: () => request('/menu/featured'),

  // Reservations
  createReservation: (body) => request('/reservations', { method: 'POST', body: JSON.stringify(body) }),
  lookupReservation: (code) => request(`/reservations/lookup/${code}`),
  getMyReservations: () => request('/reservations/my'),

  // Orders
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrderByNumber: (orderNumber) => request(`/orders/track/${orderNumber}`),
  getMyOrders: () => request('/orders/my'),
  validateCoupon: (code, orderSubtotal) => request('/orders/validate-coupon', {
    method: 'POST',
    body: JSON.stringify({ code, orderSubtotal }),
  }),

  // Reviews
  getReviews: () => request('/reviews'),
  createReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Admin Portal
  getAdminStats: () => request('/admin/stats'),
  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, orderStatus, note) => request(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ orderStatus, note }),
  }),
  getAdminReservations: () => request('/admin/reservations'),
  updateReservationStatus: (id, status, tableNumber) => request(`/admin/reservations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, tableNumber }),
  }),
  createMenuItem: (body) => request('/admin/menu', { method: 'POST', body: JSON.stringify(body) }),
  updateMenuItem: (id, body) => request(`/admin/menu/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMenuItem: (id) => request(`/admin/menu/${id}`, { method: 'DELETE' }),
  getAdminCustomers: () => request('/admin/customers'),
};
