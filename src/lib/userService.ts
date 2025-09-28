import { createClient } from '@supabase/supabase-js';
import { User, UserFormData, UserUpdateData } from '@/types/User';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Fetches all users from the database
 */
export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetches users by specific role
 */
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching ${role}s: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetches a single user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data;
};

/**
 * Creates a new user
 */
export const createUser = async (userData: UserFormData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

  return data;
};

/**
 * Updates an existing user
 */
export const updateUser = async (id: string, userData: UserUpdateData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }

  return data;
};

/**
 * Deletes a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

/**
 * Toggles user active status
 */
export const toggleUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating user status: ${error.message}`);
  }

  return data;
};

/**
 * Fetches pending users by role for approval
 */
export const getPendingUsersByRole = async (role: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching pending ${role}s: ${error.message}`);
  }

  return data || [];
};

/**
 * Approves a user (sets status to APPROVED)
 */
export const approveUser = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      status: 'APPROVED', 
      status_reason: null,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error approving user: ${error.message}`);
  }

  return data;
};

/**
 * Rejects a user (sets status to REJECTED)
 */
export const rejectUser = async (id: string, reason?: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      status: 'REJECTED', 
      status_reason: reason || null,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error rejecting user: ${error.message}`);
  }

  return data;
};