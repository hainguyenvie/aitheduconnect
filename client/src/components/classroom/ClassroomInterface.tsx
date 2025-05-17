import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
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

interface ClassroomInterfaceProps {
  bookingId: number;
  teacherMode?: boolean;
}

const ClassroomInterface = ({ bookingId, teacherMode = false }: ClassroomInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string; time: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const selfVideoRef = useRef<HTMLVideoElement>(null);

  // Mock participants data for demo
  const participants = [
    {
      id: 1,
      name: teacherMode ? 'Nguyễn Văn A (Học viên)' : 'Trần Thị B (Giáo viên)',
      avatar: '',
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: true,
    },
    {
      id: 2,
      name: teacherMode ? 'Bạn (Giáo viên)' : 'Bạn (Học viên)',
      avatar: user?.avatar || '',
      isSpeaking: true,
      isVideoOn: isVideoOn,
      isAudioOn: isAudioOn,
    }
  ];

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch booking details from the API
        // For demo, we'll use mock data
        setTimeout(() => {
          setBookingDetails({
            id: bookingId,
            title: 'Buổi học Tiếng Anh cơ bản - Ngữ pháp và từ vựng',
            teacher: {
              id: 1,
              name: 'Trần Thị B',
              avatar: '',
            },
            student: {
              id: 2,
              name: 'Nguyễn Văn A',
              avatar: '',
            },
            scheduledStartTime: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
            scheduledEndTime: new Date(Date.now() + 50 * 60000).toISOString(), // 50 minutes from now
            status: 'in-progress',
          });
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Không thể tải thông tin buổi học. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Simulate video stream setup
  useEffect(() => {
    // Mock setup of video streams
    // In a real implementation, this would use WebRTC
    const setupMockVideoStream = () => {
      if (selfVideoRef.current) {
        selfVideoRef.current.poster = 'https://placekitten.com/300/200';
      }
      if (mainVideoRef.current) {
        mainVideoRef.current.poster = 'https://placekitten.com/800/450';
      }
    };

    if (!loading && !error) {
      setupMockVideoStream();
    }
  }, [loading, error]);

  // Add default chat messages
  useEffect(() => {
    if (!loading && !error) {
      const initialMessages = [
        {
          sender: teacherMode ? 'Nguyễn Văn A' : 'Trần Thị B',
          message: 'Xin chào, tôi đã sẵn sàng cho buổi học!',
          time: '12:05',
        },
        {
          sender: 'Bạn',
          message: 'Chào bạn, tôi cũng đã sẵn sàng',
          time: '12:06',
        },
      ];
      setChatMessages(initialMessages);
    }
  }, [loading, error, teacherMode]);

  // Scroll to bottom when new chat messages are added
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        sender: 'Bạn',
        message: messageInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessageInput('');
  };

  const toggleAudio = () => {
    // In a real implementation, this would toggle the actual audio stream
    setIsAudioOn(!isAudioOn);
    toast({
      title: !isAudioOn ? 'Đã bật micrô' : 'Đã tắt micrô',
      duration: 2000,
    });
  };

  const toggleVideo = () => {
    // In a real implementation, this would toggle the actual video stream
    setIsVideoOn(!isVideoOn);
    toast({
      title: !isVideoOn ? 'Đã bật camera' : 'Đã tắt camera',
      duration: 2000,
    });
  };

  const toggleScreenShare = () => {
    // In a real implementation, this would handle actual screen sharing
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: !isScreenSharing ? 'Đang chia sẻ màn hình' : 'Đã dừng chia sẻ màn hình',
      duration: 2000,
    });
  };

  const handleEndCall = () => {
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
        {/* Main video area */}
        <div className={`flex-1 flex flex-col relative ${isSidebarOpen ? 'pr-80' : ''}`}>
          {/* Main video stream */}
          <div className="flex-1 bg-neutral-950 flex items-center justify-center">
            <video
              ref={mainVideoRef}
              className="w-full h-full object-contain"
              poster={isScreenSharing ? '/path-to-screen-share-placeholder.jpg' : undefined}
              autoPlay
              playsInline
              muted
            ></video>
          </div>

          {/* Self video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden">
            <video
              ref={selfVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            ></video>
            {!isVideoOn && (
              <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Control bar */}
          <div className="bg-neutral-900 text-white p-3 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-12 w-12 ${!isAudioOn ? 'bg-red-500/20 text-red-500' : 'hover:bg-neutral-800'}`}
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-500/20 text-red-500' : 'hover:bg-neutral-800'}`}
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-12 w-12 ${isScreenSharing ? 'bg-green-500/20 text-green-500' : 'hover:bg-neutral-800'}`}
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? <StopCircle size={20} /> : <ScreenShare size={20} />}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={handleEndCall}
              >
                <PhoneOff size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - only visible if isSidebarOpen is true */}
        {isSidebarOpen && (
          <div className="w-80 bg-neutral-900 flex flex-col border-l border-neutral-800">
            <Tabs 
              defaultValue="participants" 
              className="flex-1 flex flex-col"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 bg-neutral-800">
                <TabsTrigger 
                  value="participants"
                  className="data-[state=active]:bg-neutral-700"
                >
                  <Users size={16} className="mr-2" />
                  <span>Thành viên</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="data-[state=active]:bg-neutral-700"
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span>Trò chuyện</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="whiteboard"
                  className="data-[state=active]:bg-neutral-700"
                >
                  <Edit3 size={16} className="mr-2" />
                  <span>Bảng</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="flex-1 flex flex-col p-0">
                <div className="p-4 text-sm text-white">
                  <h3 className="font-medium mb-2">Trong buổi học ({participants.length})</h3>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div 
                        key={participant.id} 
                        className={`flex items-center justify-between p-2 rounded ${
                          participant.isSpeaking ? 'bg-neutral-800' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{participant.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          {!participant.isAudioOn && <MicOff size={16} className="text-red-500" />}
                          {!participant.isVideoOn && <VideoOff size={16} className="text-red-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {teacherMode && (
                  <div className="mt-auto p-4 border-t border-neutral-800">
                    <h3 className="font-medium mb-2 text-white text-sm">Tùy chọn</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Settings size={14} className="mr-1" />
                        Quản lý quyền
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Ghi buổi học
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col p-0 overflow-hidden">
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
                
                <div className="p-3 border-t border-neutral-800 mt-auto">
                  <div className="flex space-x-2">
                    <Input
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Nhập tin nhắn..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      Gửi
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="whiteboard" className="flex-1 p-4">
                <div className="h-full flex items-center justify-center bg-white rounded-lg">
                  <div className="text-center p-4">
                    <Edit3 size={48} className="mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-neutral-800 font-medium">Bảng trắng tương tác</h3>
                    <p className="text-neutral-600 text-sm mt-2">
                      Tính năng này đang được phát triển và sẽ sớm ra mắt.
                    </p>
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