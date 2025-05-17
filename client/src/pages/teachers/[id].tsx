import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, CheckCircle, Clock, MapPin, ArrowLeft, StarIcon, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDetailPage() {
  const [, params] = useRoute('/teachers/:id');
  const teacherId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch thông tin giáo viên
  const { data: teacher, isLoading, isError } = useQuery({
    queryKey: [`/api/teacher-profiles/${teacherId}`],
  });

  // Render sao đánh giá
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 
                i < rating ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Render skeleton loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-6 w-40" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/teachers">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách giáo viên
          </Button>
        </Link>
        
        <div className="bg-red-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Không tìm thấy thông tin giáo viên</h2>
          <p className="text-gray-700">Có lỗi xảy ra khi tải thông tin giáo viên. Vui lòng thử lại sau.</p>
          <Link href="/teachers">
            <Button className="mt-4">Quay lại trang tìm kiếm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/teachers">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách giáo viên
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin chính và tab nội dung */}
        <div className="lg:col-span-2 space-y-8">
          {/* Phần thông tin chính của giáo viên */}
          <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow-sm">
            <Avatar className="h-32 w-32 md:h-40 md:w-40">
              <AvatarImage src={teacher.user?.avatar || undefined} alt={teacher.user?.fullName} />
              <AvatarFallback>{teacher.user?.fullName?.charAt(0) || "T"}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{teacher.user?.fullName}</h1>
              <h2 className="text-xl text-gray-700">{teacher.title}</h2>
              
              <div className="flex items-center">
                {renderStars(teacher.rating || 0)}
                <span className="ml-2 text-gray-500">({teacher.ratingCount || 0} đánh giá)</span>
              </div>
              
              {teacher.isVerified && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Giáo viên đã xác thực</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                {teacher.subjects?.map((subject: any, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {subject.category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tabs nội dung */}
          <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
              <TabsTrigger value="courses">Khóa học</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>
            
            {/* Tab hồ sơ */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Giới thiệu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Học vấn</h3>
                      <p>{teacher.education || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Kinh nghiệm</h3>
                      <p>{teacher.experience || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                  
                  {teacher.introVideo && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Video giới thiệu</h3>
                      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
                        {/* Đây sẽ là embed video, có thể sử dụng iframe hoặc video player */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button variant="outline" size="lg" className="gap-2">
                            <Play className="h-5 w-5" /> Xem video giới thiệu
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Phương pháp giảng dạy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {teacher.teachingMethod || "Giáo viên chưa cập nhật phương pháp giảng dạy."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab khóa học */}
            <TabsContent value="courses" className="space-y-6">
              {teacher.courses && teacher.courses.length > 0 ? (
                teacher.courses.map((course: any) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">{course.description}</p>
                      <div className="flex items-center mt-4">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-500">{course.totalSessions} buổi học</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="font-semibold text-primary">
                        {course.price.toLocaleString('vi-VN')} đ
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline">Chi tiết</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-medium mb-2">Chưa có khóa học</h3>
                  <p className="text-gray-500">Giáo viên này chưa tạo khóa học nào.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Tab đánh giá */}
            <TabsContent value="reviews" className="space-y-6">
              {teacher.reviews && teacher.reviews.length > 0 ? (
                teacher.reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.student?.avatar || undefined} />
                            <AvatarFallback>{review.student?.fullName?.charAt(0) || "S"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{review.student?.fullName || "Học viên ẩn danh"}</CardTitle>
                            <CardDescription>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</CardDescription>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{review.comment || "Không có bình luận."}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-medium mb-2">Chưa có đánh giá</h3>
                  <p className="text-gray-500">Giáo viên này chưa nhận được đánh giá nào.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar bên phải */}
        <div className="space-y-6">
          {/* Hiển thị giá và đặt lịch */}
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                {teacher.hourlyRate?.toLocaleString('vi-VN')} đ
                <span className="text-base font-normal text-gray-500">/giờ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Trực tuyến</span>
              </div>
              <Link href={`/booking/${teacherId}`}>
                <Button className="w-full">Đặt lịch học</Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Thời gian sẵn có */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch trống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">Hôm nay</span>
                  </div>
                  <Badge variant="outline">3 giờ trống</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-700">Tuần này</span>
                  </div>
                  <Badge variant="outline">12 giờ trống</Badge>
                </div>
                <Link href={`/booking/${teacherId}`}>
                  <Button variant="outline" className="w-full">Xem lịch chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}