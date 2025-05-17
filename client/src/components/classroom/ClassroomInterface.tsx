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

interface ClassroomInterfaceProps {
  bookingId: string;
  teacherMode?: boolean;
}

const ClassroomInterface = ({ bookingId, teacherMode = false }: ClassroomInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
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
    <div className="h-screen bg-black flex flex-col">
      {/* Top bar with call info */}
      <div className="bg-neutral-900 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
          <h2 className="ml-2 text-lg font-medium truncate">
            {bookingDetails?.title || 'Buổi học trực tuyến'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs">
            Đang live
          </span>
          <span className="text-xs">
            {bookingDetails && new Date(bookingDetails.scheduledEndTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            kết thúc
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className={`flex-1 ${isSidebarOpen ? 'mr-80' : ''} transition-all duration-300`}>
          {bookingDetails?.roomUrl && (
            <DailyVideoCall
              roomUrl={bookingDetails.roomUrl}
              isTeacher={teacherMode}
              onLeaveCall={handleLeaveCall}
            />
          )}
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start p-2">
                <TabsTrigger value="participants" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Người tham gia
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="flex-1 p-4">
                {/* Participants list would go here */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={bookingDetails?.teacher?.avatar} />
                      <AvatarFallback>{bookingDetails?.teacher?.name?.[0]}</AvatarFallback>
                          </Avatar>
                    <div>
                      <p className="font-medium">{bookingDetails?.teacher?.name}</p>
                      <p className="text-sm text-neutral-400">Giáo viên</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={bookingDetails?.student?.avatar} />
                      <AvatarFallback>{bookingDetails?.student?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bookingDetails?.student?.name}</p>
                      <p className="text-sm text-neutral-400">Học viên</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col p-0">
                <div 
                  ref={messageContainerRef} 
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                >
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{msg.sender}</span>
                        <span className="text-neutral-400 text-xs">{msg.time}</span>
                      </div>
                      <p className="mt-1 text-white">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-neutral-800">
                  <div className="flex space-x-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1"
                    />
                    <Button>Gửi</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomInterface;