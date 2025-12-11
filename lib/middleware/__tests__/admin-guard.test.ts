import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '../admin-guard';
import { authGuard } from '../auth-guard';

// Mock authGuard to verify it's called
vi.mock('../auth-guard', () => ({
  authGuard: vi.fn().mockResolvedValue(new NextResponse('Auth Guard Response')),
}));

describe('adminGuard', () => {
  const ADMIN_KEY = 'secret-key';
  
  beforeEach(() => {
    process.env.ADMIN_ACCESS_KEY = ADMIN_KEY;
    vi.clearAllMocks();
  });

  it('redirects to home if admin_session cookie is missing', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/admin'));
    // No cookies set

    const res = await adminGuard(req);

    expect(res.status).toBe(307); // Default redirect status
    expect(res.headers.get('Location')).toBe('http://localhost:3000/');
    expect(authGuard).not.toHaveBeenCalled();
  });

  it('redirects to home if admin_session cookie is incorrect', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/admin'));
    req.cookies.set('admin_session', 'wrong-key');

    const res = await adminGuard(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toBe('http://localhost:3000/');
    expect(authGuard).not.toHaveBeenCalled();
  });

  it('calls authGuard if admin_session cookie is correct', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/admin'));
    req.cookies.set('admin_session', ADMIN_KEY);

    const res = await adminGuard(req);

    expect(authGuard).toHaveBeenCalledWith(req);
    // Should return what authGuard returns
    expect(await res.text()).toBe('Auth Guard Response');
  });
});
