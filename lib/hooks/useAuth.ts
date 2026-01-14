/**
 * Authentication Hook
 * Manages authentication state and user data
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', {
        credentials: 'include', // Ensure cookies are sent
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data.data;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent/received
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      return res.json();
    },
    onSuccess: async (response) => {
      // Immediately update the query cache with user data from login response
      if (response?.data?.user) {
        queryClient.setQueryData(['auth', 'me'], response.data.user);
      }
      // Refetch to ensure we have the latest data and cookie is set
      await queryClient.refetchQueries({ queryKey: ['auth', 'me'] });
      toast.success('Logged in successfully');
      // Use router.push to preserve React Query cache instead of hard redirect
      router.push('/admin');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });
      if (!res.ok) {
        throw new Error('Logout failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      router.push('/login');
      toast.success('Logged out successfully');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}

