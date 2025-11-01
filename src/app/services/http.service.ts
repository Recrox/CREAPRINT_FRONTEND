import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';

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
    try {
      if (token) localStorage.setItem('auth_token', token);
      else localStorage.removeItem('auth_token');
      // notify app that token changed
      try { window.dispatchEvent(new CustomEvent('auth-token-changed', { detail: { token } })); } catch {}
    } catch {}
  }

  static getToken(): string | null {
    try { return localStorage.getItem('auth_token'); } catch { return null; }
  }

  static setRefreshToken(token: string | null) {
    try {
      if (token) localStorage.setItem('refresh_token', token);
      else localStorage.removeItem('refresh_token');
      try { window.dispatchEvent(new CustomEvent('auth-refresh-token-changed', { detail: { token } })); } catch {}
    } catch {}
  }

  static getRefreshToken(): string | null {
    try { return localStorage.getItem('refresh_token'); } catch { return null; }
  }
}

// Automatic refresh handling for 401 responses
let isRefreshing = false as boolean;
let refreshPromise: Promise<string | null> | null = null;

sharedAxiosInstance.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = (error && error.config) ? error.config : undefined;
    if (!originalRequest) return Promise.reject(error);

    // avoid infinite loop
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        // no refresh token -> can't refresh. Clear any stored tokens so UI knows to logout.
        try { TokenService.setToken(null); TokenService.setRefreshToken(null); } catch {}
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            // attempt JSON refresh first
            const resp = await axios.post(environment.apiBaseUrl + '/api/User/token/refresh', { refresh_token: refreshToken }, { headers: { 'Content-Type': 'application/json' } });
            const data = resp?.data;
            const newAccess = data?.access_token || data?.token || data?.accessToken;
            const newRefresh = data?.refresh_token || data?.refreshToken || data?.refresh;
            if (typeof newAccess === 'string' && newAccess.length > 10) TokenService.setToken(newAccess);
            if (typeof newRefresh === 'string') TokenService.setRefreshToken(newRefresh);
            return newAccess || null;
          } catch (err) {
            // refresh failed -> clear tokens
            try { TokenService.setToken(null); TokenService.setRefreshToken(null); } catch {}
            throw err;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      try {
        await refreshPromise;
        originalRequest._retry = true;
        // attach new token
        const t = TokenService.getToken();
        if (t) originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${t}` };
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
