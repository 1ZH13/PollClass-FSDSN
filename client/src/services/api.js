const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('pollclass_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || 'API request failed');
  }
  return body;
}

export const api = {
  request,
};

export { request };

export const polls = {
  list: () => request('/polls'),
  create: (payload) => request('/polls', { method: 'POST', body: JSON.stringify(payload) }),
  getById: (id) => request(`/polls/${id}`),
  getByCode: (code) => request(`/polls/code/${code}`),
  close: (id) => request(`/polls/${id}/close`, { method: 'PATCH' }),
  remove: (id) => request(`/polls/${id}`, { method: 'DELETE' }),
  vote: (id, payload) => request(`/polls/${id}/vote`, { method: 'POST', body: JSON.stringify(payload) }),
  results: (id) => request(`/polls/${id}/results`),
};
