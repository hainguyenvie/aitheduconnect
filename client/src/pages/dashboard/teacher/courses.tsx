import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, BookOpen } from 'lucide-react';
import { api } from '../../../lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isPublished: boolean;
}

export default function TeacherCourses() {
  const [, setLocation] = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Course[]>('/courses')
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Khóa học của tôi</CardTitle>
            <CardDescription>Quản lý các khóa học bạn đã tạo</CardDescription>
          </div>
          <Button onClick={() => setLocation('/dashboard/teacher/courses/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo khóa học mới
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Đang tải...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-2">Chưa có khóa học nào</h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa tạo khóa học nào. Tạo khóa học đầu tiên của bạn ngay!
              </p>
              <Button onClick={() => setLocation('/dashboard/teacher/courses/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo khóa học mới
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <Card key={course.id} className="hover:shadow-lg cursor-pointer" onClick={() => setLocation(`/dashboard/teacher/courses/${course.id}/edit`)}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-muted-foreground line-clamp-2">{course.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold">{course.price.toLocaleString()}₫</span>
                      <span className={`text-xs px-2 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{course.isPublished ? 'Đã xuất bản' : 'Bản nháp'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 