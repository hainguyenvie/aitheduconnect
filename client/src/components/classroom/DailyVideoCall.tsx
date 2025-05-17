import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface DailyVideoCallProps {
  roomUrl: string;
  isTeacher: boolean;
  onLeaveCall: () => void;
}

const DailyVideoCall = ({ roomUrl, isTeacher, onLeaveCall }: DailyVideoCallProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<any>(null);
  const { toast } = useToast();
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Daily.co call
    const initCall = async () => {
      try {
        callRef.current = DailyIframe.createFrame(videoRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '8px',
          },
          showLeaveButton: false,
          showLocalVideo: true,
          showParticipantsBar: true,
          showFullscreenButton: true,
        });

        // Set up event listeners
        callRef.current
          .on('joined-meeting', () => {
            toast({
              title: 'Đã tham gia lớp học',
              description: 'Kết nối thành công!',
            });
          })
          .on('error', (error: any) => {
            toast({
              title: 'Lỗi kết nối',
              description: error.errorMsg || 'Đã xảy ra lỗi khi kết nối',
              variant: 'destructive',
            });
          });

        // Join the call
        await callRef.current.join({ url: roomUrl });
      } catch (error: any) {
        toast({
          title: 'Lỗi khởi tạo',
          description: error.message || 'Không thể khởi tạo cuộc gọi',
          variant: 'destructive',
        });
      }
    };

    initCall();

    // Cleanup
    return () => {
      if (callRef.current) {
        callRef.current.destroy();
      }
    };
  }, [roomUrl, toast]);

  const toggleAudio = () => {
    if (callRef.current) {
      callRef.current.setLocalAudio(!isAudioOn);
      setIsAudioOn(!isAudioOn);
    }
  };

  const toggleVideo = () => {
    if (callRef.current) {
      callRef.current.setLocalVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const handleLeaveCall = () => {
    if (callRef.current) {
      callRef.current.leave();
    }
    onLeaveCall();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video container */}
      <div ref={videoRef} className="flex-1 bg-black rounded-lg overflow-hidden" />

      {/* Controls */}
      <div className="flex justify-center space-x-4 p-4 bg-neutral-900">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={!isAudioOn ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={!isVideoOn ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleLeaveCall}
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DailyVideoCall; 