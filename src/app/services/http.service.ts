import axios, { AxiosInstance } from 'axios';

// Shared axios instance used by ApiClient so we can attach interceptors centrally
export const sharedAxiosInstance: AxiosInstance = axios.create();

// Attach Authorization header from localStorage token (key: 'auth_token')
sharedAxiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      if (!config.headers) (config as any).headers = {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
});

export class TokenService {
  static setToken(token: string | null) {
    try { if (token) localStorage.setItem('auth_token', token); else localStorage.removeItem('auth_token'); } catch {}
  }

  static getToken(): string | null {
    try { return localStorage.getItem('auth_token'); } catch { return null; }
  }
}
