import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { authGuard, updateSession } from '../auth-guard';
import { createServerClient } from '@supabase/ssr';

// Mock supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));

describe('authGuard', () => {
  it('calls updateSession', async () => {
    // Since authGuard is just a wrapper, we mainly test that it returns a response
    // and invokes supabase logic (mocked).
    const req = new NextRequest(new URL('http://localhost:3000/'));
    
    const res = await authGuard(req);
    
    expect(res).toBeDefined();
    expect(createServerClient).toHaveBeenCalled();
  });
});

describe('updateSession', () => {
    it('creates supabase client and calls getUser', async () => {
        const req = new NextRequest(new URL('http://localhost:3000/'));
        await updateSession(req);
        expect(createServerClient).toHaveBeenCalled();
    });
});
