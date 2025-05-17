import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const UpcomingLessons = ({ isTeacher }: { isTeacher: boolean }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ class_name: '', schedule_time: '' });
  const [creating, setCreating] = useState(false);

  const fetchLessons = async () => {
    setLoading(true);
    if (!user) return;
    const { data, error } = await supabase
      .from('bookings')
      .select('id, class_name, teacher:teacher_id(full_name), schedule_time')
      .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
      .gte('schedule_time', new Date().toISOString())
      .order('schedule_time', { ascending: true });
    if (data) setLessons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line
  }, [user]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    if (!user) return;
    const { error } = await supabase.from('bookings').insert([
      {
        class_name: form.class_name,
        schedule_time: form.schedule_time,
        teacher_id: user.id,
        student_id: user.id,
      },
    ]);
    setCreating(false);
    if (!error) {
      setShowModal(false);
      setForm({ class_name: '', schedule_time: '' });
      fetchLessons();
    } else {
      alert('Tạo lớp học thất bại: ' + error.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lịch học sắp tới</CardTitle>
        {!isTeacher && (
          <Button size="sm" onClick={() => setShowModal(true)}>
            Tạo lớp học
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Đang tải...</div>
        ) : lessons.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Bạn chưa có lịch học sắp tới.</div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-lg">{lesson.class_name}</div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>Giáo viên: {lesson.teacher?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Lịch: {new Date(lesson.schedule_time).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <Button asChild size="sm" className="flex items-center">
                    <a href={`/classroom/${lesson.id}`}>
                      <Video className="mr-1 w-4 h-4" />
                      Vào lớp học
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo lớp học mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tên lớp học</label>
              <Input
                value={form.class_name}
                onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Thời gian bắt đầu</label>
              <Input
                type="datetime-local"
                value={form.schedule_time}
                onChange={e => setForm(f => ({ ...f, schedule_time: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={creating}>
                {creating ? 'Đang tạo...' : 'Tạo lớp học'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpcomingLessons;
