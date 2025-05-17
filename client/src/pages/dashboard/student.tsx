import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UpcomingLessons from "@/components/dashboard/UpcomingLessons";
import StudentBookings from "@/components/dashboard/StudentBookings";
import PaymentCard from "@/components/dashboard/PaymentCard";
import ScheduleManager from "@/components/dashboard/ScheduleManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, User, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    // Parse tab from URL
    const searchParams = new URLSearchParams(location.split("?")[1]);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  if (!user) {
    return null; // Will redirect in AuthContext if not authenticated
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "bookings":
        return <StudentBookings />;
      case "schedule":
        return <ScheduleManager isTeacher={false} />;
      case "courses":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Khóa học của tôi</CardTitle>
              <CardDescription>
                Quản lý và theo dõi tiến độ các khóa học đã đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Chưa có khóa học nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa đăng ký khóa học nào. Khám phá các khóa học ngay!
                </p>
                <a href="/courses" className="text-primary font-medium hover:underline">
                  Tìm kiếm khóa học
                </a>
              </div>
            </CardContent>
          </Card>
        );
      case "messages":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tin nhắn</CardTitle>
              <CardDescription>
                Liên lạc với giáo viên của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Không có tin nhắn</h3>
                <p className="text-muted-foreground">
                  Bạn chưa có cuộc trò chuyện nào với giáo viên.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ cá nhân</CardTitle>
              <CardDescription>
                Xem và chỉnh sửa thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Tính năng đang phát triển</h3>
                <p className="text-muted-foreground">
                  Chức năng quản lý hồ sơ đang được phát triển và sẽ sớm ra mắt.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
              <CardDescription>
                Quản lý cài đặt tài khoản và thông báo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Tính năng đang phát triển</h3>
                <p className="text-muted-foreground">
                  Chức năng cài đặt đang được phát triển và sẽ sớm ra mắt.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Bạn muốn trở thành giáo viên?</CardTitle>
                <CardDescription>
                  Đăng ký để trở thành giáo viên và chia sẻ kiến thức của bạn với học viên trên nền tảng!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/teacher-application">Đăng ký làm giáo viên</a>
                </Button>
              </CardContent>
            </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UpcomingLessons isTeacher={false} />
            </div>
            <div className="lg:col-span-3">
              <StudentBookings />
            </div>
          </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout 
      title={
        activeTab === "overview" 
          ? "Bảng điều khiển" 
          : activeTab === "bookings" 
          ? "Lịch học đã đặt" 
          : activeTab === "schedule" 
          ? "Lịch học"
          : activeTab === "courses"
          ? "Khóa học của tôi"
          : activeTab === "messages"
          ? "Tin nhắn"
          : activeTab === "profile"
          ? "Hồ sơ cá nhân"
          : "Cài đặt"
      }
      description={
        activeTab === "overview"
          ? `Chào mừng ${user.fullName}! Quản lý việc học tập của bạn.`
          : undefined
      }
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
