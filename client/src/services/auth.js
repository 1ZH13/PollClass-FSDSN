import { request } from './api.js';

const TOKEN_KEY = 'pollclass_token';
const USER_KEY = 'pollclass_user';

function saveSession({ token, user }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const auth = {
  register: async (payload) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveSession(response);
    return response;
  },
  login: async (payload) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveSession(response);
    return response;
  },
  logout: () => {
    clearSession();
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
};
