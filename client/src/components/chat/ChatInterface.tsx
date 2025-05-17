import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Send, Paperclip, Image } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    fullName: string;
    avatar?: string;
  };
}

interface ChatContact {
  id: number;
  fullName: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ChatInterfaceProps {
  teacherMode?: boolean;
}

const ChatInterface = ({ teacherMode = false }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch contacts (simulated)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // In a real implementation, this would be an API call
        // For demo, we'll simulate some contacts
        setTimeout(() => {
          const mockContacts = [
            {
              id: 1,
              fullName: 'Nguyễn Văn A',
              avatar: '',
              lastMessage: 'Thầy/cô có thể giúp em với bài tập này được không?',
              lastMessageTime: '10:30',
              unreadCount: 2,
            },
            {
              id: 2,
              fullName: 'Trần Thị B',
              avatar: '',
              lastMessage: 'Cảm ơn thầy/cô rất nhiều!',
              lastMessageTime: 'Hôm qua',
              unreadCount: 0,
            },
            {
              id: 3,
              fullName: 'Lê Minh C',
              avatar: '',
              lastMessage: 'Em đã hoàn thành bài tập rồi ạ.',
              lastMessageTime: '24/04',
              unreadCount: 0,
            },
          ];
          setContacts(mockContacts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: 'Lỗi khi tải danh sách tin nhắn',
          description: 'Đã xảy ra lỗi khi tải danh sách liên hệ. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  // Fetch messages when contact is selected
  useEffect(() => {
    if (activeContact) {
      setLoading(true);
      
      // Simulate API call to fetch messages
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: 1,
            senderId: activeContact.id,
            receiverId: user?.id || 0,
            content: 'Chào thầy/cô, em muốn hỏi về bài tập tuần trước ạ.',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            sender: {
              fullName: activeContact.fullName,
              avatar: activeContact.avatar,
            },
          },
          {
            id: 2,
            senderId: user?.id || 0,
            receiverId: activeContact.id,
            content: 'Chào em, thầy/cô có thể giúp gì cho em?',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          },
          {
            id: 3,
            senderId: activeContact.id,
            receiverId: user?.id || 0,
            content: 'Em đang gặp khó khăn với bài tập số 5, phần về...',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
            sender: {
              fullName: activeContact.fullName,
              avatar: activeContact.avatar,
            },
          },
          {
            id: 4,
            senderId: user?.id || 0,
            receiverId: activeContact.id,
            content: 'Em cần hiểu rõ hơn về phần nào vậy?',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 5,
            senderId: activeContact.id,
            receiverId: user?.id || 0,
            content: 'Dạ, em cần giúp với phần...',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
            sender: {
              fullName: activeContact.fullName,
              avatar: activeContact.avatar,
            },
          },
        ];
        
        setMessages(mockMessages);
        setLoading(false);
        scrollToBottom();
      }, 800);
    }
  }, [activeContact, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact) return;

    setSendingMessage(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate adding the message to the state
      const newMessageObj: Message = {
        id: messages.length + 1,
        senderId: user?.id || 0,
        receiverId: activeContact.id,
        content: newMessage,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      // Simulate API delay
      setTimeout(() => {
        setMessages((prev) => [...prev, newMessageObj]);
        
        // Update the contact's last message
        setContacts((prev) =>
          prev.map((contact) => {
            if (contact.id === activeContact.id) {
              return {
                ...contact,
                lastMessage: newMessage,
                lastMessageTime: 'Vừa xong',
              };
            }
            return contact;
          })
        );
        
        setNewMessage('');
        setSendingMessage(false);
        scrollToBottom();
      }, 500);
    } catch (error) {
      toast({
        title: 'Lỗi khi gửi tin nhắn',
        description: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return format(date, 'HH:mm', { locale: vi });
    } else if (diffInDays === 1) {
      return 'Hôm qua, ' + format(date, 'HH:mm', { locale: vi });
    } else if (diffInDays < 7) {
      return format(date, 'EEEE, HH:mm', { locale: vi });
    } else {
      return format(date, 'dd/MM/yyyy, HH:mm', { locale: vi });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Tin nhắn</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex p-0 overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <Input placeholder="Tìm kiếm..." className="w-full" />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading && contacts.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : contacts.length > 0 ? (
              <div className="divide-y divide-border">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-accent ${
                      activeContact?.id === contact.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setActiveContact(contact)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{getInitials(contact.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{contact.fullName}</span>
                        <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        {contact.unreadCount > 0 && (
                          <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center p-4">
                <p className="text-muted-foreground mb-2">Không có tin nhắn nào</p>
                <p className="text-sm text-muted-foreground">
                  {teacherMode
                    ? 'Khi học viên liên hệ với bạn, tin nhắn sẽ hiển thị ở đây.'
                    : 'Hãy bắt đầu cuộc trò chuyện với giáo viên của bạn.'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Message area */}
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b border-border flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activeContact.avatar} />
                  <AvatarFallback>{getInitials(activeContact.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeContact.fullName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {teacherMode ? 'Học viên' : 'Giáo viên'}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="flex max-w-[70%]">
                        {message.senderId !== user?.id && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={message.sender?.avatar} />
                            <AvatarFallback>
                              {message.sender ? getInitials(message.sender.fullName) : 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.senderId === user?.id
                                ? 'bg-primary text-white'
                                : 'bg-accent'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {formatMessageTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t border-border">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Image className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center p-4">
              <h3 className="font-medium text-lg mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-muted-foreground max-w-md">
                Chọn một liên hệ từ danh sách bên trái để bắt đầu trò chuyện.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;