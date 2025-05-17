import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const UpcomingLessons = ({ isTeacher }: { isTeacher: boolean }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      if (!user) return;
      // Example: Fetch from 'bookings' table where student_id = user.id and time > now
      const { data, error } = await supabase
        .from('bookings')
        .select('id, class_name, teacher:teacher_id(full_name), schedule_time')
        .eq('student_id', user.id)
        .gte('schedule_time', new Date().toISOString())
        .order('schedule_time', { ascending: true });
      if (data) setLessons(data);
      setLoading(false);
    };
    fetchLessons();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch học sắp tới</CardTitle>
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
    </Card>
  );
};

export default UpcomingLessons;
