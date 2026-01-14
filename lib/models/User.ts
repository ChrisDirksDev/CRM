/**
 * User Model
 * Handles authentication and user management with Supabase
 */

import { supabaseAdmin } from '@/lib/db/connect';
import bcrypt from 'bcryptjs';

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface IUserInsert {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'editor';
}

export interface IUserUpdate {
  email?: string;
  password?: string;
  name?: string;
  role?: 'admin' | 'editor';
}

// Hash password before saving
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare passwords
export async function comparePassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

// User operations
export const User = {
  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) return null;
    return data as IUser;
  },

  // Find user by ID
  async findById(id: string): Promise<IUser | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as IUser;
  },

  // Create user
  async create(userData: IUserInsert): Promise<IUser> {
    const hashedPassword = await hashPassword(userData.password);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        name: userData.name.trim(),
        role: userData.role || 'admin',
      })
      .select()
      .single();

    if (error) throw error;
    return data as IUser;
  },

  // Update user
  async update(id: string, userData: IUserUpdate): Promise<IUser> {
    const updateData: any = { ...userData };
    
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
    }
    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IUser;
  },

  // Delete user
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export default User;
