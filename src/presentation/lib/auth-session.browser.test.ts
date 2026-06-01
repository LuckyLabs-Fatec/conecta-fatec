// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_COOKIE_KEY,
  AUTH_COOKIE_MAX_AGE,
  clearAuthCookie,
  readAuthCookie,
  writeAuthCookie,
} from './auth-session';

describe('auth-session in the browser', () => {
  const session = {
    accessToken: 'token',
    user: { id: '1', role: 'comunidade' as const, user_metadata: {} },
  };

  beforeEach(() => {
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
  });

  it('exposes the expected cookie lifetime', () => {
    expect(AUTH_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 7);
  });

  it('writes and reads a session', () => {
    writeAuthCookie(session);
    expect(readAuthCookie()).toEqual(session);
  });

  it('returns null when the cookie is absent or malformed', () => {
    expect(readAuthCookie()).toBeNull();
    document.cookie = `${AUTH_COOKIE_KEY}=invalid`;
    expect(readAuthCookie()).toBeNull();
  });

  it('clears the auth cookie', () => {
    writeAuthCookie(session);
    clearAuthCookie();
    expect(readAuthCookie()).toBeNull();
  });
});
