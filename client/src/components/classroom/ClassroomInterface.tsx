import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  MessageSquare, 
  ScreenShare, 
  StopCircle, 
  Loader2,
  PanelLeftOpen, 
  PanelLeftClose,
  Settings,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import DailyVideoCall from './DailyVideoCall';
import { createDailyRoom, getDailyRoom } from '@/lib/daily';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/ui/Logo';
import { useClassroomUI } from '@/App';

interface ClassroomInterfaceProps {
  bookingId: string;
  teacherMode?: boolean;
}

const ClassroomInterface = ({ bookingId, teacherMode = false }: ClassroomInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { inClass, setInClass } = useClassroomUI();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string; time: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Fetch booking details and create/join Daily.co room
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Fetch booking details from the API (fetch all columns)
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;

        // Get or create Daily.co room
        let roomUrl = await getDailyRoom(bookingId);
        if (!roomUrl) {
          roomUrl = await createDailyRoom(bookingId);
        }

          setBookingDetails({
          ...booking,
          roomUrl,
          });
          setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin buổi học. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    setInClass(true);
    return () => setInClass(false);
  }, [setInClass]);

  const handleLeaveCall = () => {
    // In a real implementation, this would end the WebRTC connection and redirect
    toast({
      title: 'Kết thúc buổi học',
      description: 'Cảm ơn bạn đã tham gia buổi học này',
      duration: 3000,
    });

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = teacherMode ? '/dashboard/teacher' : '/dashboard/student';
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
          <p className="text-white mt-4 text-xl">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-900">
        <div className="text-center text-white">
          <p className="text-red-500 text-2xl mb-4">⚠️ {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[9999]">
      <DailyVideoCall
        roomUrl={bookingDetails?.roomUrl}
        isTeacher={teacherMode}
        onLeaveCall={handleLeaveCall}
      />
    </div>
  );
};

export default ClassroomInterface;