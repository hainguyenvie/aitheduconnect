import { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import RecordRTC from 'recordrtc';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  StopCircle,
  Maximize,
  Minimize,
  Users,
  MessageSquare,
  PencilRuler,
  Files,
  Settings,
  Camera,
  Layout,
  LayoutGrid,
  User,
  UserPlus,
  CircleAlert,
  VideoIcon,
  Copy
} from "lucide-react";
import Whiteboard from '@/components/classroom/Whiteboard';
import ChatPanel from '@/components/classroom/ChatPanel';
import ParticipantsList from '@/components/classroom/ParticipantsList';
import FileSharing from '@/components/classroom/FileSharing';

// Define interfaces
interface Peer {
  id: string;
  peer: SimplePeer.Instance;
  stream: MediaStream;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

// Main component
const ClassroomPage = () => {
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const secondCameraRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Peer[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const secondStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  
  // State
  const [peers, setPeers] = useState<Peer[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSecondCameraActive, setIsSecondCameraActive] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('participants');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'focus' | 'grid'>('default');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Set up initial connection
  useEffect(() => {
    // Generate a random room ID if one doesn't exist
    if (!roomId) {
      const generatedId = Math.random().toString(36).substr(2, 9);
      setRoomId(generatedId);
    }
    
    // Get available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      })
      .catch(err => {
        console.error('Error enumerating devices:', err);
      });
    
    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (secondStreamRef.current) {
        secondStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current?.getBlob();
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aithedu-recording-${new Date().toISOString()}.webm`;
            a.click();
          }
        });
      }
    };
  }, []);
  
  // Join room function
  const joinRoom = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined },
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      
      // Connect to socket server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:5000`;
      socketRef.current = io(wsUrl);
      
      // Socket events
      socketRef.current.on('connect', () => {
        setIsConnected(true);
        
        // Join room
        socketRef.current?.emit('join-room', { 
          roomId, 
          userId: user?.id || 'anonymous',
          userName: user?.fullName || 'Người dùng ẩn danh'
        });
        
        setIsJoinDialogOpen(false);
        
        toast({
          title: "Đã kết nối thành công",
          description: `Phòng học: ${roomId}`,
        });
      });
      
      socketRef.current.on('user-joined', ({ userId, userName }) => {
        const peer = createPeer(userId, socketRef.current?.id || '', stream);
        
        peersRef.current.push({
          id: userId,
          peer,
          stream: new MediaStream(),
          name: userName,
          isMuted: false,
          isVideoOff: false
        });
        
        setPeers(prevPeers => [...prevPeers, {
          id: userId,
          peer,
          stream: new MediaStream(),
          name: userName,
          isMuted: false,
          isVideoOff: false
        }]);
        
        setParticipantCount(prevCount => prevCount + 1);
        
        toast({
          title: "Người dùng đã tham gia",
          description: `${userName} đã vào phòng học`,
        });
      });
      
      socketRef.current.on('receiving-signal', ({ userId, signal }) => {
        const item = peersRef.current.find(p => p.id === userId);
        if (item) {
          item.peer.signal(signal);
        }
      });
      
      socketRef.current.on('user-left', userId => {
        const peerObj = peersRef.current.find(p => p.id === userId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        
        const peers = peersRef.current.filter(p => p.id !== userId);
        peersRef.current = peers;
        setPeers(peers);
        
        setParticipantCount(prevCount => Math.max(0, prevCount - 1));
      });
      
      socketRef.current.on('user-toggle-audio', ({ userId, isMuted }) => {
        setPeers(prevPeers => 
          prevPeers.map(peer => {
            if (peer.id === userId) {
              return { ...peer, isMuted };
            }
            return peer;
          })
        );
      });
      
      socketRef.current.on('user-toggle-video', ({ userId, isVideoOff }) => {
        setPeers(prevPeers => 
          prevPeers.map(peer => {
            if (peer.id === userId) {
              return { ...peer, isVideoOff };
            }
            return peer;
          })
        );
      });
      
      socketRef.current.on('error', (error) => {
        toast({
          title: "Lỗi kết nối",
          description: error,
          variant: "destructive",
        });
      });
    } catch (err) {
      console.error('Error joining room:', err);
      toast({
        title: "Không thể tham gia phòng học",
        description: "Vui lòng kiểm tra quyền truy cập camera và microphone",
        variant: "destructive",
      });
    }
  };
  
  // Create peer connection
  const createPeer = (userId: string, callerId: string, stream: MediaStream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream
    });
    
    peer.on('signal', signal => {
      socketRef.current?.emit('sending-signal', { userId, callerId, signal });
    });
    
    peer.on('stream', stream => {
      setPeers(prevPeers => 
        prevPeers.map(p => {
          if (p.id === userId) {
            return { ...p, stream };
          }
          return p;
        })
      );
    });
    
    return peer;
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
      
      // Notify other users
      socketRef.current?.emit('toggle-audio', {
        userId: socketRef.current.id,
        isMuted: !isMuted
      });
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
      
      // Notify other users
      socketRef.current?.emit('toggle-video', {
        userId: socketRef.current.id,
        isVideoOff: !isVideoOff
      });
    }
  };
  
  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Replace the screen stream with the camera stream
      if (streamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
        
        // Replace the stream in all peers
        peersRef.current.forEach(peerObj => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              peerObj.peer.replaceTrack(
                screenStreamRef.current?.getTracks()[0] || new MediaStreamTrack(),
                track,
                streamRef.current
              );
            });
          }
        });
      }
      
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        // Save reference to screen stream
        screenStreamRef.current = screenStream;
        
        // Update local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Replace the stream in all peers
        peersRef.current.forEach(peerObj => {
          if (streamRef.current) {
            const videoTrack = screenStream.getVideoTracks()[0];
            const audioTrack = streamRef.current.getAudioTracks()[0];
            
            if (videoTrack) {
              peerObj.peer.replaceTrack(
                streamRef.current.getVideoTracks()[0],
                videoTrack,
                streamRef.current
              );
            }
          }
        });
        
        // Add a listener for when user stops screen sharing via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenSharing();
        };
        
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
        toast({
          title: "Không thể chia sẻ màn hình",
          description: "Vui lòng thử lại hoặc kiểm tra quyền truy cập",
          variant: "destructive",
        });
      }
    }
  };
  
  // Toggle second camera
  const toggleSecondCamera = async () => {
    if (isSecondCameraActive) {
      // Stop second camera
      if (secondStreamRef.current) {
        secondStreamRef.current.getTracks().forEach(track => track.stop());
        secondStreamRef.current = null;
      }
      
      if (secondCameraRef.current) {
        secondCameraRef.current.srcObject = null;
      }
      
      setIsSecondCameraActive(false);
    } else {
      try {
        // Get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        if (cameras.length <= 1) {
          toast({
            title: "Không tìm thấy camera thứ hai",
            description: "Vui lòng kết nối thêm camera để sử dụng tính năng này",
            variant: "destructive",
          });
          return;
        }
        
        // Find a different camera than the one currently in use
        const currentCameraId = selectedCamera;
        const secondCameraId = cameras.find(camera => camera.deviceId !== currentCameraId)?.deviceId;
        
        if (!secondCameraId) {
          toast({
            title: "Không thể kết nối camera thứ hai",
            description: "Không tìm thấy camera thứ hai khả dụng",
            variant: "destructive",
          });
          return;
        }
        
        // Get stream from second camera
        const secondStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: secondCameraId } },
          audio: false // No audio from second camera
        });
        
        secondStreamRef.current = secondStream;
        
        if (secondCameraRef.current) {
          secondCameraRef.current.srcObject = secondStream;
        }
        
        setIsSecondCameraActive(true);
      } catch (err) {
        console.error('Error activating second camera:', err);
        toast({
          title: "Không thể kích hoạt camera thứ hai",
          description: "Vui lòng kiểm tra kết nối camera",
          variant: "destructive",
        });
      }
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current?.getBlob();
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aithedu-recording-${new Date().toISOString()}.webm`;
            a.click();
          }
        });
      }
      
      setIsRecording(false);
      setRecordingTime(0);
    } else {
      // Start recording
      if (streamRef.current) {
        const recorder = new RecordRTC(streamRef.current, {
          type: 'video',
          mimeType: 'video/webm',
          bitsPerSecond: 128000
        });
        
        recorder.startRecording();
        recorderRef.current = recorder;
        
        // Start timer
        const startTime = Date.now();
        const timerInterval = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setRecordingTime(elapsedSeconds);
        }, 1000);
        
        // Save interval ID for cleanup
        (recorderRef.current as any).timerInterval = timerInterval;
        
        setIsRecording(true);
        
        toast({
          title: "Đang ghi lại buổi học",
          description: "Buổi học đang được ghi lại. Nhấn nút dừng để hoàn tất.",
        });
      }
    }
  };
  
  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    
    return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Could not enable fullscreen mode:', err);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  // Change view mode
  const changeViewMode = (mode: 'default' | 'focus' | 'grid') => {
    setViewMode(mode);
  };
  
  // Copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        toast({
          title: "Đã sao chép",
          description: "Mã phòng đã được sao chép vào clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy room ID:', err);
      });
  };
  
  // Hang up
  const hangUp = () => {
    // Disconnect from socket
    socketRef.current?.disconnect();
    
    // Stop all streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (secondStreamRef.current) {
      secondStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Stop recording if active
    if (isRecording && recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `aithedu-recording-${new Date().toISOString()}.webm`;
          a.click();
        }
      });
      
      // Clear recording timer
      if ((recorderRef.current as any).timerInterval) {
        clearInterval((recorderRef.current as any).timerInterval);
      }
    }
    
    // Go back to home page
    window.location.href = '/';
  };
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Join Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tham gia lớp học trực tuyến</DialogTitle>
            <DialogDescription>
              Nhập mã phòng học hoặc tạo phòng mới để bắt đầu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Nhập mã phòng..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              
              <Button
                variant="outline"
                onClick={() => {
                  const generatedId = Math.random().toString(36).substr(2, 9);
                  setRoomId(generatedId);
                }}
              >
                Tạo mới
              </Button>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Chọn camera:</p>
              <Select
                value={selectedCamera}
                onValueChange={setSelectedCamera}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn camera" />
                </SelectTrigger>
                <SelectContent>
                  {availableCameras.map((camera) => (
                    <SelectItem key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={joinRoom}
              disabled={!roomId.trim()}
              className="bg-primary"
            >
              Tham gia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Header */}
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">Lớp học trực tuyến</h1>
          <div className="ml-4 flex items-center text-sm bg-gray-100 px-2 py-1 rounded-md">
            <span className="text-gray-600 mr-1">Mã phòng:</span>
            <span className="font-medium">{roomId}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={copyRoomId}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="flex items-center bg-red-50 text-red-600 px-2 py-1 rounded-md mr-2">
              <CircleAlert className="h-4 w-4 mr-1 animate-pulse text-red-500" />
              <span className="text-xs font-medium">{formatRecordingTime(recordingTime)}</span>
            </div>
          )}
          
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => changeViewMode('default')}
                    disabled={viewMode === 'default'}
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chế độ mặc định</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => changeViewMode('focus')}
                    disabled={viewMode === 'focus'}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chế độ tập trung</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => changeViewMode('grid')}
                    disabled={viewMode === 'grid'}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chế độ lưới</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullScreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Videos area */}
        <div className={`flex-1 p-4 ${viewMode === 'focus' ? 'flex items-center justify-center' : ''}`}>
          <div 
            className={`h-full ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col space-y-4'
            }`}
          >
            {/* Main video area */}
            <div 
              className={`${
                viewMode === 'focus' 
                  ? 'w-full max-w-4xl aspect-video'
                  : viewMode === 'grid' 
                    ? 'aspect-video' 
                    : 'h-3/4'
              } bg-black rounded-lg overflow-hidden relative`}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {(isMuted || isVideoOff) && (
                <div className="absolute bottom-3 left-3 flex space-x-1">
                  {isMuted && (
                    <div className="bg-red-500 text-white p-1 rounded-full">
                      <MicOff className="h-4 w-4" />
                    </div>
                  )}
                  {isVideoOff && (
                    <div className="bg-red-500 text-white p-1 rounded-full">
                      <VideoOff className="h-4 w-4" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {user?.fullName || 'Bạn'} {isScreenSharing && '(Đang chia sẻ màn hình)'}
              </div>
              
              {isRecording && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
                  <span className="animate-pulse mr-1">●</span>
                  <span className="text-xs">REC</span>
                </div>
              )}
            </div>
            
            {/* Second camera */}
            {isSecondCameraActive && (
              <div className={`${
                viewMode === 'grid' ? 'aspect-video' : 'h-1/4'
              } bg-black rounded-lg overflow-hidden relative`}>
                <video
                  ref={secondCameraRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  Camera Thứ Hai
                </div>
              </div>
            )}
            
            {/* Other participants */}
            {peers.map((peer) => (
              <div 
                key={peer.id} 
                className={`${
                  viewMode === 'grid' ? 'aspect-video' : 'h-1/4'
                } bg-black rounded-lg overflow-hidden relative`}
              >
                <video
                  autoPlay
                  playsInline
                  ref={node => {
                    if (node) node.srcObject = peer.stream;
                  }}
                  className={`w-full h-full object-cover ${peer.isVideoOff ? 'hidden' : ''}`}
                />
                
                {peer.isVideoOff && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {(peer.isMuted || peer.isVideoOff) && (
                  <div className="absolute bottom-3 left-3 flex space-x-1">
                    {peer.isMuted && (
                      <div className="bg-red-500 text-white p-1 rounded-full">
                        <MicOff className="h-4 w-4" />
                      </div>
                    )}
                    {peer.isVideoOff && (
                      <div className="bg-red-500 text-white p-1 rounded-full">
                        <VideoOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {peer.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="w-80 bg-white border-l flex flex-col">
          <Tabs 
            defaultValue="participants" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                <span>Người tham gia</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Trò chuyện</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="participants" className="flex-1 overflow-hidden">
              <ParticipantsList 
                socketRef={socketRef} 
                participantCount={participantCount + 1} // +1 for self
              />
            </TabsContent>
            
            <TabsContent value="chat" className="flex-1 overflow-hidden">
              <ChatPanel 
                socketRef={socketRef}
                user={user}
              />
            </TabsContent>
            
            <TabsContent value="whiteboard" className="flex-1 overflow-hidden">
              <Whiteboard 
                socketRef={socketRef}
              />
            </TabsContent>
            
            <TabsContent value="files" className="flex-1 overflow-hidden">
              <FileSharing 
                socketRef={socketRef}
              />
            </TabsContent>
          </Tabs>
          
          {/* Extra Tools */}
          <div className="border-t p-2">
            <div className="grid grid-cols-4 gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-full ${activeTab === 'whiteboard' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveTab(activeTab === 'whiteboard' ? 'participants' : 'whiteboard')}
                    >
                      <PencilRuler className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bảng vẽ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-full ${activeTab === 'files' ? 'bg-muted' : ''}`}
                      onClick={() => setActiveTab(activeTab === 'files' ? 'participants' : 'files')}
                    >
                      <Files className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tài liệu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-full"
                      onClick={toggleRecording}
                    >
                      {isRecording ? (
                        <StopCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <VideoIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRecording ? 'Dừng ghi hình' : 'Ghi hình'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-full ${isSettingsOpen ? 'bg-muted' : ''}`}
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cài đặt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {isSettingsOpen && (
              <div className="mt-2 p-2 border rounded-md bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Cài đặt nhanh</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={toggleSecondCamera}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    <span>{isSecondCameraActive ? 'Tắt camera thứ hai' : 'Bật camera thứ hai'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      // Generate an invite link
                      const inviteLink = `${window.location.origin}/classroom?roomId=${roomId}`;
                      navigator.clipboard.writeText(inviteLink)
                        .then(() => {
                          toast({
                            title: "Đã sao chép liên kết mời",
                            description: "Bạn có thể chia sẻ liên kết này để mời người khác tham gia",
                          });
                        });
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Sao chép liên kết mời</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom controls */}
      <div className="bg-white border-t p-3 flex justify-center items-center">
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-full ${isMuted ? 'bg-red-100 text-red-500 border-red-200' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff /> : <Mic />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? 'Bật microphone' : 'Tắt microphone'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-full ${isVideoOff ? 'bg-red-100 text-red-500 border-red-200' : ''}`}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff /> : <Video />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVideoOff ? 'Bật camera' : 'Tắt camera'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-full ${isScreenSharing ? 'bg-purple-100 text-purple-500 border-purple-200' : ''}`}
                  onClick={toggleScreenSharing}
                >
                  <ScreenShare />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isScreenSharing ? 'Dừng chia sẻ màn hình' : 'Chia sẻ màn hình'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="destructive"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={hangUp}
          >
            <PhoneOff />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;