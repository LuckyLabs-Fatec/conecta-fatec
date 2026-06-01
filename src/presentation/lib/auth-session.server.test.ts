// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { clearAuthCookie, readAuthCookie, writeAuthCookie } from './auth-session';

describe('auth-session on the server', () => {
  it('does not access browser cookies', () => {
    expect(readAuthCookie()).toBeNull();
    expect(writeAuthCookie({ accessToken: 'token', user: { id: '1', role: 'comunidade', user_metadata: {} } })).toBeUndefined();
    expect(clearAuthCookie()).toBeUndefined();
  });
});
