import { useState } from 'react';
import { Button } from "@/components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Video, 
  Users, 
  MessageSquare, 
  PencilRuler, 
  Files, 
  Mic, 
  MicOff, 
  VideoOff, 
  ScreenShare, 
  PhoneOff, 
  Settings,
  Share2,
  UserPlus,
  Clock,
  Calendar
} from "lucide-react";

const ClassroomPlaceholder = () => {
  const [joinModalOpen, setJoinModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('participants');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">Lớp học trực tuyến</h1>
            <div className="ml-4 bg-primary/10 text-primary px-2 py-1 rounded text-sm">
              Mã phòng: ABC123
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Thời gian: 01:30:45</span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Video area */}
        <div className="w-full md:w-3/4 bg-gray-900 p-4 flex flex-col">
          {/* Main video */}
          <div className="flex-grow flex justify-center items-center relative rounded-xl overflow-hidden bg-black mb-4">
            <div className="absolute inset-0 flex justify-center items-center">
              <Video className="h-24 w-24 text-gray-600" />
            </div>
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Nguyễn Văn A (Giáo viên)
            </div>
          </div>
          
          {/* Other videos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 h-32">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden relative flex justify-center items-center">
                <Video className="h-10 w-10 text-gray-600" />
                <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                  Học viên {i}
                </div>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div className="mt-4 flex justify-center">
            <div className="bg-gray-800 rounded-full p-2 flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-700 text-white hover:bg-gray-600">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-700 text-white hover:bg-gray-600">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-700 text-white hover:bg-gray-600">
                <ScreenShare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-red-600 text-white hover:bg-red-700">
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 border-l bg-white">
          <Tabs defaultValue="participants" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 p-1 m-2">
              <TabsTrigger value="participants" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Người tham gia</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Trò chuyện</span>
              </TabsTrigger>
              <TabsTrigger value="whiteboard" className="flex items-center justify-center">
                <PencilRuler className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bảng vẽ</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="participants" className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Người tham gia (4)</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Nguyễn Văn A (Giáo viên)', isTeacher: true, isMuted: false, isVideoOff: false },
                    { name: 'Trần Thị B', isTeacher: false, isMuted: true, isVideoOff: false },
                    { name: 'Lê Văn C', isTeacher: false, isMuted: false, isVideoOff: true },
                    { name: 'Phạm Thị D', isTeacher: false, isMuted: false, isVideoOff: false }
                  ].map((user, i) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div>
                        <p className={`text-sm ${user.isTeacher ? 'font-medium' : ''}`}>
                          {user.name}
                        </p>
                        {user.isTeacher && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            Giáo viên
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        {user.isMuted && <MicOff className="h-4 w-4 text-gray-500" />}
                        {user.isVideoOff && <VideoOff className="h-4 w-4 text-gray-500" />}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <Button size="sm" variant="ghost" className="w-full flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Mời thêm người</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="h-[calc(100vh-10rem)] flex flex-col">
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                    <p className="text-xs font-medium">Nguyễn Văn A (Giáo viên)</p>
                    <p className="text-sm">Chào mừng tất cả các bạn đến với lớp học trực tuyến!</p>
                    <p className="text-xs text-gray-500 text-right">10:30</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-primary text-white rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm">Cảm ơn thầy. Em đã sẵn sàng.</p>
                    <p className="text-xs text-white/70 text-right">10:31</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                    <p className="text-xs font-medium">Trần Thị B</p>
                    <p className="text-sm">Em có thắc mắc về bài học tuần trước ạ.</p>
                    <p className="text-xs text-gray-500 text-right">10:32</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Files className="h-5 w-5" />
                  </Button>
                  <input 
                    type="text" 
                    placeholder="Nhập tin nhắn..." 
                    className="flex-grow rounded-full border px-4 py-2 text-sm"
                  />
                  <Button size="icon" className="rounded-full">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="whiteboard" className="h-[calc(100vh-10rem)] flex flex-col">
              <div className="border-b p-2 flex justify-between">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    <PencilRuler className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    <Files className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span>Chia sẻ</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex-grow bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                  <PencilRuler className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Bảng vẽ tương tác</p>
                  <p className="text-sm text-gray-400">Vẽ và chia sẻ ý tưởng của bạn</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Join Room Dialog */}
      <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tham gia lớp học trực tuyến</DialogTitle>
            <DialogDescription>
              Nhập mã phòng học hoặc tạo phòng mới để bắt đầu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Mã phòng</label>
              <input 
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Nhập mã phòng học..."
                defaultValue="ABC123"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tên của bạn</label>
              <input 
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Nhập tên của bạn..."
                defaultValue="Người dùng"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Ngày</label>
                <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">15/05/2025</span>
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Thời gian</label>
                <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">15:30</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinModalOpen(false)}>Hủy</Button>
            <Button onClick={() => setJoinModalOpen(false)}>
              Tham gia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Features Description */}
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Các tính năng của lớp học trực tuyến</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Video className="h-12 w-12 text-primary mb-2" />
                </motion.div>
                <CardTitle>Video HD</CardTitle>
                <CardDescription>Kết nối video chất lượng cao với nhiều người tham gia cùng lúc</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Kết nối video HD 1080p</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Tùy chỉnh camera và microphone</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Chế độ camera kép cho giáo viên</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <PencilRuler className="h-12 w-12 text-primary mb-2" />
                </motion.div>
                <CardTitle>Bảng vẽ tương tác</CardTitle>
                <CardDescription>Tạo và chia sẻ nội dung trực quan với bảng vẽ tương tác</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Vẽ và chú thích</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Thêm hình, văn bản và ghi chú</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Chia sẻ màn hình và bảng vẽ kết hợp</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Files className="h-12 w-12 text-primary mb-2" />
                </motion.div>
                <CardTitle>Chia sẻ tài liệu</CardTitle>
                <CardDescription>Dễ dàng chia sẻ và làm việc trên tài liệu học tập</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Tải lên và chia sẻ tài liệu</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Tổ chức thư viện tài liệu lớp học</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded mr-2">✓</span>
                    <span>Ghi lại và chia sẻ buổi học</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Separator className="my-12" />
          
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Sẵn sàng trải nghiệm?</h3>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              Nền tảng học trực tuyến tiên tiến với các công cụ tương tác để mang lại trải nghiệm học tập hiệu quả nhất.
            </p>
            <Button size="lg" onClick={() => setJoinModalOpen(true)}>
              Tham gia lớp học ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPlaceholder;