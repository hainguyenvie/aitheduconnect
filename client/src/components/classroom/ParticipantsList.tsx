import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreVertical,
  Volume2,
  Volume,
  UserPlus
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'teacher' | 'student' | 'assistant';
  isTeacher: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
}

interface ParticipantsListProps {
  socketRef: React.MutableRefObject<Socket | null>;
  participantCount: number;
}

const ParticipantsList = ({ socketRef, participantCount }: ParticipantsListProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Generate sample participants data
  useEffect(() => {
    // In a real app, this would come from the server via socket
    const sampleParticipants: Participant[] = [
      {
        id: '1',
        name: 'Nguyễn Văn A (Giáo viên)',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        role: 'teacher',
        isTeacher: true,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false
      },
      {
        id: '2',
        name: user?.fullName || 'Bạn',
        avatar: user?.avatar,
        role: 'student',
        isTeacher: false,
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false
      },
      {
        id: '3',
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        role: 'student',
        isTeacher: false,
        isMuted: true,
        isVideoOff: true,
        isScreenSharing: false,
        isHandRaised: true
      },
      {
        id: '4',
        name: 'Lê Văn C',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        role: 'student',
        isTeacher: false,
        isMuted: false,
        isVideoOff: true,
        isScreenSharing: false,
        isHandRaised: false
      }
    ];
    
    setParticipants(sampleParticipants);
  }, [user]);
  
  // Listen for participant updates from server
  useEffect(() => {
    if (!socketRef.current) return;
    
    socketRef.current.on('participant-joined', (participant: Participant) => {
      setParticipants(prev => [...prev, participant]);
    });
    
    socketRef.current.on('participant-left', (participantId: string) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    });
    
    socketRef.current.on('participant-updated', (updatedParticipant: Participant) => {
      setParticipants(prev => 
        prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
      );
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('participant-joined');
        socketRef.current.off('participant-left');
        socketRef.current.off('participant-updated');
      }
    };
  }, [socketRef.current]);
  
  // Toggle participant's microphone
  const toggleMicrophone = (participantId: string) => {
    setParticipants(prev => 
      prev.map(p => {
        if (p.id === participantId) {
          return { ...p, isMuted: !p.isMuted };
        }
        return p;
      })
    );
    
    // Notify server
    if (socketRef.current) {
      socketRef.current.emit('toggle-participant-mic', participantId);
    }
  };
  
  // Toggle participant's camera
  const toggleCamera = (participantId: string) => {
    setParticipants(prev => 
      prev.map(p => {
        if (p.id === participantId) {
          return { ...p, isVideoOff: !p.isVideoOff };
        }
        return p;
      })
    );
    
    // Notify server
    if (socketRef.current) {
      socketRef.current.emit('toggle-participant-camera', participantId);
    }
  };
  
  // Remove participant (teacher only)
  const removeParticipant = (participantId: string) => {
    if (confirm('Bạn có chắc muốn loại người này khỏi lớp học không?')) {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      
      // Notify server
      if (socketRef.current) {
        socketRef.current.emit('remove-participant', participantId);
      }
    }
  };
  
  // Send invitation link
  const sendInvitation = (email: string) => {
    // In a real app, this would send an invitation email or link
    console.log(`Sending invitation to ${email}`);
    
    // Notify server
    if (socketRef.current) {
      socketRef.current.emit('send-invitation', { email });
    }
    
    setIsInviteDialogOpen(false);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium">Người tham gia ({participantCount || participants.length})</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center"
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          <span>Mời</span>
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <ul className="divide-y">
          {participants.map((participant) => (
            <li key={participant.id} className="p-3 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {participant.isHandRaised && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                        ✋
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <p className="text-sm font-medium">{participant.name}</p>
                    <div className="flex items-center mt-1">
                      {participant.role === 'teacher' && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 mr-1 bg-blue-50 text-blue-700 border-blue-200">
                          Giáo viên
                        </Badge>
                      )}
                      
                      {participant.isScreenSharing && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 mr-1 bg-purple-50 text-purple-700 border-purple-200">
                          Đang chia sẻ
                        </Badge>
                      )}
                      
                      {participant.isMuted && (
                        <MicOff className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      
                      {participant.isVideoOff && (
                        <VideoOff className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleMicrophone(participant.id)}
                  >
                    {participant.isMuted ? (
                      <MicOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Mic className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleCamera(participant.id)}
                  >
                    {participant.isVideoOff ? (
                      <VideoOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Video className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => toggleMicrophone(participant.id)}
                      >
                        {participant.isMuted ? (
                          <>
                            <Volume2 className="h-4 w-4 mr-2" />
                            <span>Bật micro</span>
                          </>
                        ) : (
                          <>
                            <Volume className="h-4 w-4 mr-2" />
                            <span>Tắt micro</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleCamera(participant.id)}
                      >
                        {participant.isVideoOff ? (
                          <>
                            <Video className="h-4 w-4 mr-2" />
                            <span>Bật camera</span>
                          </>
                        ) : (
                          <>
                            <VideoOff className="h-4 w-4 mr-2" />
                            <span>Tắt camera</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      {participant.role !== 'teacher' && (
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => removeParticipant(participant.id)}
                        >
                          <span>Loại khỏi lớp học</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Invite dialog would be implemented here */}
    </div>
  );
};

export default ParticipantsList;