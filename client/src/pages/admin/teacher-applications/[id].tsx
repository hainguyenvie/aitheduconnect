import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  AlertCircle, 
  ArrowLeft, 
  Award, 
  Book, 
  CheckCircle, 
  Clock, 
  Coins, 
  FileText, 
  GraduationCap, 
  LockKeyhole, 
  Loader2, 
  Video, 
  XCircle
} from "lucide-react";
import { format } from "date-fns";

// Kiểu dữ liệu chi tiết đơn đăng ký
type TeacherApplicationDetail = {
  id: number;
  userId: number;
  title: string;
  education: string;
  experience: string;
  hourlyRate: number;
  introVideo: string | null;
  teachingCategories: string;
  specialization: string;
  motivation: string;
  certifications: string | null;
  status: "pending" | "approved" | "rejected";
  adminFeedback: string | null;
  submittedAt: string;
  processedAt: string | null;
  user?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    avatar: string | null;
  };
};

const TeacherApplicationDetail = () => {
  const { user } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Kiểm tra xem người dùng có phải là admin không
  if (!user || user.role !== "admin") {
    return (
      <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Chi tiết đơn đăng ký giáo viên</CardTitle>
            <CardDescription>
              Trang dành riêng cho quản trị viên
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <LockKeyhole className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Không có quyền truy cập</h3>
            <p className="text-muted-foreground mb-8">
              Bạn không có quyền truy cập vào trang này. Chỉ quản trị viên mới có thể xem và quản lý đơn đăng ký giáo viên.
            </p>
            <Button onClick={() => navigate("/")}>
              Trở về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applicationId = parseInt(params.id);

  // Lấy thông tin chi tiết đơn đăng ký
  const { data: application, isLoading, isError } = useQuery({
    queryKey: [`/api/teacher-applications/${applicationId}`],
    queryFn: async () => {
      const response = await fetch(`/api/teacher-applications/${applicationId}`);
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin chi tiết đơn đăng ký");
      }
      return response.json() as Promise<TeacherApplicationDetail>;
    },
  });

  // Xử lý duyệt/từ chối đơn
  const handleProcessApplication = async (status: "approved" | "rejected") => {
    setIsProcessing(true);

    try {
      const response = await apiRequest("PATCH", `/api/teacher-applications/${applicationId}`, {
        status,
        feedback: feedback.trim() || null
      });

      if (response.ok) {
        toast({
          title: status === "approved" ? "Đã duyệt đơn đăng ký" : "Đã từ chối đơn đăng ký",
          description: status === "approved" 
            ? "Người dùng đã được cấp quyền giáo viên và thông báo." 
            : "Đơn đăng ký đã bị từ chối và người dùng đã được thông báo.",
        });
        
        // Cập nhật lại dữ liệu
        queryClient.invalidateQueries({ queryKey: [`/api/teacher-applications/${applicationId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/teacher-applications"] });
      } else {
        const errorData = await response.json();
        toast({
          title: "Xử lý đơn đăng ký thất bại",
          description: errorData.message || "Có lỗi xảy ra khi xử lý đơn đăng ký.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý đơn đăng ký. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsAlertOpen(false);
      setConfirmAction(null);
    }
  };

  // Badge cho trạng thái đơn
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Đang tải thông tin đơn đăng ký...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="container py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
            <CardDescription>
              Không thể tải thông tin đơn đăng ký
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Không tìm thấy đơn đăng ký</h3>
            <p className="text-muted-foreground mb-8">
              Không thể tìm thấy đơn đăng ký với ID đã chỉ định hoặc có lỗi khi tải dữ liệu.
            </p>
            <Button onClick={() => navigate("/admin/teacher-applications")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>Chi tiết đơn đăng ký giáo viên - Aithedu Connect</title>
        <meta name="description" content="Xem chi tiết và xét duyệt đơn đăng ký giáo viên trên nền tảng Aithedu Connect" />
      </Helmet>

      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/teacher-applications")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin người đăng ký */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin người đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                {application.user?.avatar ? (
                  <AvatarImage src={application.user.avatar} alt={application.user?.fullName || "Ảnh đại diện"} />
                ) : (
                  <AvatarFallback>{application.user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-bold">{application.user?.fullName || "Không xác định"}</h3>
              <p className="text-muted-foreground">{application.user?.email || "Không có email"}</p>
              <p className="text-sm mt-2">ID: {application.userId}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ngày nộp đơn</p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {format(new Date(application.submittedAt), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Trạng thái</p>
                <div className="flex items-center gap-2">
                  {application.status === "pending" ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : application.status === "approved" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {getStatusBadge(application.status)}
                </div>
              </div>
              
              {application.status !== "pending" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ngày xử lý</p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {application.processedAt 
                      ? format(new Date(application.processedAt), 'dd/MM/yyyy HH:mm')
                      : "Chưa xử lý"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chi tiết đơn đăng ký */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <CardTitle>Chi tiết đơn đăng ký</CardTitle>
                <CardDescription>
                  {application.title}
                </CardDescription>
              </div>
              <div className="shrink-0">
                {getStatusBadge(application.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Học vấn</h3>
              </div>
              <p className="whitespace-pre-line">{application.education}</p>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Kinh nghiệm giảng dạy</h3>
              </div>
              <p className="whitespace-pre-line">{application.experience}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Lĩnh vực giảng dạy</h3>
                </div>
                <p>{application.teachingCategories}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Chuyên môn</h3>
                </div>
                <p>{application.specialization}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Học phí mong muốn</h3>
              </div>
              <p>{application.hourlyRate.toLocaleString()} VND/giờ</p>
            </div>
            
            {application.introVideo && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Video giới thiệu</h3>
                  </div>
                  <a 
                    href={application.introVideo} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block break-all"
                  >
                    {application.introVideo}
                  </a>
                </div>
              </>
            )}
            
            {application.certifications && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Chứng chỉ</h3>
                  </div>
                  <div className="space-y-2">
                    {application.certifications.split(',').map((cert, index) => (
                      <a 
                        key={index}
                        href={cert.trim()} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block break-all"
                      >
                        {cert.trim()}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Lý do muốn trở thành giáo viên</h3>
              </div>
              <p className="whitespace-pre-line">{application.motivation}</p>
            </div>
            
            {application.status !== "pending" && application.adminFeedback && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Phản hồi của quản trị viên</h3>
                  </div>
                  <p className="whitespace-pre-line">{application.adminFeedback}</p>
                </div>
              </>
            )}
          </CardContent>
          
          {/* Phần xử lý đơn đăng ký */}
          {application.status === "pending" && (
            <CardFooter className="flex-col space-y-4 border-t pt-6">
              <div className="w-full">
                <h3 className="font-semibold text-lg mb-2">Phản hồi (tùy chọn)</h3>
                <Textarea
                  placeholder="Nhập phản hồi của bạn về đơn đăng ký này"
                  className="mb-4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2 flex-1"
                      onClick={() => setConfirmAction("reject")}
                    >
                      <XCircle className="h-4 w-4" />
                      Từ chối
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {confirmAction === "approve" 
                          ? "Duyệt đơn đăng ký này?" 
                          : "Từ chối đơn đăng ký này?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {confirmAction === "approve" 
                          ? "Người dùng sẽ được cấp quyền giáo viên và có thể bắt đầu tạo khóa học và lịch dạy." 
                          : "Đơn đăng ký sẽ bị từ chối và người dùng sẽ nhận được thông báo."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleProcessApplication(confirmAction === "approve" ? "approved" : "rejected")}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                          </>
                        ) : confirmAction === "approve" ? "Duyệt" : "Từ chối"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="default" 
                  className="gap-2 flex-1"
                  onClick={() => {
                    setConfirmAction("approve");
                    setIsAlertOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Duyệt
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TeacherApplicationDetail;