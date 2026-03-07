import axios from 'axios';
import { emitLogout } from './../utility/authEvent';
import getWideVineID from '../utility/getWideVineID';

const API_END_POINT = process.env.EXPO_PUBLIC_API_END_POINT as string;

const apiClient = axios.create({
  baseURL: API_END_POINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Global Request Interceptor for Headers
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const deviceId = await getWideVineID();
      
      // Ensure headers object exists
      config.headers = config.headers || {};
      
      // ✅ Set the header explicitly using the set method if available, 
      // or direct assignment
      config.headers['x-device-id'] = String(deviceId);
      
      console.log("Interceptor set x-device-id to:", deviceId); // Debug on mobile
    } catch (e) {
      console.error("Interceptor: Could not fetch deviceId", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      emitLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;