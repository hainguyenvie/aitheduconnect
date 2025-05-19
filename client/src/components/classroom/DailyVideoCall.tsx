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
        callRef.current = DailyIframe.createFrame(videoRef.current as HTMLElement, {
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
    <div className="relative w-full h-full">
      {/* Video container fills all space */}
      <div ref={videoRef} className="absolute inset-0 w-full h-full bg-black" />
      {/* Small Exit Room Button, bottom right, round icon */}
      <button
        onClick={handleLeaveCall}
        className="absolute bottom-3 right-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
        title="Thoát phòng"
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DailyVideoCall; 