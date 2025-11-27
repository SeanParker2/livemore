
export interface Post {
  id: number;
  created_at: string;
  title: string;
  content: string;
  slug: string;
  is_premium: boolean;
  summary: string;
  status: 'draft' | 'published' | 'archived';
  author: Profile;
  tags: { id: number; name: string; slug: string }[];
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  billing_status: string;
}
