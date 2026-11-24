import axios from 'axios';

const API = axios.create({
  baseURL: 'https://onrender.com',
});

// Har request ke header mein automatic token lagane ke liye
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
