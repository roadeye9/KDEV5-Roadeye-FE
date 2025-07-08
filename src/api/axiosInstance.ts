import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 100000,
  withCredentials: true
});
