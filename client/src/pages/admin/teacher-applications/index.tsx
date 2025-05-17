import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarClock, 
  CheckCircle, 
  FileClock, 
  FileX, 
  Loader2, 
  LockKeyhole 
} from "lucide-react";
import { format } from "date-fns";

// Kiểu dữ liệu cho đơn đăng ký giáo viên
type TeacherApplication = {
  id: number;
  userId: number;
  title: string;
  status: "pending" | "approved" | "rejected";
  education: string;
  experience: string;
  submittedAt: string;
  processedAt: string | null;
  user?: {
    fullName: string;
    email: string;
  };
};

const TeacherApplicationReview = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Kiểm tra xem người dùng có phải là admin không
  if (!user || user.role !== "admin") {
    return (
      <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Quản lý đơn đăng ký giáo viên</CardTitle>
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

  // Lấy danh sách đơn đăng ký
  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ["/api/teacher-applications", statusFilter],
    queryFn: async () => {
      const url = statusFilter 
        ? `/api/teacher-applications?status=${statusFilter}` 
        : "/api/teacher-applications";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách đơn đăng ký");
      }
      return response.json() as Promise<TeacherApplication[]>;
    },
  });

  // Chức năng lọc theo trạng thái
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
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

  // Icon cho trạng thái đơn
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FileClock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <FileX className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-12">
      <Helmet>
        <title>Quản lý đơn đăng ký giáo viên - Aithedu Connect</title>
        <meta name="description" content="Quản lý và xét duyệt đơn đăng ký giáo viên trên nền tảng Aithedu Connect" />
      </Helmet>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Quản lý đơn đăng ký giáo viên</CardTitle>
              <CardDescription>
                Xem và xét duyệt đơn đăng ký làm giáo viên
              </CardDescription>
            </div>
            <div className="w-full sm:w-48">
              <Select onValueChange={handleStatusChange} defaultValue={statusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p>Đang tải danh sách đơn đăng ký...</p>
            </div>
          ) : !applications || applications.length === 0 ? (
            <div className="text-center py-12">
              <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-2">Không có đơn đăng ký nào</h3>
              <p className="text-muted-foreground">
                {statusFilter ? "Không có đơn đăng ký nào với trạng thái đã chọn." : "Hiện chưa có đơn đăng ký giáo viên nào trong hệ thống."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày nộp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.id}</TableCell>
                      <TableCell>{application.title}</TableCell>
                      <TableCell>{application.user?.fullName || "N/A"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {application.user?.email || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {application.submittedAt ? format(new Date(application.submittedAt), 'dd/MM/yyyy') : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          {getStatusBadge(application.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/teacher-applications/${application.id}`)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherApplicationReview;