export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const withApi = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
