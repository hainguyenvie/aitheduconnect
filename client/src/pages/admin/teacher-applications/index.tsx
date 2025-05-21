import { useState, useEffect } from "react";
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
import { supabase } from '@/lib/supabaseClient';

// Kiểu dữ liệu cho đơn đăng ký giáo viên
type TeacherApplication = {
  id: number;
  user_id: string;
  specialization: string;
  motivation: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
};

const AdminTeacherApplications = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Kiểm tra xem người dùng có phải là admin không
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (data) setApplications(data);
      setLoading(false);
    };
    fetchApplications();
  }, [status]);

  const handleReview = async (app: TeacherApplication, approve: boolean) => {
    setStatus('');
    // Update application status
    const { error: appError } = await supabase
      .from('teacher_applications')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', app.id);
    if (approve) {
      // Update user role in profiles
      await supabase
        .from('profiles')
        .update({ role: 'teacher' })
        .eq('id', app.user_id);
    }
    setStatus(approve ? 'Đã duyệt thành công!' : 'Đã từ chối đơn!');
  };

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
          {loading ? (
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
            <div className="space-y-6">
              {applications.map((app: TeacherApplication) => (
                <div key={app.id} className="border rounded p-4">
                  <div><b>Họ tên:</b> {app.profiles?.full_name || 'N/A'}</div>
                  <div><b>Email:</b> {app.profiles?.email || 'N/A'}</div>
                  <div><b>Chuyên môn:</b> {app.specialization}</div>
                  <div><b>Lý do muốn trở thành giáo viên:</b> {app.motivation}</div>
                  <div><b>Trạng thái:</b> {app.status}</div>
                  {app.status === 'pending' && (
                    <div className="mt-2 flex gap-2">
                      <Button onClick={() => handleReview(app, true)} variant="default">Duyệt</Button>
                      <Button onClick={() => handleReview(app, false)} variant="destructive">Từ chối</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {status && <div className="mt-4 text-center text-primary font-medium">{status}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeacherApplications;