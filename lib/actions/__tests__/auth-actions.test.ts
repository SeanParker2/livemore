import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithMagicLink } from '../auth-actions';

// Mock dependencies
const { mockSignInWithOtp } = vi.hoisted(() => {
  const mockSignInWithOtp = vi.fn();
  return { mockSignInWithOtp };
});

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  }),
}));

describe('signInWithMagicLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if email is invalid', async () => {
    const formData = new FormData();
    formData.append('email', 'invalid-email');

    const result = await signInWithMagicLink(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('无效的邮箱地址');
    expect(result.errors).toHaveProperty('email');
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('should return success if email is valid and supabase call succeeds', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await signInWithMagicLink(null, formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain('请检查您的邮箱');
    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: expect.objectContaining({
        emailRedirectTo: expect.stringContaining('/auth/callback'),
      }),
    });
  });

  it('should return error if supabase call fails', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: { message: 'Supabase error' } });
    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await signInWithMagicLink(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('用户认证失败，请稍后重试');
  });
});
