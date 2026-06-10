import axios from 'axios';

export const api = axios.create({
  baseURL: '',
  withCredentials: true,
  timeout: 15_000,
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
