import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, isPast, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Loader2, Video } from "lucide-react";

interface UpcomingLessonsProps {
  isTeacher: boolean;
}

const UpcomingLessons = ({ isTeacher }: UpcomingLessonsProps) => {
  // Fetch upcoming lessons
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: [`/api/bookings/${isTeacher ? "teacher" : "student"}`],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${isTeacher ? "teacher" : "student"}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Filter upcoming lessons (confirmed bookings with schedule)
  const getUpcomingLessons = () => {
    if (!bookings) return [];

    return bookings
      .filter((booking: any) => 
        booking.status === "confirmed" && 
        booking.schedule && 
        !isPast(new Date(booking.schedule.endTime))
      )
      .sort((a: any, b: any) => 
        new Date(a.schedule.startTime).getTime() - new Date(b.schedule.startTime).getTime()
      )
      .slice(0, 3); // Only show the next 3 lessons
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Hôm nay";
    } else if (isTomorrow(date)) {
      return "Ngày mai";
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };

  const upcomingLessons = getUpcomingLessons();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch học sắp tới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Lịch học sắp tới</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingLessons.length > 0 ? (
          <div className="space-y-4">
            {upcomingLessons.map((booking: any) => (
              <div 
                key={booking.id} 
                className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-none">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                    <span className="text-primary font-bold text-xl">
                      {format(new Date(booking.schedule.startTime), "dd")}
                    </span>
                    <span className="text-primary text-sm">
                      {format(new Date(booking.schedule.startTime), "MMM")}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <Badge className="mb-1">
                        {formatDate(booking.schedule.startTime)}
                      </Badge>
                      <h3 className="font-medium">
                        {booking.course ? booking.course.title : "Buổi học 1:1"}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(booking.schedule.startTime), "HH:mm")} -{" "}
                      {format(new Date(booking.schedule.endTime), "HH:mm")}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage 
                          src={isTeacher ? booking.student?.avatar : booking.teacher?.avatar} 
                        />
                        <AvatarFallback>
                          {isTeacher 
                            ? (booking.student?.fullName ? getInitials(booking.student.fullName) : "HV") 
                            : (booking.teacher?.fullName ? getInitials(booking.teacher.fullName) : "GV")}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {isTeacher ? booking.student?.fullName : booking.teacher?.fullName}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      asChild
                    >
                      <a href={`/classroom/${booking.id}`}>
                        <Video className="h-4 w-4 mr-2" />
                        Vào lớp học
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-primary"
                asChild
              >
                <a href={`/dashboard/${isTeacher ? "teacher" : "student"}?tab=schedule`}>
                  Xem tất cả lịch học
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-2">Không có lịch học sắp tới</h3>
            <p className="text-muted-foreground mb-6">
              {isTeacher 
                ? "Bạn chưa có buổi học nào được xác nhận sắp tới."
                : "Bạn chưa có buổi học nào được đặt lịch. Hãy tìm kiếm giáo viên và đặt lịch học ngay!"}
            </p>
            {!isTeacher && (
              <Button asChild>
                <a href="/teachers">Tìm kiếm giáo viên</a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLessons;
