import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Clock, Book, Calendar, MapPin, DollarSign, 
  X, Star, Users, CheckCircle, MessageCircle, Video, Briefcase,
  GraduationCap, ChevronDown, ChevronUp, Bookmark, ShoppingCart,
  CreditCard, Check, ArrowRight, Layers, User, Play
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcons } from '@/lib/icons';

// Booking Dialog Component
interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teacherId: number;
  teacherName: string;
}

const BookingDialog = ({ isOpen, onOpenChange, teacherId, teacherName }: BookingDialogProps) => {
  const [bookingStep, setBookingStep] = useState<'schedule' | 'payment'>('schedule');
  const [selectedSchedule, setSelectedSchedule] = useState<{day: string, time: string} | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [bookingType, setBookingType] = useState<'single' | 'course'>('single');
  
  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Handle payment processing
  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Calculate the amount based on selected booking
      let amount = 0;
      let bookingType = 'single';
      let courseId = null;
      
      if (selectedSchedule) {
        bookingType = 'single';
        amount = 350000; // Hourly rate for single session
      } else if (selectedCourse) {
        bookingType = 'course';
        courseId = selectedCourse;
        amount = selectedCourse === 1 ? 2500000 :
                selectedCourse === 2 ? 3000000 : 3750000;
      }
      
      // Create a payment intent through our API
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingType,
          teacherId,
          courseId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const { id: paymentIntentId } = await response.json();
      
      // In a real app, we would use the clientSecret with Stripe.js
      // For demo, we'll use a simulated payment status check
      setTimeout(async () => {
        try {
          const statusResponse = await fetch(`/api/payment-status/${paymentIntentId}`);
          const { status } = await statusResponse.json();
          
          setIsProcessingPayment(false);
          if (status === 'succeeded') {
            setPaymentComplete(true);
          } else {
            alert('Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          setIsProcessingPayment(false);
          alert('An error occurred while checking payment status.');
        }
      }, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessingPayment(false);
      alert('An error occurred while processing your payment.');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {bookingStep === 'schedule' 
              ? 'Đặt lịch học với ' + teacherName
              : 'Thanh toán'}
          </DialogTitle>
          <DialogDescription>
            {bookingStep === 'schedule'
              ? 'Chọn thời gian và loại buổi học phù hợp với bạn'
              : 'Hoàn tất thanh toán cho buổi học của bạn'}
          </DialogDescription>
        </DialogHeader>
        
        {bookingStep === 'schedule' ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Chọn loại buổi học:</h3>
              <RadioGroup
                defaultValue={bookingType}
                onValueChange={(value) => setBookingType(value as 'single' | 'course')}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="cursor-pointer flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Buổi học đơn lẻ</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="course" id="course" />
                  <Label htmlFor="course" className="cursor-pointer flex items-center">
                    <Book className="w-4 h-4 mr-2" />
                    <span>Khóa học</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {bookingType === 'single' ? (
              <div>
                <h3 className="font-medium mb-3">Chọn thời gian:</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, dayIdx) => (
                    <div key={dayIdx} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">{day}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"].map((time, timeIdx) => (
                          <div 
                            key={timeIdx} 
                            className={`${
                              selectedSchedule?.day === day && selectedSchedule?.time === time
                                ? 'bg-primary text-white'
                                : 'bg-green-100 text-green-800'
                            } rounded p-2 text-sm text-center cursor-pointer hover:bg-primary/80 hover:text-white transition-colors`}
                            onClick={() => setSelectedSchedule({ day, time })}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-3">Chọn khóa học:</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { id: 1, title: "Toán cao cấp cơ bản", lessons: 10, price: 2500000 },
                    { id: 2, title: "Đại số tuyến tính", lessons: 12, price: 3000000 },
                    { id: 3, title: "Giải tích", lessons: 15, price: 3750000 }
                  ].map((course) => (
                    <div 
                      key={course.id}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedCourse === course.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-600">{course.lessons} buổi học</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{new Intl.NumberFormat('vi-VN').format(course.price)}đ</p>
                          <p className="text-xs text-gray-500">({new Intl.NumberFormat('vi-VN').format(course.price / course.lessons)}đ/buổi)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Huỷ
              </Button>
              <Button 
                onClick={() => setBookingStep('payment')} 
                disabled={!(selectedSchedule || selectedCourse)}
              >
                Tiếp tục <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!paymentComplete ? (
              <>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giáo viên:</span>
                      <span className="font-medium">{teacherName}</span>
                    </div>
                    {bookingType === 'single' && selectedSchedule && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Buổi học:</span>
                          <span className="font-medium">
                            {selectedSchedule.day}, {selectedSchedule.time}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá tiền:</span>
                          <span className="font-medium">350,000đ</span>
                        </div>
                      </>
                    )}
                    
                    {bookingType === 'course' && selectedCourse && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Khóa học:</span>
                          <span className="font-medium">
                            {selectedCourse === 1 ? "Toán cao cấp cơ bản" :
                             selectedCourse === 2 ? "Đại số tuyến tính" : "Giải tích"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số buổi:</span>
                          <span className="font-medium">
                            {selectedCourse === 1 ? "10 buổi" :
                             selectedCourse === 2 ? "12 buổi" : "15 buổi"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá tiền:</span>
                          <span className="font-medium">
                            {selectedCourse === 1 ? "2,500,000đ" :
                             selectedCourse === 2 ? "3,000,000đ" : "3,750,000đ"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                  <RadioGroup defaultValue="credit" className="space-y-3">
                    <div className="border rounded-lg p-3 flex items-center space-x-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center cursor-pointer">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Thẻ tín dụng / Ghi nợ</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-3 flex items-center space-x-3">
                      <RadioGroupItem value="banking" id="banking" />
                      <Label htmlFor="banking" className="flex items-center cursor-pointer">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-4 h-4 mr-2"
                          style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
                        >
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        <span>Internet Banking</span>
                      </Label>
                    </div>
                    <div className="border rounded-lg p-3 flex items-center space-x-3">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet" className="flex items-center cursor-pointer">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-4 h-4 mr-2"
                          style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <circle cx="12" cy="12" r="4" />
                          <path d="M2 12h4" />
                          <path d="M18 12h4" />
                        </svg>
                        <span>Ví điện tử</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setBookingStep('schedule')}
                    disabled={isProcessingPayment}
                  >
                    Quay lại
                  </Button>
                  <Button 
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="relative"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <span className="opacity-0">Thanh toán</span>
                      </>
                    ) : (
                      <>
                        <span>Thanh toán</span>
                        <CreditCard className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Thanh toán thành công!</h3>
                <p className="text-gray-500 mb-6">
                  Lịch học của bạn đã được đặt. Giáo viên sẽ liên hệ với bạn sớm nhất.
                </p>
                <Button onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface TeacherDetailModalProps {
  teacherId: number;
  isOpen: boolean;
  onClose: () => void;
}

const TeacherDetailModal = ({ teacherId, isOpen, onClose }: TeacherDetailModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  // Fetch teacher profile data
  const { data: teacher, isLoading, error } = useQuery({
    queryKey: ['/api/teacher-profiles', teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teacher-profiles/${teacherId}`);
      if (!res.ok) throw new Error('Failed to fetch teacher');
      return res.json();
    },
    enabled: isOpen && teacherId > 0,
  });
  
  // Fetch teacher schedules
  const { data: schedules } = useQuery({
    queryKey: ['/api/teachers', teacherId, 'schedules'],
    enabled: isOpen && teacherId > 0,
  });
  
  // Fetch teacher reviews
  const { data: reviews } = useQuery({
    queryKey: ['/api/teachers', teacherId, 'reviews'],
    enabled: isOpen && activeTab === 'reviews' && teacherId > 0,
  });
  
  // Fetch teacher courses
  const { data: courses } = useQuery({
    queryKey: ['/api/teachers', teacherId, 'courses'],
    enabled: isOpen && activeTab === 'courses' && teacherId > 0,
  });
  
  const [selectedSchedule, setSelectedSchedule] = useState<{
    day: string;
    time: string;
  } | null>(null);
  
  if (!isOpen) return null;
  if (isLoading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">Đang tải...</div>;
  if (error || !teacher) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">Không tìm thấy giáo viên</div>;
  
  // Render the booking dialog component
  const renderBookingDialog = () => (
    <BookingDialog 
      isOpen={isBookingDialogOpen}
      onOpenChange={setIsBookingDialogOpen}
      teacherId={teacherId}
      teacherName={teacher.fullName}
    />
  );
  
  // Mock course data
  const mockCourses = [
    {
      id: 1,
      title: "Toán cao cấp cơ bản",
      description: "Khóa học cung cấp nền tảng vững chắc về toán cao cấp cho học sinh THPT chuẩn bị thi đại học.",
      thumbnail: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      price: 2500000,
      duration: "10 buổi",
      rating: 4.9,
      enrolledStudents: 124,
      totalSessions: 15
    },
    {
      id: 2,
      title: "Đại số tuyến tính",
      description: "Khóa học chuyên sâu về đại số tuyến tính, ma trận và ứng dụng trong không gian vector.",
      thumbnail: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      price: 3000000,
      duration: "12 buổi",
      rating: 4.8,
      enrolledStudents: 96,
      totalSessions: 12
    },
    {
      id: 3,
      title: "Giải tích",
      description: "Khóa học về giải tích đa biến, tích phân, đạo hàm và các ứng dụng trong thực tế.",
      thumbnail: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      price: 3750000,
      duration: "15 buổi",
      rating: 4.9,
      enrolledStudents: 84,
      totalSessions: 15
    }
  ];
  
  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      rating: 5,
      content: "Cô giáo Minh Tâm dạy rất tận tâm và dễ hiểu. Nhờ có cô mà tôi đã đạt điểm cao trong kỳ thi THPT.",
      studentName: "Nguyễn Văn An",
      studentAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "15/04/2023"
    },
    {
      id: 2,
      rating: 5,
      content: "Phương pháp giảng dạy của cô rất hiệu quả, giúp tôi hiểu sâu về các khái niệm toán học phức tạp.",
      studentName: "Trần Thị Bình",
      studentAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "22/03/2023"
    },
    {
      id: 3,
      rating: 4,
      content: "Cô giáo nhiệt tình và luôn sẵn sàng giải đáp thắc mắc ngoài giờ học. Tuy nhiên, đôi khi tốc độ hơi nhanh.",
      studentName: "Lê Hoàng Nam",
      studentAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      date: "10/03/2023"
    },
    {
      id: 4,
      rating: 5,
      content: "Tôi rất hài lòng với khóa học của cô. Cách truyền đạt dễ hiểu và có nhiều bài tập thực hành.",
      studentName: "Phạm Minh Hương",
      studentAvatar: "https://randomuser.me/api/portraits/women/17.jpg", 
      date: "01/03/2023"
    }
  ];
  
  const renderCourseTab = () => {
    return (
      <div className="space-y-4 mt-4">
        {mockCourses.map(course => (
          <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex md:flex-row flex-col">
              <div className="md:w-1/3 h-40 md:h-auto overflow-hidden bg-gray-100">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="md:w-2/3 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{course.title}</h3>
                  <Badge className="bg-primary text-white">{new Intl.NumberFormat('vi-VN').format(course.price)}đ</Badge>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 w-4 h-4 text-gray-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-1 w-4 h-4 text-gray-500" />
                    <span>{course.enrolledStudents} học viên</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 w-4 h-4 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center"
                  >
                    <Bookmark className="mr-1 w-3 h-3" />
                    <span>Lưu khóa học</span>
                  </Button>
                  <Button 
                    size="sm"
                    className="flex items-center"
                    onClick={() => {
                      setIsBookingDialogOpen(true);
                    }}
                  >
                    <ShoppingCart className="mr-1 w-3 h-3" />
                    <span>Đăng ký ngay</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderReviewsTab = () => {
    return (
      <div className="space-y-6 mt-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg flex flex-col items-center">
            <div className="text-4xl font-bold text-primary">{teacher.rating}</div>
            <div className="flex items-center my-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(teacher.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">{teacher.ratingCount} đánh giá</div>
          </div>
          
          <div className="md:w-2/3">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                // Calculate percentage of reviews for each rating
                const percent = rating === 5 ? 80 : 
                               rating === 4 ? 15 : 
                               rating === 3 ? 5 : 
                               rating === 2 ? 0 : 0;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="w-12 flex items-center">
                      <span>{rating}</span>
                      <Star className="w-3 h-3 ml-1 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 mx-3">
                      <Progress value={percent} className="h-2" />
                    </div>
                    <div className="w-12 text-right text-sm text-gray-600">
                      {percent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {mockReviews.map(review => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start">
                <Avatar>
                  <img
                    src={review.studentAvatar}
                    alt={review.studentName}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{review.studentName}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-600">{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderScheduleTab = () => {
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Lịch dạy trong tuần</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
            onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
          >
            {isScheduleExpanded ? (
              <>
                <ChevronUp className="mr-1 w-4 h-4" />
                <span>Thu gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 w-4 h-4" />
                <span>Xem tất cả</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          {Array.isArray(teacher.availability) && teacher.availability.length > 0 ? (
            teacher.availability.slice(0, isScheduleExpanded ? undefined : 3).map((day: { day: string; slots: string[] }, index: number) => (
            <div key={index} className="border rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">{day.day}</h4>
              <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot: string, slotIndex: number) => (
                  <Badge 
                    key={slotIndex} 
                    variant="secondary"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">Chưa cập nhật</div>
          )}
        </div>
        
        {!isScheduleExpanded && Array.isArray(teacher.availability) && teacher.availability.length > 3 && (
          <Button 
            variant="link" 
            className="mt-2 text-primary"
            onClick={() => setIsScheduleExpanded(true)}
          >
            Xem thêm {teacher.availability.length - 3} ngày khác
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto py-10 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col">
              <motion.button
                onClick={onClose}
                className="absolute top-2 left-2 text-white/70 hover:text-white z-20 bg-black/20 rounded-full p-1.5 backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 min-h-0 flex flex-col">
                {/* Purple header (no TabsList inside) */}
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 pb-6 text-white relative overflow-hidden"
                  style={{ minHeight: 220 }}
                >
                {/* Buttons at top right like in the image */}
                <div className="absolute right-6 top-5 flex space-x-2">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      className="flex items-center gap-1 bg-white/90 text-primary font-medium rounded-full px-5 py-2 h-auto shadow-lg relative group overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                      <MessageCircle className="h-5 w-5 z-10 relative group-hover:text-white transition-colors duration-300" />
                      <span className="z-10 relative group-hover:text-white transition-colors duration-300 font-semibold">Nhắn tin</span>
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      className="flex items-center gap-1 bg-white/90 text-primary font-medium rounded-full px-5 py-2 h-auto shadow-lg relative group overflow-hidden"
                      onClick={() => setIsBookingDialogOpen(true)}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                      <Calendar className="h-5 w-5 z-10 relative group-hover:text-white transition-colors duration-300" />
                      <span className="z-10 relative group-hover:text-white transition-colors duration-300 font-semibold">Đặt lịch học</span>
                    </Button>
                  </motion.div>
                </div>
                {/* Teacher profile with better spacing */}
                <div className="flex pt-8 pb-2 items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                      <img 
                          src={teacher.avatar} 
                          alt={teacher.fullName}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                  </motion.div>
                  
                  <div className="ml-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="flex items-center">
                          <h2 className="text-2xl font-bold">{teacher.fullName}</h2>
                          {teacher.isVerified && (
                          <CheckCircle className="h-5 w-5 text-blue-300 ml-2" />
                        )}
                      </div>
                        <div className="text-pink-100 text-lg py-1">{teacher.title}</div>
                    </motion.div>
                    
                    <div className="flex items-center mt-3 space-x-6">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5" />
                          <span>{teacher.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{teacher.rating}</span>
                          <span className="opacity-90 ml-1">({teacher.ratingCount} đánh giá)</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                          <span className="font-medium">{new Intl.NumberFormat('vi-VN').format(teacher.hourlyRate)}đ/giờ</span>
                      </div>
                    </div>
                  </div>
                </div>
                  {/* Subject badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? (
                      teacher.subjects.map((subject: string, index: number) => (
                    <Badge key={index} className="bg-pink-100 hover:bg-pink-200 text-pink-700 border-0 px-4 py-1.5 rounded-full font-medium">
                      {subject}
                    </Badge>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">Chưa cập nhật</div>
                    )}
                </div>
              </div>
                {/* Tabs navigation as direct child of Tabs */}
                <TabsList className="flex w-full bg-gradient-to-r from-pink-500 to-purple-600 px-0 border-0 rounded-t-none rounded-b-lg">
                  <TabsTrigger value="overview" className="py-3 px-4 font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent text-white/80 border-0 rounded-none transition-all">Tổng quan</TabsTrigger>
                  <TabsTrigger value="courses" className="py-3 px-4 font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent text-white/80 border-0 rounded-none transition-all">Khóa học</TabsTrigger>
                  <TabsTrigger value="schedule" className="py-3 px-4 font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent text-white/80 border-0 rounded-none transition-all">Lịch dạy</TabsTrigger>
                  <TabsTrigger value="reviews" className="py-3 px-4 font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:bg-transparent text-white/80 border-0 rounded-none transition-all">Đánh giá</TabsTrigger>
                    </TabsList>
                {/* Tab content area */}
                <div 
                  className="flex-1 min-h-0 overflow-auto bg-white rounded-b-lg p-6"
                  style={{ paddingTop: 32 }}
                >
                    <TabsContent value="overview" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Giới thiệu</h3>
                          <p className="text-gray-600">{teacher.bio || <span className="text-gray-400">Chưa cập nhật</span>}</p>
                          </div>
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Chuyên môn</h3>
                            <div className="grid grid-cols-2 gap-4">
                            {Array.isArray(teacher.categories) && teacher.categories.length > 0 ? (
                              teacher.categories.map((category: string, idx: number) => (
                                <div key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                  <div className="mr-3 text-primary">
                                    <Award className="w-5 h-5" />
                                  </div>
                                  <span>{category}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-400 text-sm">Chưa cập nhật</div>
                            )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium mb-3">Khóa học nổi bật</h3>
                            <div className="space-y-3">
                              {mockCourses.slice(0, 2).map(course => (
                                <div key={course.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium">{course.title}</h4>
                                    <Badge className="bg-primary text-white">{new Intl.NumberFormat('vi-VN').format(course.price)}đ</Badge>
                                  </div>
                                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">{course.description}</p>
                                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Clock className="mr-1 w-3 h-3" />
                                      <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="mr-1 w-3 h-3 fill-yellow-500 text-yellow-500" />
                                      <span>{course.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <Button 
                                variant="link" 
                                className="text-primary"
                                onClick={() => setActiveTab('courses')}
                              >
                                Xem tất cả khóa học
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="border rounded-lg p-4 sticky top-[72px]">
                            <h3 className="text-lg font-medium mb-4">Thông tin chi tiết</h3>
                            {/* Video preview section at the top */}
                            <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                              <div className="bg-slate-800 aspect-video relative">
                                {/* Chalk-like border design */}
                                <div className="absolute inset-0 border-4 border-dashed border-white/20 m-1 pointer-events-none"></div>
                                <img 
                                  src="https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                                  alt="Video giới thiệu" 
                                  className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-white/80 hover:bg-white text-pink-600 hover:text-pink-700 rounded-full p-3 shadow-xl transition-all duration-300"
                                  >
                                    <div className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center">
                                      <Play className="h-6 w-6 text-white fill-white" />
                                    </div>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex">
                                <div className="w-10 text-primary">
                                  <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Học vấn</div>
                                <div>{teacher.education || <span className="text-gray-400">Chưa cập nhật</span>}</div>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-10 text-primary">
                                  <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Kinh nghiệm</div>
                                <div>{teacher.experience || <span className="text-gray-400">Chưa cập nhật</span>}</div>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-10 text-primary">
                                  <Book className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-500">Chuyên môn</div>
                                <div className="break-words">{Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? teacher.subjects.join(', ') : <span className="text-gray-400">Chưa cập nhật</span>}</div>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-10 text-primary">
                                  <Video className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Video giới thiệu</div>
                                {teacher.introVideo ? (
                                  <a href={teacher.introVideo} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-600 cursor-pointer">Xem video</a>
                                ) : (
                                  <span className="text-gray-400">Chưa cập nhật</span>
                                )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="courses" className="mt-0">
                      {renderCourseTab()}
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="mt-0">
                      {renderScheduleTab()}
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="mt-0">
                      {renderReviewsTab()}
                    </TabsContent>
                  </div>
                </Tabs>
            </div>
          </motion.div>
          
          {/* Render Booking Dialog */}
          {renderBookingDialog()}
        </>
      )}
    </AnimatePresence>
  );
};

export default TeacherDetailModal;