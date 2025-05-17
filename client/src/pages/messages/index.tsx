import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import ChatLayout from '@/components/chat/ChatLayout';

const MessagesPage = () => {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?redirect=/messages');
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Only render when authenticated
  if (!user) {
    return null;
  }
  
  return <ChatLayout />;
};

export default MessagesPage;