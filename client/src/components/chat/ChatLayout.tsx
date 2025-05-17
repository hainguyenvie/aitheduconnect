import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Users,
  MessageSquare,
  BookOpen,
  PlusCircle,
  Send,
  Image,
  File,
  Paperclip,
  MoreVertical,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Circle,
  Check,
  Download
} from "lucide-react";

// Types
interface User {
  id: number;
  username: string;
  fullName: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  isOnline?: boolean;
  lastActive?: Date;
}

interface Message {
  id: string;
  senderId: number;
  receiverId?: number;
  groupId?: number;
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface ChatGroup {
  id: number;
  name: string;
  avatar?: string;
  type: 'course' | 'group';
  courseId?: number;
  members: number[];
  lastMessage?: Message;
  unreadCount?: number;
}

interface Contact {
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

// Mock data
const MOCK_CONTACTS: Contact[] = [
  {
    user: {
      id: 1,
      username: 'teacher1',
      fullName: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      role: 'teacher',
      isOnline: true
    },
    lastMessage: {
      id: 'm1',
      senderId: 1,
      text: 'Chào em, có gì mình có thể giúp không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: true
    },
    unreadCount: 0
  },
  {
    user: {
      id: 2,
      username: 'teacher2',
      fullName: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      role: 'teacher',
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 30)
    },
    lastMessage: {
      id: 'm2',
      senderId: 2,
      text: 'Bài tập tuần này em làm tốt lắm.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: false
    },
    unreadCount: 1
  },
  {
    user: {
      id: 3,
      username: 'student1',
      fullName: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'student',
      isOnline: true
    },
    lastMessage: {
      id: 'm3',
      senderId: 3,
      text: 'Bạn đã làm đến đâu rồi?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true
    },
    unreadCount: 0
  }
];

const MOCK_GROUPS: ChatGroup[] = [
  {
    id: 1,
    name: 'Toán Cao Cấp 1',
    type: 'course',
    courseId: 1,
    members: [1, 2, 3, 4, 5],
    lastMessage: {
      id: 'g1',
      senderId: 1,
      groupId: 1,
      text: 'Nhắc nhở: Nộp bài tập vào thứ 6 tuần này nhé.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      isRead: false
    },
    unreadCount: 3
  },
  {
    id: 2,
    name: 'Tiếng Anh Giao Tiếp',
    type: 'course',
    courseId: 2,
    members: [2, 3, 4, 6],
    lastMessage: {
      id: 'g2',
      senderId: 2,
      groupId: 2,
      text: 'Thông báo: Lớp học sẽ bắt đầu sớm 15 phút vào thứ 5.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      isRead: true
    },
    unreadCount: 0
  },
  {
    id: 3,
    name: 'Nhóm học tập Toán - Lý - Hóa',
    type: 'group',
    members: [3, 4, 5, 6, 7],
    lastMessage: {
      id: 'g3',
      senderId: 3,
      groupId: 3,
      text: 'Mọi người có ai giải được bài này không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false
    },
    unreadCount: 1
  }
];

// Sample conversation
const SAMPLE_CONVERSATION: Message[] = [
  {
    id: 'c1',
    senderId: 1,
    text: 'Chào em, hôm nay em có thắc mắc gì về bài học không?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true
  },
  {
    id: 'c2',
    senderId: 999, // Current user
    text: 'Dạ chào thầy, em có một số câu hỏi về bài tập tuần trước.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
    isRead: true
  },
  {
    id: 'c3',
    senderId: 1,
    text: 'Em cứ nói đi, thầy sẽ giải đáp cho em.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
    isRead: true
  },
  {
    id: 'c4',
    senderId: 999,
    text: 'Em không hiểu cách giải bài toán số 5 trong bài tập về nhà ạ.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    isRead: true
  },
  {
    id: 'c5',
    senderId: 1,
    text: 'À, bài đó cần áp dụng công thức...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    isRead: true,
    attachments: [
      {
        id: 'a1',
        name: 'Giải bài tập.pdf',
        type: 'application/pdf',
        url: '#',
        size: 1200000
      }
    ]
  },
  {
    id: 'c6',
    senderId: 999,
    text: 'Cảm ơn thầy rất nhiều! Em đã hiểu rồi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21),
    isRead: true
  },
  {
    id: 'c7',
    senderId: 1,
    text: 'Không có gì. Nếu em còn thắc mắc gì thì cứ hỏi thêm nhé.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: true
  }
];

// Sample group conversation
const SAMPLE_GROUP_CHAT: Message[] = [
  {
    id: 'g1',
    senderId: 1,
    groupId: 1,
    text: 'Chào các em, hôm nay chúng ta sẽ thảo luận về đề cương ôn tập.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true
  },
  {
    id: 'g2',
    senderId: 3,
    groupId: 1,
    text: 'Em có một số câu hỏi về phần 2 của đề cương ạ.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
    isRead: true
  },
  {
    id: 'g3',
    senderId: 1,
    groupId: 1,
    text: 'Mọi người xem qua tài liệu này nhé.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
    isRead: true,
    attachments: [
      {
        id: 'ga1',
        name: 'Đề cương ôn tập.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        url: '#',
        size: 2500000
      }
    ]
  },
  {
    id: 'g4',
    senderId: 999, // Current user
    groupId: 1,
    text: 'Em cảm ơn thầy. Em sẽ xem qua tài liệu này.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45),
    isRead: true
  },
  {
    id: 'g5',
    senderId: 4,
    groupId: 1,
    text: 'Thưa thầy, khi nào chúng ta sẽ có buổi ôn tập trực tiếp ạ?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true
  },
  {
    id: 'g6',
    senderId: 1,
    groupId: 1,
    text: 'Thầy dự kiến sẽ tổ chức buổi ôn tập vào thứ 7 tuần sau. Mọi người sắp xếp thời gian tham gia nhé.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isRead: true
  }
];

// Format timestamp
const formatMessageTime = (timestamp: Date) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  
  // Same day
  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === messageDate.toDateString()) {
    return `Hôm qua, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // This week
  const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
  
  // Older
  return messageDate.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

// Main component
const ChatLayout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // State
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    members: [] as number[]
  });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Effect to scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);
  
  // Mock data loading
  useEffect(() => {
    // Initial setup - select first contact
    if (MOCK_CONTACTS.length > 0 && !selectedContact && !selectedGroup) {
      handleSelectContact(MOCK_CONTACTS[0]);
    }
  }, []);
  
  // Query for users (for creating new groups)
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/users');
        return await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
    enabled: isNewGroupDialogOpen, // Only fetch when dialog is open
  });
  
  // Filter contacts based on search
  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter groups based on search
  const filteredGroups = MOCK_GROUPS.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedGroup(null);
    setCurrentConversation(SAMPLE_CONVERSATION);
    
    // Mark messages as read (would be an API call in a real app)
    setSearchQuery('');
  };
  
  // Handle group selection
  const handleSelectGroup = (group: ChatGroup) => {
    setSelectedGroup(group);
    setSelectedContact(null);
    setCurrentConversation(SAMPLE_GROUP_CHAT);
    
    // Mark messages as read (would be an API call in a real app)
    setSearchQuery('');
  };
  
  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Create new message
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 999, // Current user placeholder
      text: newMessage,
      timestamp: new Date(),
      isRead: false,
      ...(selectedGroup ? { groupId: selectedGroup.id } : { receiverId: selectedContact?.user.id }),
    };
    
    // Add to conversation
    setCurrentConversation(prev => [...prev, newMsg]);
    
    // Clear input
    setNewMessage('');
    
    // In a real app, would send via API or websocket here
  };
  
  // Handle file attachment
  const handleAttachment = () => {
    fileInputRef.current?.click();
  };
  
  // Process file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Kích thước file không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create attachment object
    const attachment: Attachment = {
      id: `attachment-${Date.now()}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size
    };
    
    // Create message with attachment
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 999, // Current user placeholder
      text: `Đã gửi file: ${file.name}`,
      timestamp: new Date(),
      isRead: false,
      ...(selectedGroup ? { groupId: selectedGroup.id } : { receiverId: selectedContact?.user.id }),
      attachments: [attachment]
    };
    
    // Add to conversation
    setCurrentConversation(prev => [...prev, newMsg]);
    
    // In a real app, would upload to server and send message with attachment URL
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  // Create new group
  const handleCreateGroup = () => {
    if (!newGroupData.name.trim() || newGroupData.members.length === 0) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng nhập tên nhóm và chọn ít nhất một thành viên",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, would create via API
    const newGroup: ChatGroup = {
      id: MOCK_GROUPS.length + 1,
      name: newGroupData.name,
      type: 'group',
      members: [...newGroupData.members, 999], // Add current user
      unreadCount: 0
    };
    
    // Close dialog and reset form
    setIsNewGroupDialogOpen(false);
    setNewGroupData({ name: '', members: [] });
    
    toast({
      title: "Đã tạo nhóm",
      description: `Nhóm "${newGroupData.name}" đã được tạo thành công`,
    });
    
    // Would reload groups from API in a real app
  };
  
  // Toggle member selection for new group
  const toggleMemberSelection = (userId: number) => {
    setNewGroupData(prev => {
      if (prev.members.includes(userId)) {
        return {
          ...prev,
          members: prev.members.filter(id => id !== userId)
        };
      } else {
        return {
          ...prev,
          members: [...prev.members, userId]
        };
      }
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Tin nhắn</h1>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[70vh] rounded-lg border">
        {/* Sidebar */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
          <div className="h-full flex flex-col">
            {/* Search and tabs */}
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs
                defaultValue="direct"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'direct' | 'groups')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Cá nhân</span>
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Nhóm</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Contact/Group list */}
            <ScrollArea className="flex-1">
              {activeTab === 'direct' && (
                <div>
                  {filteredContacts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>Không tìm thấy liên hệ</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.user.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedContact?.user.id === contact.user.id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="flex items-start">
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={contact.user.avatar} />
                                <AvatarFallback>
                                  {contact.user.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              {contact.user.isOnline && (
                                <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 border-2 border-white"></span>
                              )}
                            </div>
                            
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex justify-between">
                                <p className="font-medium truncate">{contact.user.fullName}</p>
                                
                                <span className="text-xs text-gray-500">
                                  {contact.lastMessage && formatMessageTime(contact.lastMessage.timestamp)}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate">
                                  {contact.lastMessage?.text || 'Chưa có tin nhắn'}
                                </p>
                                
                                {contact.unreadCount > 0 && (
                                  <Badge className="ml-2">
                                    {contact.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              
                              {!contact.user.isOnline && contact.user.lastActive && (
                                <p className="text-xs text-gray-400">
                                  Hoạt động {formatMessageTime(contact.user.lastActive)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'groups' && (
                <div>
                  <div className="p-3 border-b">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsNewGroupDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>Tạo nhóm mới</span>
                    </Button>
                  </div>
                  
                  {filteredGroups.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>Không tìm thấy nhóm</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredGroups.map((group) => (
                        <div
                          key={group.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedGroup?.id === group.id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => handleSelectGroup(group)}
                        >
                          <div className="flex">
                            <div className="relative flex-shrink-0">
                              {group.avatar ? (
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={group.avatar} />
                                  <AvatarFallback>
                                    {group.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                  <Users className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <p className="font-medium truncate">{group.name}</p>
                                  {group.type === 'course' && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      <span>Khóa học</span>
                                    </Badge>
                                  )}
                                </div>
                                
                                <span className="text-xs text-gray-500">
                                  {group.lastMessage && formatMessageTime(group.lastMessage.timestamp)}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate">
                                  {group.lastMessage?.text || 'Chưa có tin nhắn'}
                                </p>
                                
                                {(group.unreadCount || 0) > 0 && (
                                  <Badge className="ml-2">
                                    {group.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-400">
                                {group.members.length} thành viên
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Chat area */}
        <ResizablePanel defaultSize={70}>
          {(selectedContact || selectedGroup) ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  {selectedContact ? (
                    <>
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedContact.user.avatar} />
                          <AvatarFallback>
                            {selectedContact.user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {selectedContact.user.isOnline && (
                          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      
                      <div className="ml-3">
                        <p className="font-medium">{selectedContact.user.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedContact.user.isOnline ? 'Đang online' : 'Không hoạt động'}
                        </p>
                      </div>
                    </>
                  ) : selectedGroup && (
                    <>
                      {selectedGroup.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedGroup.avatar} />
                          <AvatarFallback>
                            {selectedGroup.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                      )}
                      
                      <div className="ml-3">
                        <p className="font-medium">{selectedGroup.name}</p>
                        <p className="text-sm text-gray-500">
                          {selectedGroup.members.length} thành viên
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {/* Group info button */}
                  {selectedGroup && (
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Thành viên</span>
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentConversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 999 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[70%]">
                        {/* Sender info for group chats */}
                        {selectedGroup && message.senderId !== 999 && (
                          <div className="flex items-center mb-1">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={
                                message.senderId === 1 ? MOCK_CONTACTS[0].user.avatar :
                                message.senderId === 2 ? MOCK_CONTACTS[1].user.avatar :
                                message.senderId === 3 ? MOCK_CONTACTS[2].user.avatar :
                                undefined
                              } />
                              <AvatarFallback>
                                {message.senderId === 1 ? MOCK_CONTACTS[0].user.fullName.charAt(0) :
                                 message.senderId === 2 ? MOCK_CONTACTS[1].user.fullName.charAt(0) :
                                 message.senderId === 3 ? MOCK_CONTACTS[2].user.fullName.charAt(0) :
                                 '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {message.senderId === 1 ? MOCK_CONTACTS[0].user.fullName :
                               message.senderId === 2 ? MOCK_CONTACTS[1].user.fullName :
                               message.senderId === 3 ? MOCK_CONTACTS[2].user.fullName :
                               message.senderId === 4 ? 'Phạm Thị D' :
                               'Người dùng'}
                            </span>
                          </div>
                        )}
                        
                        {/* Message bubble */}
                        <div
                          className={`rounded-lg p-3 ${
                            message.senderId === 999
                              ? 'bg-primary text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          
                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className={`rounded p-2 flex items-center ${
                                    message.senderId === 999
                                      ? 'bg-white/10'
                                      : 'bg-gray-200'
                                  }`}
                                >
                                  {attachment.type.startsWith('image/') ? (
                                    <Image className="h-4 w-4 mr-2" />
                                  ) : (
                                    <File className="h-4 w-4 mr-2" />
                                  )}
                                  
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${
                                      message.senderId === 999 ? 'text-white' : 'text-gray-800'
                                    }`}>
                                      {attachment.name}
                                    </p>
                                    <p className={`text-xs ${
                                      message.senderId === 999 ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                      {formatFileSize(attachment.size)}
                                    </p>
                                  </div>
                                  
                                  <Button
                                    variant={message.senderId === 999 ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Tải xuống</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className={`text-right mt-1 text-xs ${
                            message.senderId === 999 ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input area */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleAttachment}
                    className="flex-shrink-0"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="flex-shrink-0"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    <span>Gửi</span>
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Tin nhắn của bạn</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Chọn một liên hệ hoặc nhóm từ danh sách bên trái để bắt đầu trò chuyện.
              </p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* New Group Dialog */}
      <Dialog open={isNewGroupDialogOpen} onOpenChange={setIsNewGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo nhóm trò chuyện mới</DialogTitle>
            <DialogDescription>
              Tạo nhóm và thêm thành viên để bắt đầu trò chuyện nhóm.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="group-name" className="text-sm font-medium">
                Tên nhóm
              </label>
              <Input
                id="group-name"
                placeholder="Nhập tên nhóm..."
                value={newGroupData.name}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Thành viên
              </label>
              <div className="border rounded-md h-60 overflow-y-auto">
                {/* Would use real data in a production app */}
                {MOCK_CONTACTS.map((contact) => (
                  <div
                    key={contact.user.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => toggleMemberSelection(contact.user.id)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                      {newGroupData.members.includes(contact.user.id) ? (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border rounded-full" />
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={contact.user.avatar} />
                      <AvatarFallback>
                        {contact.user.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="text-sm font-medium">{contact.user.fullName}</p>
                      <p className="text-xs text-gray-500">{contact.user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGroupDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateGroup}>
              Tạo nhóm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatLayout;