import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
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
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Star, BookOpen, Clock, Users, CheckCircle, MessageSquare, Video } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const CourseDetail = () => {
  const [, params] = useRoute("/courses/:id");
  const [, setLocation] = useLocation();
  const courseId = params?.id ? parseInt(params.id) : null;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // State for enrollment
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch course
  const { data: course, isLoading, error } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    queryFn: async () => {
      if (!courseId) throw new Error("Invalid course ID");
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      return response.json();
    },
    enabled: !!courseId,
  });

  // Format price in Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get category name in Vietnamese
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      mathematics: "Toán học",
      languages: "Ngoại ngữ",
      programming: "Lập trình",
      music: "Âm nhạc",
      science: "Khoa học",
      art: "Nghệ thuật",
    };
    
    return categories[category] || category;
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký khóa học này.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    try {
      setIsEnrolling(true);
      
      // Create booking for the course
      await apiRequest("POST", "/api/bookings", {
        teacherProfileId: course.teacher.id,
        courseId: courseId,
      });

      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký khóa học thành công. Vui lòng thanh toán để bắt đầu học.",
      });

      // Close dialog and redirect to dashboard
      setEnrollDialog(false);
      setLocation("/dashboard/student");
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-[#ffd60a] text-[#ffd60a]" />
        ))}
        {hasHalfStar && (
          <span key="half" className="relative">
            <Star className="w-4 h-4 text-[#ffd60a]" />
            <Star className="absolute top-0 left-0 w-4 h-4 fill-[#ffd60a] text-[#ffd60a] w-[50%] overflow-hidden" />
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-[#ffd60a]" />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy thông tin khóa học</h2>
            <p className="text-neutral-dark mb-6">
              Không thể tải thông tin khóa học. Khóa học không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => setLocation("/courses")}>
              Quay lại danh sách khóa học
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - EduViet</title>
        <meta name="description" content={`Khóa học ${course.title} do giáo viên ${course.teacher?.user?.fullName || "chuyên nghiệp"} giảng dạy. ${course.description?.substring(0, 150) || ""}`} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-neutral-lightest">
          {/* Breadcrumbs */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/courses">Khóa học</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>{course.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          
          {/* Course Header */}
          <div className="bg-primary text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <Badge className="bg-white text-primary mb-3">
                    {getCategoryName(course.category)}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      {getRatingStars(course.rating)}
                      <span className="ml-2">{course.rating.toFixed(1)} ({course.ratingCount} đánh giá)</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.totalSessions} buổi học
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrolledStudents} học viên
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src={course.teacher?.user?.avatar} />
                      <AvatarFallback>
                        {course.teacher?.user?.fullName ? getInitials(course.teacher.user.fullName) : "GV"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm opacity-80">Giáo viên</p>
                      <p className="font-medium">{course.teacher?.user?.fullName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <Card className="w-full">
                    <CardContent className="p-6">
                      <div className="text-neutral-darkest">
                        <div className="mb-4">
                          <p className="text-sm text-neutral-dark">Học phí</p>
                          <p className="text-3xl font-bold text-[#e63946]">{formatPrice(course.price)}</p>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-[#00b8a9] mr-2" />
                            <span>{course.totalSessions} buổi học</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-[#00b8a9] mr-2" />
                            <span>Học trực tuyến cùng giáo viên</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-[#00b8a9] mr-2" />
                            <span>Tài liệu học tập</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-[#00b8a9] mr-2" />
                            <span>Hỗ trợ trực tuyến</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-[#00b8a9] mr-2" />
                            <span>Chứng chỉ hoàn thành</span>
                          </li>
                        </ul>
                        
                        <Button 
                          onClick={() => setEnrollDialog(true)}
                          className="w-full bg-[#e63946] hover:bg-red-700 text-white mb-3"
                        >
                          Đăng ký khóa học
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Course Details */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="mb-6">
                  <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="curriculum">Nội dung khóa học</TabsTrigger>
                    <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tổng quan khóa học</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Mô tả khóa học</h3>
                          <p className="text-neutral-dark whitespace-pre-line">
                            {course.description}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Học viên sẽ học được gì?</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-[#00b8a9] mr-2 shrink-0 mt-0.5" />
                              <span>Những kiến thức cơ bản và nâng cao về {getCategoryName(course.category)}</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-[#00b8a9] mr-2 shrink-0 mt-0.5" />
                              <span>Phương pháp học tập hiệu quả và áp dụng kiến thức vào thực tế</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-[#00b8a9] mr-2 shrink-0 mt-0.5" />
                              <span>Kỹ năng giải quyết vấn đề và tư duy phản biện</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-[#00b8a9] mr-2 shrink-0 mt-0.5" />
                              <span>Nền tảng vững chắc để tiếp tục phát triển trong lĩnh vực này</span>
                            </li>
                          </ul>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Yêu cầu</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-primary mr-2 shrink-0 mt-0.5" />
                              <span>Không yêu cầu kiến thức nền tảng, phù hợp cho người mới bắt đầu</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-primary mr-2 shrink-0 mt-0.5" />
                              <span>Máy tính kết nối internet ổn định</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-primary mr-2 shrink-0 mt-0.5" />
                              <span>Tinh thần học tập chủ động và kiên trì</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="curriculum">
                    <Card>
                      <CardHeader>
                        <CardTitle>Nội dung khóa học</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Array.from({ length: course.totalSessions }, (_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Buổi {i + 1}</h3>
                                <Badge variant="outline" className="bg-neutral-lightest">
                                  <Clock className="w-3 h-3 mr-1" /> 90 phút
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-dark mb-2">
                                {course.category === "mathematics" ? "Chủ đề về đại số và hình học" :
                                 course.category === "languages" ? "Bài học ngữ pháp và từ vựng" :
                                 course.category === "programming" ? "Bài tập lập trình cơ bản" :
                                 course.category === "music" ? "Thực hành âm nhạc" :
                                 course.category === "science" ? "Thí nghiệm khoa học" :
                                 "Bài học thực hành"}
                              </p>
                              <div className="flex items-center text-xs text-primary">
                                <Video className="w-3 h-3 mr-1" /> Học trực tuyến cùng giáo viên
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>Đánh giá từ học viên</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {course.reviews && course.reviews.length > 0 ? (
                          <div className="space-y-6">
                            {course.reviews.map((review) => (
                              <div key={review.id} className="border-b pb-6 last:border-b-0">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.student?.avatar} />
                                    <AvatarFallback>
                                      {review.student?.fullName ? getInitials(review.student.fullName) : "HV"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{review.student?.fullName}</h4>
                                      <span className="text-xs text-neutral-medium">
                                        {format(new Date(review.createdAt), "dd MMMM, yyyy", { locale: vi })}
                                      </span>
                                    </div>
                                    <div className="flex my-1">
                                      {getRatingStars(review.rating)}
                                    </div>
                                    <p className="text-neutral-dark mt-2">{review.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Star className="w-12 h-12 text-neutral-medium mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-1">Chưa có đánh giá</h3>
                            <p className="text-neutral-dark">
                              Khóa học này chưa nhận được đánh giá nào từ học viên.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right Column - Teacher Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Về giáo viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.teacher?.user?.avatar} />
                        <AvatarFallback className="text-xl">
                          {course.teacher?.user?.fullName ? getInitials(course.teacher.user.fullName) : "GV"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{course.teacher?.user?.fullName}</h3>
                        <p className="text-sm text-neutral-dark">{course.teacher?.title}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-[#ffd60a] fill-[#ffd60a] mr-1" />
                          <span className="text-sm">{course.teacher?.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-neutral-dark mb-4">
                      {course.teacher?.experience || "Giáo viên có nhiều năm kinh nghiệm giảng dạy trong lĩnh vực chuyên môn."}
                    </p>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <a href={`/teachers/${course.teacher?.id}`}>Xem hồ sơ giáo viên</a>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Liên hệ hỗ trợ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      disabled={!isAuthenticated}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Nhắn tin với giáo viên
                    </Button>
                    
                    {!isAuthenticated && (
                      <p className="text-sm text-neutral-dark text-center">
                        Vui lòng <Link href="/login"><a className="text-primary">đăng nhập</a></Link> để liên hệ với giáo viên
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Enrollment Dialog */}
          <Dialog open={enrollDialog} onOpenChange={setEnrollDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Xác nhận đăng ký khóa học</DialogTitle>
                <DialogDescription>
                  Vui lòng xác nhận thông tin đăng ký khóa học
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Khóa học:</p>
                  <p className="font-medium">{course.title}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Giáo viên:</p>
                  <div className="flex items-center">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage src={course.teacher?.user?.avatar} />
                      <AvatarFallback>
                        {course.teacher?.user?.fullName ? getInitials(course.teacher.user.fullName) : "GV"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{course.teacher?.user?.fullName}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Số buổi học:</p>
                  <p>{course.totalSessions} buổi</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Học phí:</p>
                  <p className="text-lg font-bold text-[#e63946]">{formatPrice(course.price)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phương thức thanh toán:</p>
                  <p className="text-sm">Thanh toán online sau khi đăng ký thành công</p>
                </div>
              </div>
              
              <DialogFooter className="flex sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEnrollDialog(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  className="bg-[#e63946] hover:bg-red-700"
                  disabled={isEnrolling}
                  onClick={handleEnroll}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận đăng ký"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CourseDetail;
