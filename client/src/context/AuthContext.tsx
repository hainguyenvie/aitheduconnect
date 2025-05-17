import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER, authStorage } from '@/lib/authUtils';

interface User {
  id: number;
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
  isAuthenticated: boolean; // Add isAuthenticated property
  login: (username: string, password: string) => Promise<void>;
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
  isAuthenticated: false, // Add default value
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);



  // Check if we have a user in local storage first
  const storedUser = authStorage.getUser();
  
  // Fetch current user
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        // Try to get user from localStorage first
        if (storedUser) {
          return storedUser;
        }
        
        // Return mock user for testing purposes
        return MOCK_USER;
        
        // Original authentication code will be restored later
      } catch (err) {
        // Return null on auth errors, but don't set error state
        // This allows components to handle unauthenticated state gracefully
        return null;
      }
    },
    staleTime: 0, // Make sure the data is always fresh
    retry: false, // Don't retry on failure
    initialData: storedUser // Use stored user as initial data if available
  });

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setError(null);
      // Simulating successful login for testing
      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn quay trở lại!',
      });
      
      // Set mock user data directly in React Query cache
      queryClient.setQueryData(['/api/auth/me'], MOCK_USER);
      
      // Save user to localStorage for persistence
      authStorage.setUser(MOCK_USER);
      
      return;
      
      /*
      // Original login code - commented out for testing
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }
      
      // Refetch user after login
      await refetch();
      */
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
      // Simulate successful registration for testing
      toast({
        title: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo',
      });
      
      // Set mock user data directly 
      queryClient.setQueryData(['/api/auth/me'], MOCK_USER);
      
      // Save user to localStorage for persistence
      authStorage.setUser(MOCK_USER);
      
      return;
      
      /*
      // Original registration code - commented out for testing
      const response = await apiRequest('POST', '/api/auth/register', userData);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }
      
      toast({
        title: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo',
      });
      
      // Login after registration
      await login(userData.username, userData.password);
      */
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
      
      // Clear user data from React Query cache
      queryClient.setQueryData(['/api/auth/me'], null);
      
      // Clear user data from localStorage
      authStorage.clearUser();
      
      toast({
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại!',
      });
      
      /*
      // Original logout code - commented out for testing
      await apiRequest('POST', '/api/auth/logout');
      
      // Clear user data and cache
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      */
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Đăng xuất thất bại',
        description: err.message || 'Đã xảy ra lỗi',
        variant: 'destructive',
      });
    }
  };

  // Create a proper user value to avoid TypeScript errors
  const authUser: User | null = user as User;

  // Check if user is authenticated
  const isAuthenticated = !!authUser;

  return (
    <AuthContext.Provider value={{ 
      user: authUser, 
      isLoading, 
      error, 
      isAuthenticated, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;