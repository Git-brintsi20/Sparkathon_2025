// Centralized API service for React Native mobile app
import axios from 'axios';
import { Platform } from 'react-native';

// 10.0.2.2 = Android emulator localhost bridge; iOS simulator uses localhost
const DEFAULT_URL = Platform.OS === 'ios' ? 'http://localhost:3000/api' : 'http://10.0.2.2:3000/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
