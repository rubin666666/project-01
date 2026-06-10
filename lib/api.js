import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://pg10-foodle-server.onrender.com',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('tasteorama-auth');
    const token = raw ? JSON.parse(raw)?.state?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = error =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
