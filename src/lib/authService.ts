import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER' | 'OWNER';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AgentProfile {
  firm_name: string;
  rera_id?: string;
}

export interface OwnerProfile {
  properties_count: number;
  primary_location?: string;
}

export interface BuilderProfile {
  company_name: string;
  rera_id?: string;
  years_of_experience: number;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER' | 'OWNER';
  agent_profile?: AgentProfile;
  owner_profile?: OwnerProfile;
  builder_profile?: BuilderProfile;
}

/**
 * Simple authentication service using Supabase database directly
 */
class AuthService {
  /**
   * Authenticates a user by email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Query the users table directly
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('Database error:', error);
        return { success: false, error: 'Database connection failed' };
      }

      if (!users || users.length === 0) {
        return { success: false, error: 'Account not found. Please sign up first.' };
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid password' };
      }

      // Remove password_hash from user object
      const { password_hash, ...userWithoutPassword } = user;
      
      return { success: true, user: userWithoutPassword as User };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Registers a new user
   */
  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .limit(1);

      if (checkError) {
        console.error('Database error:', checkError);
        return { success: false, error: 'Database connection failed' };
      }

      if (existingUsers && existingUsers.length > 0) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(data.password, saltRounds);

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: data.email,
          password_hash: passwordHash,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          role: data.role || 'BUYER',
          is_active: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return { success: false, error: 'Failed to create account' };
      }

      // Create role-specific profile if provided
      if (data.role === 'AGENT' && data.agent_profile) {
        const { error: agentError } = await supabase
          .from('agent_profiles')
          .insert({
            user_id: newUser.id,
            firm_name: data.agent_profile.firm_name,
            rera_id: data.agent_profile.rera_id
          });

        if (agentError) {
          console.error('Agent profile creation error:', agentError);
          // Continue anyway as user is created
        }
      } else if (data.role === 'OWNER' && data.owner_profile) {
        const { error: ownerError } = await supabase
          .from('owner_profiles')
          .insert({
            user_id: newUser.id,
            properties_count: data.owner_profile.properties_count,
            primary_location: data.owner_profile.primary_location
          });

        if (ownerError) {
          console.error('Owner profile creation error:', ownerError);
          // Continue anyway as user is created
        }
      } else if (data.role === 'BUILDER' && data.builder_profile) {
        const { error: builderError } = await supabase
          .from('builder_profiles')
          .insert({
            user_id: newUser.id,
            company_name: data.builder_profile.company_name,
            rera_id: data.builder_profile.rera_id,
            years_of_experience: data.builder_profile.years_of_experience
          });

        if (builderError) {
          console.error('Builder profile creation error:', builderError);
          // Continue anyway as user is created
        }
      }

      // Remove password_hash from user object
      const { password_hash, ...userWithoutPassword } = newUser;
      
      return { success: true, user: userWithoutPassword as User };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Gets user by ID
   */
  async getUserById(id: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        return { success: false, error: 'User not found' };
      }

      const { password_hash, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword as User };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user' };
    }
  }

  /**
   * Updates user information
   */
  async updateUser(id: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to update user' };
      }

      const { password_hash, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword as User };
    } catch (error) {
      return { success: false, error: 'Failed to update user' };
    }
  }

  /**
   * Changes user password
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current user to verify password
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', id);

      if (updateError) {
        return { success: false, error: 'Failed to update password' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to change password' };
    }
  }
}

const authService = new AuthService();
export default authService;
