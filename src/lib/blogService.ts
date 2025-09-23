import { supabase } from './supabase'
import { BlogPost, CreateBlogPost, UpdateBlogPost } from '@/types/Blog'

export class BlogService {
  static async getAll(): Promise<BlogPost[]> {
    if (!supabase) throw new Error('Database connection not available')
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async getPublished(): Promise<BlogPost[]> {
    if (!supabase) throw new Error('Database connection not available')
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async create(payload: CreateBlogPost): Promise<BlogPost> {
    if (!supabase) throw new Error('Database connection not available')
    const { data, error } = await supabase
      .from('blogs')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data as BlogPost
  }

  static async update(id: string, updates: UpdateBlogPost): Promise<BlogPost> {
    if (!supabase) throw new Error('Database connection not available')
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as BlogPost
  }

  static async remove(id: string): Promise<void> {
    if (!supabase) throw new Error('Database connection not available')
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}


