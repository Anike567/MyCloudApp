import axios from 'axios';

const API_END_POINT = process.env.EXPO_PUBLIC_API_END_POINT as string;

const apiClient = axios.create({
  baseURL: API_END_POINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;