import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  Clock, 
  Home, 
  LogOut, 
  MessageSquare, 
  Settings,
  User
} from "lucide-react";
import { Helmet } from "react-helmet";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isTeacher = user?.role === "teacher";
  const pathname = location;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navItems = isTeacher
    ? [
        {
          title: "Tổng quan",
          icon: <Home className="h-5 w-5" />,
          href: "/dashboard/teacher",
        },
        {
          title: "Lịch dạy",
          icon: <Calendar className="h-5 w-5" />,
          href: "/dashboard/teacher?tab=schedule",
        },
        {
          title: "Đặt lịch",
          icon: <Clock className="h-5 w-5" />,
          href: "/dashboard/teacher?tab=bookings",
        },
        {
          title: "Tin nhắn",
          icon: <MessageSquare className="h-5 w-5" />,
          href: "/dashboard/teacher?tab=messages",
        },
        {
          title: "Khóa học",
          icon: <BookOpen className="h-5 w-5" />,
          href: "/dashboard/teacher?tab=courses",
        },
        {
          title: "Thống kê",
          icon: <BarChart className="h-5 w-5" />,
          href: "/dashboard/teacher?tab=stats",
        },
      ]
    : [
        {
          title: "Tổng quan",
          icon: <Home className="h-5 w-5" />,
          href: "/dashboard/student",
        },
        {
          title: "Đặt lịch",
          icon: <Clock className="h-5 w-5" />,
          href: "/dashboard/student?tab=bookings",
        },
        {
          title: "Lớp đã đăng ký",
          icon: <BookOpen className="h-5 w-5" />,
          href: "/dashboard/student?tab=registered-classes",
        },
        {
          title: "Khóa học",
          icon: <BookOpen className="h-5 w-5" />,
          href: "/dashboard/student?tab=courses",
        },
        {
          title: "Lịch học",
          icon: <Calendar className="h-5 w-5" />,
          href: "/dashboard/student?tab=schedule",
        },
        {
          title: "Tin nhắn",
          icon: <MessageSquare className="h-5 w-5" />,
          href: "/dashboard/student?tab=messages",
        },
      ];

  return (
    <>
      <Helmet>
        <title>{title} - EduViet</title>
        <meta name="description" content={description || "Quản lý việc học tập và lịch dạy của bạn trên nền tảng EduViet"} />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow bg-neutral-lightest">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-3 lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.fullName ? getInitials(user.fullName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{user?.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isTeacher ? "Giáo viên" : "Học viên"}
                    </p>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = item.href === pathname || 
                        (item.href.includes('?tab=') && pathname.includes(item.href.split('?')[0]) && 
                        location.includes(item.href.split('?tab=')[1]));
                      
                      return (
                        <Link key={item.href} href={item.href}>
                          <a
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-neutral-lightest"
                            )}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </a>
                        </Link>
                      );
                    })}
                  </nav>

                  <Separator className="my-4" />

                  <nav className="space-y-1">
                    <Link href={isTeacher ? "/dashboard/teacher?tab=profile" : "/dashboard/student?tab=profile"}>
                      <a
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          location.includes("profile")
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-neutral-lightest"
                        )}
                      >
                        <User className="h-5 w-5" />
                        <span>Hồ sơ</span>
                      </a>
                    </Link>
                    <Link href={isTeacher ? "/dashboard/teacher?tab=settings" : "/dashboard/student?tab=settings"}>
                      <a
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          location.includes("settings")
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-neutral-lightest"
                        )}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Cài đặt</span>
                      </a>
                    </Link>
                    <Link href="/teacher-application">
                      <a
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          location.includes("teacher-application")
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-neutral-lightest"
                        )}
                      >
                        <User className="h-5 w-5" />
                        <span>Đăng ký làm giáo viên</span>
                      </a>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Đăng xuất</span>
                    </Button>
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-9 lg:col-span-10">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                  )}
                </div>

                {children}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;
