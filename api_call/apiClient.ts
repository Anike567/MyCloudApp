import axios from 'axios';
import { emitLogout } from './../utility/authEvent';

const API_END_POINT = process.env.EXPO_PUBLIC_API_END_POINT as string;

const apiClient = axios.create({

  baseURL: API_END_POINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logic: If the token is dead and refresh fails (or you aren't using refresh)
      emitLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;