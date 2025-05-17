import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  File,
  Upload,
  Download,
  Share2,
  Image as ImageIcon,
  FileText,
  Table,
  Code,
  FileIcon,
  Archive,
  HelpCircle,
  Trash2,
  Video as VideoIcon,
  Music,
  Plus,
  Info,
  Link,
  Copy,
  Check,
  X,
} from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: Date;
  isPublic: boolean;
}

interface FileSharingProps {
  socketRef: React.MutableRefObject<Socket | null>;
}

const FileSharing = ({ socketRef }: FileSharingProps) => {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [clipboardSuccess, setClipboardSuccess] = useState(false);
  
  // Load sample files on mount
  useEffect(() => {
    // In a real app, this would fetch from server
    const sampleFiles: SharedFile[] = [
      {
        id: '1',
        name: 'Đề cương bài giảng.pdf',
        type: 'application/pdf',
        size: 2500000, // 2.5MB
        url: '#',
        owner: {
          id: '1',
          name: 'Nguyễn Văn A (Giáo viên)',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        },
        uploadedAt: new Date(new Date().getTime() - 60000), // 1 minute ago
        isPublic: true,
      },
      {
        id: '2',
        name: 'Bài tập thực hành.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 1200000, // 1.2MB
        url: '#',
        owner: {
          id: '1',
          name: 'Nguyễn Văn A (Giáo viên)',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        },
        uploadedAt: new Date(new Date().getTime() - 3600000), // 1 hour ago
        isPublic: true,
      },
      {
        id: '3',
        name: 'Hình ảnh minh họa.jpg',
        type: 'image/jpeg',
        size: 800000, // 800KB
        url: '#',
        owner: {
          id: '2',
          name: user?.fullName || 'Bạn',
          avatar: user?.avatar,
        },
        uploadedAt: new Date(new Date().getTime() - 7200000), // 2 hours ago
        isPublic: true,
      },
    ];
    
    setFiles(sampleFiles);
  }, [user]);
  
  // Listen for file events from server
  useEffect(() => {
    if (!socketRef.current) return;
    
    socketRef.current.on('file-shared', (file: SharedFile) => {
      setFiles(prev => [file, ...prev]);
    });
    
    socketRef.current.on('file-deleted', (fileId: string) => {
      setFiles(prev => prev.filter(file => file.id !== fileId));
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('file-shared');
        socketRef.current.off('file-deleted');
      }
    };
  }, [socketRef.current]);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current) return;
    
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File quá lớn",
        description: "Vui lòng chọn file nhỏ hơn 20MB",
        variant: "destructive",
      });
      return;
    }
    
    // Start uploading
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Read file
    const reader = new FileReader();
    reader.onload = (event) => {
      // Complete upload after progress reaches 100%
      setTimeout(() => {
        clearInterval(interval);
        
        // Create new file object
        const newFile: SharedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: event.target?.result as string,
          owner: {
            id: user?.id?.toString() || 'anonymous',
            name: user?.fullName || 'Người dùng ẩn danh',
            avatar: user?.avatar,
          },
          uploadedAt: new Date(),
          isPublic: true,
        };
        
        // Add to local state
        setFiles(prev => [newFile, ...prev]);
        
        // Send to server
        socketRef.current?.emit('share-file', newFile);
        
        // Reset states
        setIsUploading(false);
        setUploadProgress(0);
        
        toast({
          title: "Tải lên thành công",
          description: `File ${file.name} đã được chia sẻ`,
        });
      }, 3000); // Simulate network delay
    };
    
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Delete file
  const deleteFile = (fileId: string) => {
    if (confirm('Bạn có chắc muốn xóa file này không?')) {
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      // Notify server
      if (socketRef.current) {
        socketRef.current.emit('delete-file', fileId);
      }
      
      toast({
        title: "Đã xóa file",
        description: "File đã được xóa khỏi kho lưu trữ",
      });
    }
  };
  
  // Filter files based on search and active tab
  const filteredFiles = files.filter(file => {
    // Search filter
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filter
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'images') return matchesSearch && file.type.startsWith('image/');
    if (activeTab === 'documents') {
      return matchesSearch && (
        file.type.includes('pdf') ||
        file.type.includes('word') ||
        file.type.includes('opendocument') ||
        file.type.includes('text')
      );
    }
    if (activeTab === 'mine') return matchesSearch && file.owner.id === user?.id?.toString();
    
    return matchesSearch;
  });
  
  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-6 w-6 text-blue-500" />;
    if (fileType.startsWith('video/')) return <VideoIcon className="h-6 w-6 text-red-500" />;
    if (fileType.startsWith('audio/')) return <Music className="h-6 w-6 text-purple-500" />;
    if (fileType.includes('pdf')) return <FileIcon className="h-6 w-6 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('opendocument.text')) return <FileText className="h-6 w-6 text-blue-600" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <Table className="h-6 w-6 text-green-600" />;
    if (fileType.includes('html') || fileType.includes('javascript') || fileType.includes('css')) return <Code className="h-6 w-6 text-gray-600" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <Archive className="h-6 w-6 text-yellow-600" />;
    
    return <HelpCircle className="h-6 w-6 text-gray-500" />;
  };
  
  // Copy share link to clipboard
  const copyShareLink = (fileId: string) => {
    // In a real app, this would be a real URL
    const shareLink = `${window.location.origin}/shared-file/${fileId}`;
    
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setClipboardSuccess(true);
        setTimeout(() => {
          setClipboardSuccess(false);
        }, 2000);
        
        toast({
          title: "Đã sao chép",
          description: "Đường dẫn đã được sao chép vào clipboard",
        });
      })
      .catch(err => {
        toast({
          title: "Lỗi sao chép",
          description: "Không thể sao chép đường dẫn: " + err.message,
          variant: "destructive",
        });
      });
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Tài liệu chia sẻ</h2>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Upload className="mr-2 h-4 w-4" />
                Tải lên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chia sẻ tài liệu</DialogTitle>
                <DialogDescription>
                  Tải lên tài liệu để chia sẻ với tất cả người tham gia trong lớp học.
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4">
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Kéo thả file vào đây, hoặc click để chọn file</p>
                    <p className="text-xs text-gray-500">Dung lượng tối đa: 20MB</p>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Đang tải lên...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}% hoàn thành</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" className="mr-2" onClick={() => fileInputRef.current?.click()}>
                  Chọn file
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Đang tải lên...' : 'Chia sẻ'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <File className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col"
      >
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="mine">Của tôi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-grow overflow-y-auto p-4">
          <FileList 
            files={filteredFiles} 
            onDelete={deleteFile} 
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            onCopyLink={copyShareLink}
            clipboardSuccess={clipboardSuccess}
            userId={user?.id?.toString() || ''}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="flex-grow overflow-y-auto p-4">
          <FileList 
            files={filteredFiles} 
            onDelete={deleteFile} 
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            onCopyLink={copyShareLink}
            clipboardSuccess={clipboardSuccess}
            userId={user?.id?.toString() || ''}
          />
        </TabsContent>
        
        <TabsContent value="images" className="flex-grow overflow-y-auto p-4">
          <FileList 
            files={filteredFiles} 
            onDelete={deleteFile} 
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            onCopyLink={copyShareLink}
            clipboardSuccess={clipboardSuccess}
            userId={user?.id?.toString() || ''}
          />
        </TabsContent>
        
        <TabsContent value="mine" className="flex-grow overflow-y-auto p-4">
          <FileList 
            files={filteredFiles} 
            onDelete={deleteFile} 
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            onCopyLink={copyShareLink}
            clipboardSuccess={clipboardSuccess}
            userId={user?.id?.toString() || ''}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// File list component
interface FileListProps {
  files: SharedFile[];
  onDelete: (fileId: string) => void;
  getFileIcon: (fileType: string) => JSX.Element;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: Date) => string;
  onCopyLink: (fileId: string) => void;
  clipboardSuccess: boolean;
  userId: string;
}

const FileList = ({ 
  files, 
  onDelete, 
  getFileIcon, 
  formatFileSize, 
  formatDate,
  onCopyLink,
  clipboardSuccess,
  userId
}: FileListProps) => {
  if (!files.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
        <File className="h-12 w-12 text-gray-300 mb-2" />
        <h3 className="font-medium text-gray-700">Không có tài liệu</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Chưa có tài liệu nào được chia sẻ ở đây. Tải lên tài liệu để chia sẻ với lớp học.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
        <Card key={file.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-2 overflow-hidden">
                  <CardTitle className="text-base truncate">{file.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onCopyLink(file.id)}
                >
                  {clipboardSuccess ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Link className="h-4 w-4" />
                  )}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thông tin tài liệu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div>
                        <p className="text-sm font-medium mb-1">Tên file</p>
                        <p className="text-sm text-gray-700">{file.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Người chia sẻ</p>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={file.owner.avatar} />
                            <AvatarFallback>
                              {file.owner.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-gray-700">{file.owner.name}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Thời gian chia sẻ</p>
                        <p className="text-sm text-gray-700">{formatDate(file.uploadedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Kích thước</p>
                        <p className="text-sm text-gray-700">{formatFileSize(file.size)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Loại file</p>
                        <p className="text-sm text-gray-700">{file.type}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {file.owner.id === userId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-700"
                    onClick={() => onDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            {file.type.startsWith('image/') ? (
              <div className="w-full h-36 bg-gray-100 rounded-md overflow-hidden flex justify-center">
                <img
                  src={file.url}
                  alt={file.name}
                  className="object-cover h-full"
                />
              </div>
            ) : (
              <div className="w-full bg-gray-50 rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <p className="ml-2 text-sm font-medium truncate">{file.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="text-xs">Tải xuống</span>
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-3 pt-0">
            <div className="flex items-center text-xs text-gray-500">
              <Avatar className="h-5 w-5 mr-1">
                <AvatarImage src={file.owner.avatar} />
                <AvatarFallback>
                  {file.owner.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="mr-2 truncate max-w-[120px]">{file.owner.name}</span>
              <span>•</span>
              <span className="ml-2">{new Date(file.uploadedAt).toLocaleDateString()}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FileSharing;