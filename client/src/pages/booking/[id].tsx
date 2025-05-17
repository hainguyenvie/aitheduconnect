import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, ArrowLeft, Clock, ArrowRight, ArrowLeft as ArrowPrev } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function BookingPage() {
  const [, params] = useRoute('/booking/:id');
  const teacherId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState('lessons');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const { toast } = useToast();

  // Fetch thông tin giáo viên
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: [`/api/teacher-profiles/${teacherId}`],
  });

  // Fetch lịch dạy của giáo viên
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: [`/api/teachers/${teacherId}/schedules`],
  });

  // Xử lý đặt lịch học
  const handleBooking = async () => {
    try {
      if (!selectedTimeSlot && !selectedCourse) {
        toast({
          title: "Không thể đặt lịch",
          description: "Vui lòng chọn khung giờ hoặc khóa học",
          variant: "destructive",
        });
        return;
      }

      const bookingData = selectedTimeSlot 
        ? {
            teacherProfileId: teacherId,
            scheduleId: parseInt(selectedTimeSlot),
          }
        : {
            teacherProfileId: teacherId,
            courseId: selectedCourse,
          };

      const response = await apiRequest('POST', '/api/bookings', bookingData);
      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Đặt lịch thành công",
          description: "Yêu cầu đặt lịch học của bạn đã được gửi đi",
        });
        // Chuyển tới trang thanh toán
        window.location.href = `/payment/${result.id}`;
      } else {
        throw new Error(result.message || "Không thể đặt lịch học");
      }
    } catch (error: any) {
      toast({
        title: "Đặt lịch thất bại",
        description: error.message || "Đã xảy ra lỗi khi đặt lịch học",
        variant: "destructive",
      });
    }
  };

  // Tạo danh sách ngày trong tuần hiện tại
  const getWeekDays = () => {
    const startDate = startOfWeek(addWeeks(new Date(), currentWeek), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  };

  // Lọc khung giờ theo ngày
  const getTimeSlotsByDate = (date: Date) => {
    if (!schedules) return [];
    
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    return schedules.filter((schedule: any) => {
      const scheduleDate = format(new Date(schedule.startTime), 'yyyy-MM-dd');
      return scheduleDate === selectedDateStr && schedule.status === 'available';
    });
  };

  // Format thời gian
  const formatTimeSlot = (startTime: string, endTime: string) => {
    return `${format(new Date(startTime), 'HH:mm')} - ${format(new Date(endTime), 'HH:mm')}`;
  };

  // Render skeleton loading
  if (teacherLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-6 w-40" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
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

  const weekDays = getWeekDays();
  const selectedDateTimeSlots = selectedDate ? getTimeSlotsByDate(selectedDate) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href={`/teachers/${teacherId}`}>
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại thông tin giáo viên
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Đặt lịch học</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Phần chọn lịch/khóa học */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={teacher.user?.avatar || undefined} alt={teacher.user?.fullName} />
                <AvatarFallback>{teacher.user?.fullName?.charAt(0) || "T"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{teacher.user?.fullName}</CardTitle>
                <CardDescription>{teacher.title}</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="lessons" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mx-6">
                  <TabsTrigger value="lessons">Đặt buổi học</TabsTrigger>
                  <TabsTrigger value="courses">Đăng ký khóa học</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lessons" className="p-6 pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Chọn ngày</h3>
                      <div className="flex justify-between items-center mb-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentWeek(prev => prev - 1)}
                        >
                          <ArrowPrev className="h-4 w-4 mr-1" /> Tuần trước
                        </Button>
                        <span className="font-medium">
                          {format(weekDays[0], 'dd/MM')} - {format(weekDays[6], 'dd/MM')}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentWeek(prev => prev + 1)}
                        >
                          Tuần sau <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((date, i) => (
                          <Button
                            key={i}
                            variant={selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') ? "default" : "outline"}
                            className="flex flex-col h-auto py-2"
                            onClick={() => setSelectedDate(date)}
                          >
                            <span className="text-xs">{format(date, 'EEE', { locale: vi })}</span>
                            <span className="text-lg">{format(date, 'dd')}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Chọn giờ học</h3>
                      {schedulesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : selectedDateTimeSlots.length > 0 ? (
                        <RadioGroup value={selectedTimeSlot || ''} onValueChange={setSelectedTimeSlot}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {selectedDateTimeSlots.map((slot: any) => (
                              <div key={slot.id}>
                                <RadioGroupItem
                                  value={slot.id.toString()}
                                  id={`slot-${slot.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`slot-${slot.id}`}
                                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <Clock className="mb-1 h-4 w-4" />
                                  <span>
                                    {formatTimeSlot(slot.startTime, slot.endTime)}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-gray-500">Không có khung giờ trống vào ngày này</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="courses" className="p-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Chọn khóa học</h3>
                    
                    {teacher.courses && teacher.courses.length > 0 ? (
                      <RadioGroup value={selectedCourse?.toString() || ''} onValueChange={(value) => setSelectedCourse(parseInt(value))}>
                        <div className="space-y-4">
                          {teacher.courses.map((course: any) => (
                            <div key={course.id} className="relative">
                              <RadioGroupItem
                                value={course.id.toString()}
                                id={`course-${course.id}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`course-${course.id}`}
                                className="flex flex-col p-4 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">{course.title}</span>
                                  <Badge variant="outline">{course.category}</Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                    <span className="text-sm text-gray-500">{course.totalSessions} buổi học</span>
                                  </div>
                                  <span className="font-semibold text-primary">{course.price.toLocaleString('vi-VN')} đ</span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <h3 className="text-xl font-medium mb-2">Chưa có khóa học</h3>
                        <p className="text-gray-500">Giáo viên này chưa tạo khóa học nào.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Phần tóm tắt và thanh toán */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Tóm tắt đặt lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Giáo viên</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={teacher.user?.avatar || undefined} alt={teacher.user?.fullName} />
                    <AvatarFallback>{teacher.user?.fullName?.charAt(0) || "T"}</AvatarFallback>
                  </Avatar>
                  <span>{teacher.user?.fullName}</span>
                </div>
              </div>
              
              {activeTab === 'lessons' && selectedTimeSlot && (
                <div className="space-y-2">
                  <h3 className="font-medium">Thời gian</h3>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedDate && format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedDateTimeSlots.find((slot: any) => slot.id.toString() === selectedTimeSlot) ? 
                        formatTimeSlot(
                          selectedDateTimeSlots.find((slot: any) => slot.id.toString() === selectedTimeSlot).startTime,
                          selectedDateTimeSlots.find((slot: any) => slot.id.toString() === selectedTimeSlot).endTime
                        ) : ''}
                    </span>
                  </div>
                </div>
              )}
              
              {activeTab === 'courses' && selectedCourse && teacher.courses && (
                <div className="space-y-2">
                  <h3 className="font-medium">Khóa học</h3>
                  <div>
                    {teacher.courses.find((c: any) => c.id === selectedCourse)?.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{teacher.courses.find((c: any) => c.id === selectedCourse)?.totalSessions} buổi học</span>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {activeTab === 'lessons' && teacher ? 
                      `${teacher.hourlyRate?.toLocaleString('vi-VN')} đ` : 
                      selectedCourse && teacher.courses ? 
                        `${teacher.courses.find((c: any) => c.id === selectedCourse)?.price.toLocaleString('vi-VN')} đ` :
                        '0 đ'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!(selectedTimeSlot || selectedCourse)}
                onClick={handleBooking}
              >
                Tiếp tục đặt lịch
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}