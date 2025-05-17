import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import ClassroomInterface from '@/components/classroom/ClassroomInterface';

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

  // Verify booking exists
  useEffect(() => {
    const verifyBooking = async () => {
      try {
        // In a real app, you would verify the booking exists and belongs to the user
        // For this demo, we'll accept any ID
        if (!id || isNaN(Number(id))) {
          setError('ID buổi học không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tìm thấy buổi học');
      }
    };

    if (isAuthenticated && !isLoading) {
      verifyBooking();
    }
  }, [id, isAuthenticated, isLoading]);

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
        <title>Buổi học trực tuyến | EduViet</title>
        <meta name="description" content="Lớp học trực tuyến trên EduViet" />
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
        bookingId={Number(id)} 
        teacherMode={user?.role === 'teacher'} 
      />
    </>
  );
};

export default ClassroomPage;