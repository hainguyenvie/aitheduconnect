import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, PaperclipIcon, Smile, Image } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: number | string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  isFile?: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface ChatPanelProps {
  socketRef: React.MutableRefObject<Socket | null>;
  user: any;
}

const ChatPanel = ({ socketRef, user }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Listen for incoming messages
  useEffect(() => {
    if (!socketRef.current) return;
    
    // Handle new message received
    socketRef.current.on('chat-message', (message: ChatMessage) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    // Handle file message
    socketRef.current.on('chat-file', (fileMessage: ChatMessage) => {
      setMessages(prevMessages => [...prevMessages, fileMessage]);
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('chat-message');
        socketRef.current.off('chat-file');
      }
    };
  }, [socketRef.current]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Send message
  const sendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !socketRef.current) return;
    
    const messageData = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: user?.id || 'anonymous',
      senderName: user?.fullName || 'Người dùng ẩn danh',
      senderAvatar: user?.avatar,
      text: newMessage,
      timestamp: new Date(),
    };
    
    // Add to local messages
    setMessages(prev => [...prev, messageData]);
    
    // Send to server
    socketRef.current.emit('chat-message', messageData);
    
    // Clear input
    setNewMessage('');
  };
  
  // Handle attachment button click
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Vui lòng chọn file nhỏ hơn 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target?.result;
      
      // Create file message
      const fileMessage = {
        id: Math.random().toString(36).substring(2, 9),
        senderId: user?.id || 'anonymous',
        senderName: user?.fullName || 'Người dùng ẩn danh',
        senderAvatar: user?.avatar,
        text: `Đã gửi file: ${file.name}`,
        timestamp: new Date(),
        isFile: true,
        fileUrl: fileData as string,
        fileName: file.name,
        fileType: file.type,
      };
      
      // Add to local messages
      setMessages(prev => [...prev, fileMessage]);
      
      // Send to server
      socketRef.current?.emit('chat-file', fileMessage);
    };
    
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Show attachments based on file type
  const renderAttachment = (message: ChatMessage) => {
    if (!message.isFile || !message.fileUrl) return null;
    
    const fileType = message.fileType || '';
    
    if (fileType.startsWith('image/')) {
      // Image file
      return (
        <div className="mt-1 mb-2">
          <img
            src={message.fileUrl}
            alt={message.fileName || 'Image'}
            className="max-w-[200px] max-h-[200px] rounded-md object-cover"
          />
          <a
            href={message.fileUrl}
            download={message.fileName}
            className="text-xs text-blue-500 hover:underline block mt-1"
          >
            Tải xuống {message.fileName}
          </a>
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      // Video file
      return (
        <div className="mt-1 mb-2">
          <video
            src={message.fileUrl}
            controls
            className="max-w-[200px] max-h-[200px] rounded-md"
          />
          <a
            href={message.fileUrl}
            download={message.fileName}
            className="text-xs text-blue-500 hover:underline block mt-1"
          >
            Tải xuống {message.fileName}
          </a>
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      // Audio file
      return (
        <div className="mt-1 mb-2">
          <audio
            src={message.fileUrl}
            controls
            className="max-w-full"
          />
          <a
            href={message.fileUrl}
            download={message.fileName}
            className="text-xs text-blue-500 hover:underline block mt-1"
          >
            Tải xuống {message.fileName}
          </a>
        </div>
      );
    } else {
      // Other file types
      return (
        <div className="mt-1 mb-2 p-2 rounded-md bg-gray-50 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-200 p-2 rounded">
              <PaperclipIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium truncate max-w-[150px]">{message.fileName}</p>
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="text-xs text-blue-500 hover:underline"
              >
                Tải xuống
              </a>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm">Bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.senderAvatar} />
                  <AvatarFallback>
                    {message.senderName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div 
                  className={`mx-2 p-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.senderId !== user?.id && (
                    <p className="text-xs font-medium mb-1">
                      {message.senderName}
                    </p>
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  
                  {/* Render attachment if it's a file message */}
                  {message.isFile && renderAttachment(message)}
                  
                  <p 
                    className={`text-xs mt-1 ${
                      message.senderId === user?.id
                        ? 'text-white/70 text-right'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-3 border-t">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full flex-shrink-0"
            onClick={handleAttachmentClick}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default ChatPanel;