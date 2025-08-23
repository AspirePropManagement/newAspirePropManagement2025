import { useState, useEffect, useCallback } from 'react';
import { User, UserFormData, UserUpdateData } from '@/types/User';
import * as userService from '@/lib/userService';

/**
 * Custom hook for managing users with CRUD operations
 */
export const useUserManagement = (role?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches users based on role or all users if no role specified
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = role 
        ? await userService.getUsersByRole(role)
        : await userService.getAllUsers();
      
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [role]);

  /**
   * Creates a new user
   */
  const createUser = useCallback(async (userData: UserFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await userService.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing user
   */
  const updateUser = useCallback(async (id: string, userData: UserUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a user
   */
  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggles user active status
   */
  const toggleUserStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.toggleUserStatus(id, isActive);
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refreshes the user list
   */
  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshUsers,
    fetchUsers
  };
};
