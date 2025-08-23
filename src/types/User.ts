export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER';
  is_active: boolean;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER';
  is_active?: boolean;
}
