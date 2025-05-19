import { useState, useEffect } from "react";
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
import { Loader2, Star, BookOpen, Clock, Users, CheckCircle, MessageSquare, Video, Upload, FileText, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CourseDetail = () => {
  const [, params] = useRoute("/courses/:id");
  const [, setLocation] = useLocation();
  const courseId = params?.id || null;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // State for enrollment
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Curriculum/lesson toggling state
  const [openStates, setOpenStates] = useState<boolean[]>([]);
  useEffect(() => {
    if (course && course.modules && Array.isArray(course.modules)) {
      // Flatten all lessons from all modules
      const allLessons = course.modules.flatMap((module: any) => module.lessons || []);
      setOpenStates(Array(allLessons.length).fill(true));
    }
  }, [course]);
  const handleToggle = (idx: number) => {
    setOpenStates((prev) => prev.map((open, i) => i === idx ? !open : open));
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      if (!courseId) {
        setError("Invalid course ID");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('courses')
        .select(`*, teachers:teacher_profile_id (id, full_name, title, avatar, rating, rating_count, bio, education, experience)`)
        .eq('id', courseId)
        .single();
      if (error || !data) {
        setError('Không thể tải thông tin khóa học. Khóa học không tồn tại hoặc đã bị xóa.');
        setCourse(null);
      } else {
        setCourse(data);
      }
      setIsLoading(false);
    };
    fetchCourse();
  }, [courseId]);

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
      // Create booking for the course (update this to use your real API if needed)
      // await apiRequest("POST", "/api/bookings", {
      //   teacherProfileId: course.teachers.id,
      //   courseId: courseId,
      // });
      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký khóa học thành công. Vui lòng thanh toán để bắt đầu học.",
      });
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
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase()
      : "?";
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
            <Button onClick={() => setLocation("/courses")}>Quay lại danh sách khóa học</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - AithEduConnect</title>
        <meta name="description" content={`Khóa học ${course.title} do giáo viên ${course.teachers?.full_name || "chuyên nghiệp"} giảng dạy. ${course.description?.substring(0, 150) || ""}`} />
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
                      <span className="ml-2">{course.rating.toFixed(1)} ({course.rating_count} đánh giá)</span>
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
                      <AvatarImage src={course.teachers?.avatar} />
                      <AvatarFallback>
                        {course.teachers?.full_name ? getInitials(course.teachers.full_name) : getInitials(course.teachers?.name || "GV")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm opacity-80">Giáo viên</p>
                      <p className="font-medium">{course.teachers?.full_name || course.teachers?.name}</p>
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

          {/* Important Numbers & Intro Video for course id 1 */}
          {course.id === 1 && (
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Important Numbers */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Thông tin nổi bật</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-7 h-7 text-primary mb-1" />
                      <span className="font-bold text-lg">{course.totalSessions}</span>
                      <span className="text-xs text-neutral-dark">Buổi học</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-7 h-7 text-primary mb-1" />
                      <span className="font-bold text-lg">{course.enrolledStudents}</span>
                      <span className="text-xs text-neutral-dark">Học viên</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Star className="w-7 h-7 text-[#ffd60a] mb-1" />
                      <span className="font-bold text-lg">{course.rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-dark">Đánh giá</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ClipboardList className="w-7 h-7 text-primary mb-1" />
                      <span className="font-bold text-lg">{course.assignmentsCount}</span>
                      <span className="text-xs text-neutral-dark">Bài tập</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="w-7 h-7 text-primary mb-1" />
                      <span className="font-bold text-lg">{course.avgSessionDuration} phút</span>
                      <span className="text-xs text-neutral-dark">/buổi</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-7 h-7 text-primary mb-1" />
                      <span className="font-bold text-lg">{course.rating_count}</span>
                      <span className="text-xs text-neutral-dark">Lượt đánh giá</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Intro Video */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Giới thiệu khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <iframe
                      src={course.introVideo}
                      title="Giới thiệu khóa học Toán Cao Cấp Cơ Bản"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-64 rounded-lg border"
                    />
                  </div>
                  <p className="text-neutral-dark text-base">
                    Khóa học Toán Cao Cấp Cơ Bản giúp bạn nắm vững kiến thức nền tảng, phát triển tư duy logic và chuẩn bị tốt cho các kỳ thi quan trọng. Được giảng dạy bởi giảng viên nhiều kinh nghiệm, khóa học này phù hợp cho học sinh, sinh viên và những ai muốn củng cố kiến thức toán học.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
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
                        <div className="space-y-6">
                          {(() => {
                            // Combine all lessons and independent assignments into a single list
                            const allLessons = course.modules.flatMap((module: any) => module.lessons);
                            const allItems = [
                              ...allLessons.map((lesson: any, idx: number) => ({ type: 'lesson', data: lesson, idx })),
                              ...(course.independentAssignments || []).map((a: any, idx: number) => ({ type: 'independent', data: a, idx: allLessons.length + idx })),
                            ];
                            return allItems.map((item: any, lIdx: number) => {
                              if (item.type === 'lesson') {
                                const lesson = item.data;
                                const assignments = lesson.contents.filter((c: any) => c.type === 'assignment');
                                const nonAssignments = lesson.contents.filter((c: any) => c.type !== 'assignment');
                                return (
                                  <div key={lesson.id} className="border rounded-lg">
                                    <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => handleToggle(lIdx)}>
                                      <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <span className="font-semibold">Buổi {lIdx + 1}: {lesson.title}</span>
                                      </div>
                                      {openStates[lIdx] ? (
                                        <ChevronUp className="w-5 h-5 text-primary" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 text-primary" />
                                      )}
                                    </div>
                                    {openStates[lIdx] && (
                                      <div className="p-4 pt-0 space-y-3">
                                        {lesson.subToc && lesson.subToc.length > 0 && (
                                          <ul className="list-disc list-inside text-sm text-neutral-dark mb-2">
                                            {lesson.subToc.map((item: string, idx: number) => (
                                              <li key={idx}>{item}</li>
                                            ))}
                                          </ul>
                                        )}
                                        {/* Render non-assignment contents in order */}
                                        {nonAssignments.map((content: any, cIdx: number) => {
                                          if (content.type === 'video') {
                                            return (
                                              <div key={cIdx} className="">
                                                <div className="font-medium mb-1">{content.title}</div>
                                                <div className="aspect-w-16 aspect-h-9">
                                                  <iframe
                                                    src={content.url}
                                                    title={content.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-64 rounded-lg border"
                                                  />
                                                </div>
                                              </div>
                                            );
                                          }
                                          if (content.type === 'reading') {
                                            return (
                                              <div key={cIdx} className="">
                                                <div className="font-medium mb-1">{content.title}</div>
                                                <a href={content.url} className="text-primary underline" target="_blank" rel="noopener noreferrer">Tải tài liệu</a>
                                              </div>
                                            );
                                          }
                                          if (content.type === 'slide') {
                                            return (
                                              <div key={cIdx} className="">
                                                <div className="font-medium mb-1">{content.title}</div>
                                                <a href={content.url} className="text-primary underline" target="_blank" rel="noopener noreferrer">Xem slide</a>
                                              </div>
                                            );
                                          }
                                          return null;
                                        })}
                                        {/* Render assignments at the end of the lesson */}
                                        {assignments.length > 0 && (
                                          <div className="space-y-3 mt-4">
                                            {assignments.map((content: any, cIdx: number) => (
                                              <div key={cIdx} className="bg-neutral-lightest border rounded p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <ClipboardList className="w-4 h-4 text-primary" />
                                                  <span className="font-semibold">{content.title}</span>
                                                </div>
                                                <div className="text-sm mb-2">{content.description}</div>
                                                {/* Assignment upload/comment UI (demo only) */}
                                                <div className="flex flex-col gap-2">
                                                  <label className="text-xs font-medium">Nộp bài tập:</label>
                                                  <Input type="file" className="max-w-xs" />
                                                  <Textarea placeholder="Nhập bình luận hoặc trả lời bài tập..." className="max-w-lg" />
                                                  <Button size="sm" className="w-fit">Nộp bài</Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              } else if (item.type === 'independent') {
                                const a = item.data;
                                return (
                                  <div key={lIdx} className="border rounded-lg">
                                    <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => handleToggle(lIdx)}>
                                      <div className="flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4 text-primary" />
                                        <span className="font-semibold">Bài kiểm tra {lIdx + 1}: {a.title}</span>
                                      </div>
                                      {openStates[lIdx] ? (
                                        <ChevronUp className="w-5 h-5 text-primary" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 text-primary" />
                                      )}
                                    </div>
                                    {openStates[lIdx] && (
                                      <div className="p-4 pt-0">
                                        <div className="text-sm mb-2">{a.description}</div>
                                        <div className="flex flex-col gap-2">
                                          <label className="text-xs font-medium">Nộp bài tập:</label>
                                          <Input type="file" className="max-w-xs" />
                                          <Textarea placeholder="Nhập bình luận hoặc trả lời bài tập..." className="max-w-lg" />
                                          <Button size="sm" className="w-fit">Nộp bài</Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            });
                          })()}
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
                            {course.reviews.map((review: any) => (
                              <div key={review.id} className="border-b pb-6 last:border-b-0">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.student?.avatar} />
                                    <AvatarFallback>
                                      {review.student?.full_name ? getInitials(review.student.full_name) : "HV"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{review.student?.full_name}</h4>
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
                        <AvatarImage src={course.teachers?.avatar} />
                        <AvatarFallback className="text-xl">
                          {course.teachers?.full_name ? getInitials(course.teachers.full_name) : "GV"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{course.teachers?.full_name}</h3>
                        <p className="text-sm text-neutral-dark">{course.teachers?.title}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-[#ffd60a] fill-[#ffd60a] mr-1" />
                          <span className="text-sm">{course.teachers?.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-neutral-dark mb-4">
                      {course.teachers?.experience || "Giáo viên có nhiều năm kinh nghiệm giảng dạy trong lĩnh vực chuyên môn."}
                    </p>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <a href={`/teachers/${course.teachers?.id}`}>Xem hồ sơ giáo viên</a>
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
                        Vui lòng <a href="/login" className="text-primary">đăng nhập</a> để liên hệ với giáo viên
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
                      <AvatarImage src={course.teachers?.avatar} />
                      <AvatarFallback>
                        {course.teachers?.full_name ? getInitials(course.teachers.full_name) : "GV"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{course.teachers?.full_name}</span>
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
