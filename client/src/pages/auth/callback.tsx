import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;

        toast({
          title: 'Xác thực thành công',
          description: 'Bạn đã xác thực email thành công!',
        });

        // Redirect to home page after successful verification
        setLocation('/');
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast({
          title: 'Lỗi xác thực',
          description: error.message || 'Đã xảy ra lỗi trong quá trình xác thực.',
          variant: 'destructive',
        });
        setLocation('/auth/login');
      }
    };

    handleAuthCallback();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý xác thực...</h1>
        <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
} 