import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPost } from '../admin-actions';

// Mock dependencies
const { mockFrom, mockGet, mockSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  
  const queryBuilder = {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: mockSingle,
  };
  
  const mockFrom = vi.fn(() => queryBuilder);
  const mockGet = vi.fn();
  
  return { mockFrom, mockGet, mockSingle };
});

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn().mockReturnValue({ from: mockFrom }),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: mockGet,
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    batch: {
      send: vi.fn().mockResolvedValue({ data: [], error: null }),
    },
  })),
}));

describe('createPost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if user is not admin', async () => {
    // Mock unauthorized
    mockGet.mockReturnValue({ value: 'invalid-key' });
    process.env.ADMIN_ACCESS_KEY = 'valid-key';

    const formData = new FormData();
    const result = await createPost(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toContain('拒绝访问');
  });

  it('should fail if validation fails', async () => {
    // Mock authorized
    mockGet.mockReturnValue({ value: 'valid-key' });
    process.env.ADMIN_ACCESS_KEY = 'valid-key';

    const formData = new FormData();
    // Missing required fields
    
    const result = await createPost(null, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('输入数据无效');
    expect(result.errors).toBeDefined();
  });

  it('should succeed with valid data', async () => {
    // Mock authorized
    mockGet.mockReturnValue({ value: 'valid-key' });
    process.env.ADMIN_ACCESS_KEY = 'valid-key';

    // Mock sequence:
    // 1. getFounderAuthorId -> single() -> founder
    // 2. check slug -> single() -> null (no conflict)
    // 3. insert post -> single() -> post data
    mockSingle
      .mockResolvedValueOnce({ data: { id: 'founder-id' }, error: null })
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: { id: 1, slug: 'test-post' }, error: null });

    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('slug', 'test-post');
    formData.append('summary', 'Test summary');
    formData.append('content', 'Test content');
    formData.append('published_at', new Date().toISOString());
    formData.append('is_premium', 'false');
    formData.append('broadcast_email', 'false');

    const result = await createPost(null, formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('文章已成功发布！');
  });
});
