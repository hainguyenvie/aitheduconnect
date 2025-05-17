import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

import { TeacherSearchFilter } from '@/components/TeacherSearchFilter';
import { TeacherCard, TeacherCardProps } from '@/components/TeacherCard';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Định nghĩa kiểu dữ liệu trả về từ API
interface TeacherProfileResponse {
  teachers: {
    id: number;
    user?: {
      fullName: string;
      avatar: string | null;
    };
    title: string;
    rating: number;
    ratingCount: number;
    hourlyRate: number;
    subjects: Array<{category: string}>;
    education: string;
    experience: string;
  }[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

const filterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().optional(),
  hasFreeTrial: z.boolean().optional(),
  availability: z.string().optional(),
});

type TeacherFilters = z.infer<typeof filterSchema>;

export default function TeachersPage() {
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('rating');

  // Fetch danh sách giáo viên với bộ lọc
  const { data, isLoading, isError } = useQuery<TeacherProfileResponse>({
    queryKey: ['/api/teacher-profiles', { ...filters, page, pageSize, sortBy }],
  });

  const handleFilterChange = (newFilters: TeacherFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setPage(1); // Reset về trang 1 khi thay đổi số lượng hiển thị
  };

  // Render danh sách skeleton loading
  const renderSkeletonLoading = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="w-full p-4 border rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-between mt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    ));
  };

  // Chuyển đổi dữ liệu API sang prop cho TeacherCard
  const mapTeacherData = (teacher: any): TeacherCardProps => {
    return {
      id: teacher.id,
      name: teacher.user?.fullName || 'Giáo viên',
      avatar: teacher.user?.avatar || null,
      title: teacher.title,
      rating: teacher.rating || 0,
      ratingCount: teacher.ratingCount || 0,
      hourlyRate: teacher.hourlyRate,
      subjects: teacher.subjects?.map((s: any) => s.category) || [],
      education: teacher.education || 'Chưa cập nhật',
      experience: teacher.experience || 'Chưa cập nhật'
    };
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tìm kiếm giáo viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Bộ lọc bên trái */}
        <aside className="md:col-span-1">
          <TeacherSearchFilter onFilterChange={handleFilterChange} />
        </aside>
        
        {/* Danh sách giáo viên bên phải */}
        <div className="md:col-span-3">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-lg font-medium">
              {data?.teachers ? `Hiển thị ${data.teachers.length} giáo viên` : 'Đang tìm kiếm...'}
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sắp xếp theo:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="priceAsc">Giá thấp-cao</SelectItem>
                    <SelectItem value="priceDesc">Giá cao-thấp</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Hiển thị:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {renderSkeletonLoading()}
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-500 text-center">
              Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
            </div>
          ) : data?.teachers && data.teachers.length > 0 ? (
            <div className="space-y-6">
              {data.teachers.map((teacher) => (
                <TeacherCard key={teacher.id} {...mapTeacherData(teacher)} />
              ))}
              
              {data.pagination && data.pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-2">Không tìm thấy giáo viên phù hợp</h3>
              <p className="text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}