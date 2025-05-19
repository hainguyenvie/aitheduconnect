import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';
import { createClient } from '@supabase/supabase-js';

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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function TeachersPage() {
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('rating');

  // Fetch danh sách giáo viên với bộ lọc
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teachers', { ...filters, page, pageSize, sortBy }],
    queryFn: async () => {
      let query = supabase
        .from('teachers')
        .select(`
          id,
          full_name,
          avatar,
          title,
          rating,
          rating_count,
          hourly_rate,
          subjects,
          education,
          experience
        `, { count: 'exact' });

      // Re-enable filters
      if (filters.category && filters.category !== 'all') {
        query = query.contains('subjects', [filters.category]);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.priceMin) {
        query = query.gte('hourly_rate', filters.priceMin);
      }
      if (filters.priceMax) {
        query = query.lte('hourly_rate', filters.priceMax);
      }

      // Apply sorting
      switch (sortBy) {
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'priceAsc':
          query = query.order('hourly_rate', { ascending: true });
          break;
        case 'priceDesc':
          query = query.order('hourly_rate', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: teachers, error, count } = await query;

      if (error) throw error;

      return {
        teachers,
        pagination: {
          total: count || 0,
          pages: Math.ceil((count || 0) / pageSize),
          page,
          limit: pageSize
        }
      };
    }
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
  const mapTeacherData = (teacher: any): TeacherCardProps => ({
    id: teacher.id,
    name: teacher.full_name || 'Giáo viên',
    avatar: teacher.avatar || null,
    title: teacher.title,
    rating: teacher.rating || 0,
    ratingCount: teacher.rating_count || 0,
    hourlyRate: teacher.hourly_rate,
    subjects: teacher.subjects || [],
    education: teacher.education || 'Chưa cập nhật',
    experience: teacher.experience || 'Chưa cập nhật'
  });

  return (
    <div className="container mx-auto py-8">
      {/* Creative Header Section */}
      <div className="relative mb-10 p-6 rounded-xl bg-gradient-to-r from-pink-100 via-white to-blue-100 flex flex-col items-center shadow-md overflow-hidden">
        <h1 className="text-4xl font-extrabold text-primary mb-2 drop-shadow-lg">Gặp gỡ các giáo viên xuất sắc!</h1>
        <p className="text-lg text-gray-600 mb-4 text-center max-w-2xl">Khám phá đội ngũ giáo viên tài năng, tận tâm và giàu kinh nghiệm. Hãy chọn cho mình người đồng hành lý tưởng trên con đường học tập!</p>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none">
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="60" fill="#f472b6" />
            <circle cx="140" cy="40" r="40" fill="#60a5fa" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Bộ lọc bên trái (on mobile, show above grid) */}
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 mb-8 sm:mb-0">
          <TeacherSearchFilter onFilterChange={handleFilterChange} />
        </div>
        {/* Danh sách giáo viên bên phải (grid) */}
        <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {data.teachers.map((teacher) => (
                <TeacherCard key={teacher.id} {...mapTeacherData(teacher)} />
              ))}
              {data.pagination && data.pagination.pages > 1 && (
                <div className="col-span-full flex justify-center mt-8">
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