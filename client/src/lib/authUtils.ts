// Mock user for testing purposes until the auth system is fully connected
export const MOCK_USER = {
  id: 999,
  username: 'student1',
  fullName: 'Học Sinh Demo',
  email: 'student@example.com',
  role: 'student' as const,
  avatar: 'https://ui-avatars.com/api/?name=H+S&background=6d28d9&color=fff',
  bio: 'Tôi là học sinh đang cần tìm giáo viên để học thêm.'
};

// Helper for storing auth state in localStorage
export const authStorage = {
  setUser: (user: any) => {
    if (user) {
      localStorage.setItem('aitheduconnect_user', JSON.stringify(user));
    }
  },
  getUser: () => {
    const userJson = localStorage.getItem('aitheduconnect_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  clearUser: () => {
    localStorage.removeItem('aitheduconnect_user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('aitheduconnect_user');
  }
};