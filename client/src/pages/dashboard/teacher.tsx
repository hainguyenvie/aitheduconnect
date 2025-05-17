import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UpcomingLessons from "@/components/dashboard/UpcomingLessons";
import TeacherBookings from "@/components/dashboard/TeacherBookings";
import PaymentCard from "@/components/dashboard/PaymentCard";
import ScheduleManager from "@/components/dashboard/ScheduleManager";
import TeacherStats from "@/components/dashboard/TeacherStats";
import TeacherProfile from "@/components/dashboard/TeacherProfile";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Calendar, 
  MessageSquare, 
  User, 
  Settings, 
  BookOpen, 
  FileText
} from "lucide-react";

const TeacherDashboard = () => {
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
        return <TeacherBookings />;
      case "schedule":
        return <ScheduleManager isTeacher={true} />;
      case "courses":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Khóa học của tôi</CardTitle>
              <CardDescription>
                Quản lý khóa học bạn đang dạy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Chưa có khóa học nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa tạo khóa học nào. Tạo khóa học đầu tiên của bạn ngay!
                </p>
                <button className="text-primary font-medium hover:underline">
                  Tạo khóa học mới
                </button>
              </div>
            </CardContent>
          </Card>
        );
      case "materials":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu giảng dạy</CardTitle>
              <CardDescription>
                Quản lý và tổ chức tài liệu giảng dạy của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Chưa có tài liệu nào</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa tải lên tài liệu giảng dạy nào. Tạo tài liệu đầu tiên ngay!
                </p>
                <button className="text-primary font-medium hover:underline">
                  Tải lên tài liệu
                </button>
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
                Liên lạc với học viên của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-lg mb-2">Không có tin nhắn</h3>
                <p className="text-muted-foreground">
                  Bạn chưa có cuộc trò chuyện nào với học viên.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "profile":
        return <TeacherProfile />;
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <TeacherStats />
            </div>
            <div className="lg:col-span-2">
              <UpcomingLessons isTeacher={true} />
            </div>
            <div>
              <PaymentCard isTeacher={true} />
            </div>
            <div className="lg:col-span-3">
              <TeacherBookings />
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      title={
        activeTab === "overview" 
          ? "Bảng điều khiển giảng viên" 
          : activeTab === "bookings" 
          ? "Lịch dạy đã đặt" 
          : activeTab === "schedule" 
          ? "Lịch dạy"
          : activeTab === "courses"
          ? "Khóa học của tôi"
          : activeTab === "materials"
          ? "Tài liệu giảng dạy"
          : activeTab === "messages"
          ? "Tin nhắn"
          : activeTab === "profile"
          ? "Hồ sơ giảng viên"
          : "Cài đặt"
      }
      description={
        activeTab === "overview"
          ? `Chào mừng giảng viên ${user.fullName}! Quản lý việc giảng dạy của bạn.`
          : undefined
      }
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default TeacherDashboard;