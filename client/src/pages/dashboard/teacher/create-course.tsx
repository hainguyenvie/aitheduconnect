import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { subjectCategoryEnum } from '@shared/schema';
import { api } from '../../../lib/api';

export default function CreateCourse() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: '',
    totalSessions: '',
    learningObjectives: '',
    targetAudience: '',
    prerequisites: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post<{ id: string }>('/courses', {
        ...formData,
        price: parseInt(formData.price),
        totalSessions: parseInt(formData.totalSessions),
      });

      toast({
        title: 'Tạo khóa học thành công',
        description: 'Bạn có thể tiếp tục thêm nội dung cho khóa học.',
      });

      // Redirect to course edit page
      setLocation(`/dashboard/teacher/courses/${response.id}/edit`);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo khóa học',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tạo khóa học mới</CardTitle>
          <CardDescription>
            Điền thông tin cơ bản về khóa học của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên khóa học</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tên khóa học"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectCategoryEnum.enumValues.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Giá khóa học (VNĐ)</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Nhập giá khóa học"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Số buổi học</label>
                <Input
                  name="totalSessions"
                  type="number"
                  value={formData.totalSessions}
                  onChange={handleChange}
                  placeholder="Nhập số buổi học"
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ảnh bìa</label>
                <Input
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="Nhập URL ảnh bìa"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả khóa học</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về khóa học"
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mục tiêu học tập</label>
              <Textarea
                name="learningObjectives"
                value={formData.learningObjectives}
                onChange={handleChange}
                placeholder="Những gì học viên sẽ đạt được sau khóa học"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đối tượng phù hợp</label>
              <Textarea
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Mô tả đối tượng học viên phù hợp với khóa học"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Yêu cầu tiên quyết</label>
              <Textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Những kiến thức/kỹ năng cần có trước khi tham gia khóa học"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/dashboard/teacher/courses')}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo khóa học'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 