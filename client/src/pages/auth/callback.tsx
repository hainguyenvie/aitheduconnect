import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const upsertProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .upsert([{
            id: user.id,
            full_name: user.user_metadata.full_name || user.user_metadata.name || "",
            avatar: user.user_metadata.avatar_url || "",
            email: user.email,
            provider: user.app_metadata?.provider || "google"
          }]);
      }
      // Redirect to homepage or dashboard
      navigate("/");
    };
    upsertProfile();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Đang xác thực tài khoản Google...</div>
    </div>
  );
};

export default AuthCallback; 