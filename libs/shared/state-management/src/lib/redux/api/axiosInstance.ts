import axios from 'axios';

const base_URL = import.meta.env.VITE_BASE_URL;
console.log(base_URL)

export const axiosInstance = axios.create({
  baseURL: `${base_URL}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables automatic HTTPOnly cookie sending for JWT authentication
});
