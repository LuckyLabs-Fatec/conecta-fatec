'use client';

import axios from 'axios';
import { expireAuthSession, readAuthCookie } from './auth-session';

const baseURL = (typeof window !== 'undefined')
  ? (process.env.NEXT_PUBLIC_CONECTA_FATEC_URL ?? '')
  : (process.env.CONECTA_FATEC_URL ?? '');

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach access token from auth cookie if present
client.interceptors.request.use((config) => {
  try {
    const session = readAuthCookie();

    if (session?.accessToken) {
      config.headers = config.headers ?? {};
      // standard Bearer header; server may also get cookie automatically
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${session.accessToken}`;
    }
  } catch {
    // ignore
  }

  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.data) {
      const payload = error.response.data;
      const message = (payload && (payload.error || payload.message)) || error.message;

      if (
        error.response.status === 401
        && typeof message === 'string'
        && message.toLowerCase() === 'invalid or expired token'
      ) {
        expireAuthSession('/');
      }

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);

export default client;
