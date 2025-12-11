import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscribeToNewsletter } from '../newsletter-actions';

// Mock Supabase
const { mockInsert, mockFrom, mockSend } = vi.hoisted(() => {
  const mockInsert = vi.fn();
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
  }));
  const mockSend = vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null });
  return { mockInsert, mockFrom, mockSend };
});

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: mockFrom,
  }),
}));

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockSend
      }
    }
  };
});

describe('subscribeToNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation error for invalid email', async () => {
    const formData = new FormData();
    formData.append('email', 'invalid-email');

    const result = await subscribeToNewsletter(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('无效的邮箱地址');
    expect(result.errors).toHaveProperty('email');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should return error if already subscribed (unique constraint)', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505' } });

    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await subscribeToNewsletter(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('您已订阅，请勿重复操作。');
  });

  it('should return generic error for other db errors', async () => {
    mockInsert.mockResolvedValue({ error: { code: 'other-error', message: 'DB Error' } });

    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await subscribeToNewsletter(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('发生错误，请稍后重试。');
  });

  it('should succeed when db insert is successful', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await subscribeToNewsletter(null, formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('订阅成功！感谢您的关注。');
    expect(mockInsert).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSend).toHaveBeenCalled();
  });

  it('should succeed even if welcome email fails', async () => {
    mockInsert.mockResolvedValue({ error: null });
    mockSend.mockRejectedValue(new Error('Email failed'));

    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await subscribeToNewsletter(null, formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('订阅成功！感谢您的关注。');
    expect(mockInsert).toHaveBeenCalled();
    // Should still have attempted to send
    expect(mockSend).toHaveBeenCalled();
  });
});
