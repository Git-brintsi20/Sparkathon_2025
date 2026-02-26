import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Set auth token on API client
const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data.data;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthHeader(token);
    return { token, user };
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data.data;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthHeader(token);
    return { token, user };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore error on logout
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setAuthHeader(null);
  },

  async getStoredAuth(): Promise<{ token: string; user: User } | null> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const userStr = await AsyncStorage.getItem(USER_KEY);
    if (token && userStr) {
      setAuthHeader(token);
      return { token, user: JSON.parse(userStr) };
    }
    return null;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};

export default authService;
