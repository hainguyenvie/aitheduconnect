import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import ClassroomInterface from '@/components/classroom/ClassroomInterface';
import { supabase } from '@/lib/supabaseClient';

const ClassroomPage = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation(`/login?redirect=classroom/${id}`);
    }
  }, [isLoading, isAuthenticated, id, setLocation]);

  // Verify booking exists and user has access
  useEffect(() => {
    const verifyBooking = async () => {
      try {
        if (!id || !user) {
          setError('ID buổi học không hợp lệ');
          return;
        }
        const { data, error } = await supabase
          .from('bookings')
          .select('id, student_id, teacher_id')
          .eq('id', id)
          .single();
        if (error || !data) {
          setError('ID buổi học không hợp lệ');
          return;
        }
        // Only allow access if user is student or teacher of this booking
        if (data.student_id !== user.id && data.teacher_id !== user.id) {
          setError('Bạn không có quyền truy cập buổi học này.');
        }
      } catch (err) {
        setError('Không thể tìm thấy buổi học');
      }
    };

    if (isAuthenticated && !isLoading) {
      verifyBooking();
    }
  }, [id, isAuthenticated, isLoading, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <p className="mb-6">Buổi học yêu cầu không tồn tại hoặc bạn không có quyền truy cập.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.history.back()}
        >
          Quay lại
        </button>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Buổi học trực tuyến | AithEduConnect</title>
        <meta name="description" content="Lớp học trực tuyến trên AithEduConnect" />
        <style>
          {`
            body {
              overflow: hidden;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </Helmet>

      <ClassroomInterface 
        bookingId={id}
        teacherMode={user?.role === 'teacher'} 
      />
    </>
  );
};

export default ClassroomPage;