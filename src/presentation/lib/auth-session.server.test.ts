// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthCookie,
  expireAuthSession,
  readAuthCookie,
  writeAuthCookie,
} from './auth-session';

describe('auth-session on the server', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not access browser cookies', () => {
    expect(readAuthCookie()).toBeNull();
    expect(writeAuthCookie({ accessToken: 'token', user: { id: '1', role: 'comunidade', user_metadata: {} } })).toBeUndefined();
    expect(clearAuthCookie()).toBeUndefined();
    expect(expireAuthSession()).toBeUndefined();
  });

  it('redirects an expired browser session from another page', () => {
    const assign = vi.fn();
    const dispatchEvent = vi.fn();
    vi.stubGlobal('window', {
      dispatchEvent,
      location: { pathname: '/profile', assign },
    });

    expireAuthSession('/login');

    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: AUTH_SESSION_EXPIRED_EVENT,
    }));
    expect(assign).toHaveBeenCalledWith('/login');
  });
});
