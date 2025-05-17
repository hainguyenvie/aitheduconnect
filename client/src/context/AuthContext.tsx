import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch current user and profile from Supabase
  const fetchUserProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;
    // Try to fetch profile from 'profiles' table
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    // If profile does not exist, create it now
    if (profileError || !profile) {
      // Try to create a minimal profile
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: user.user_metadata?.fullName || user.user_metadata?.full_name || user.email || '',
          avatar: user.user_metadata?.avatar_url || null,
          role: user.user_metadata?.role || 'student',
          created_at: new Date().toISOString(),
        },
      ]);
      if (!insertError) {
        // Try fetching again
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = newProfile;
      }
    }
    if (!profile) return null;
    return {
      id: user.id,
      username: profile.username || '',
      fullName: profile.full_name || '',
      email: user.email,
      role: profile.role || 'student',
      avatar: profile.avatar || '',
      bio: profile.bio || '',
    } as User;
  };

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: fetchUserProfile,
    staleTime: 0,
    retry: false,
  });

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      await refetch();
      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn quay trở lại!',
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Đăng nhập thất bại',
        description: err.message || 'Đã xảy ra lỗi',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      // Sign up with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role,
          },
        },
      });
      if (signUpError) throw signUpError;
      toast({
        title: 'Đăng ký thành công',
        description: 'Vui lòng xác nhận email trước khi đăng nhập.',
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Đăng ký thất bại',
        description: err.message || 'Đã xảy ra lỗi',
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      queryClient.setQueryData(['/api/auth/me'], null);
      toast({
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại!',
      });
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Đăng xuất thất bại',
        description: err.message || 'Đã xảy ra lỗi',
        variant: 'destructive',
      });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;