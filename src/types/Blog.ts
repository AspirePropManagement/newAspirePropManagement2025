export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_REVIEW';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  // base64 featured image stored in DB
  featured_image_data?: string | null;
  // legacy/path fallback if needed
  featured_image_url?: string | null;
  author_id: string;
  status: BlogStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  view_count?: number | null;
  like_count?: number | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_pinned?: boolean | null;
  reading_time_minutes?: number | null;
}

export interface CreateBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featured_image_data?: string | null; // base64
  featured_image_url?: string | null;
  author_id?: string; // required by DB, provided at create
  status?: BlogStatus;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_pinned?: boolean | null;
}

export interface UpdateBlogPost {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  featured_image_data?: string | null; // base64
  featured_image_url?: string | null;
  status?: BlogStatus;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_pinned?: boolean | null;
  published_at?: string | null;
}


