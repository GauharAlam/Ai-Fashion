// frontend/services/authService.ts
import axios from 'axios';
import type { AuthUser } from '../types';

const API_URL = 'http://localhost:5000/api/auth/';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};


export const register = async (name: string, email: string, password: string, role: 'user' | 'admin'): Promise<AuthUser> => {
  const response = await axios.post(API_URL + 'register', { name, email, password, role });
    if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
  }
  return await getCurrentUser();
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await axios.post(API_URL + 'login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
  }
  return await getCurrentUser();
};

export const logout = (): void => {
  localStorage.removeItem('token');
  setAuthToken(null);
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    try {
        const res = await axios.get(API_URL + 'me');
        return res.data;
    } catch (err) {
        console.error(err);
        logout(); // Token might be invalid
        return null;
    }
  }
  return null;
};

// Add this to your existing authService.ts file

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(API_URL + userId);
  } catch (err) {
    console.error('Error deleting user:', err);
    // Re-throw the error to be handled by the component
    throw err;
  }
};

// Add this to your existing authService.ts file

export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err; // Re-throw the error to be handled by the component
  }
};