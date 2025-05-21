import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";

const TeacherApplicationPage = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({
    specialization: '',
    motivation: '',
  });
  const [status, setStatus] = useState('');
  const [existingApp, setExistingApp] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setExistingApp(data);
    };
    fetchApplication();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    if (!user) {
      setStatus('Bạn cần đăng nhập để đăng ký.');
      setLoading(false);
      return;
    }
    if (existingApp && existingApp.status === 'pending') {
      setStatus('Bạn đã gửi đơn đăng ký và đang chờ xét duyệt.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('teacher_applications').insert([
      {
        user_id: user.id,
        specialization: form.specialization,
        motivation: form.motivation,
        status: 'pending',
      },
    ]);
    if (error) {
      setStatus('Đăng ký thất bại: ' + error.message);
    } else {
      setStatus('Đăng ký thành công! Vui lòng chờ quản trị viên xét duyệt.');
      setExistingApp({ ...form, status: 'pending' });
    }
    setLoading(false);
  };

  if (!user && !isLoading) {
    navigate("/login");
    return null;
  }
  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (user.role === "teacher") {
    return (
      <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Đăng ký làm giáo viên</CardTitle>
            <CardDescription>
              Bạn đã là giáo viên trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Tài khoản của bạn đã là giáo viên</h3>
            <p className="text-muted-foreground mb-8">
              Bạn đã là giáo viên trên hệ thống và có thể truy cập vào bảng điều khiển giáo viên 
              để quản lý lớp học, lịch dạy và học viên của mình.
            </p>
            <Button onClick={() => navigate("/dashboard/teacher")}>
              Đi đến bảng điều khiển giáo viên
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>Đăng ký làm giáo viên - Aithedu Connect</title>
        <meta name="description" content="Đăng ký trở thành giáo viên trên nền tảng học trực tuyến Aithedu Connect" />
      </Helmet>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Đăng ký làm giáo viên</CardTitle>
          <CardDescription>
            Điền thông tin để đăng ký trở thành giáo viên trên Aithedu Connect
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingApp && (
            <div className="mb-4 p-3 rounded bg-gray-100">
              <b>Trạng thái đơn đăng ký:</b> {existingApp.status === 'pending' ? 'Đang chờ duyệt' : existingApp.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối'}
            </div>
                )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Chuyên môn</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                      />
            </div>
            <div>
              <label className="block font-medium mb-1">Lý do muốn trở thành giáo viên</label>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                      />
            </div>
            <Button type="submit" disabled={loading || (existingApp && existingApp.status === 'pending')}>
              {loading ? "Đang gửi..." : "Gửi đăng ký"}
              </Button>
            </form>
          {status && <div className="mt-4 text-center text-sm text-primary font-medium">{status}</div>}
        </CardContent>
        <div className="flex justify-center border-t pt-6 pb-4">
          <p className="text-sm text-muted-foreground">
            Đơn đăng ký sẽ được xem xét bởi đội ngũ quản trị viên của chúng tôi. 
            Vui lòng đảm bảo thông tin bạn cung cấp là chính xác.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TeacherApplicationPage;