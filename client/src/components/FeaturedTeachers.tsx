import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, CheckCircle2 } from 'lucide-react';

interface Teacher {
  id: number;
  fullName: string;
  title: string;
  avatar: string;
  rating: number;
  ratingCount: number;
  location: string;
  hourlyRate: number;
  subjects: string[];
  totalStudents: number;
  isVerified: boolean;
}

const FeaturedTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/teacher-profiles');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('DEBUG: teachers from API', data);
      
      // Check if data.teachers exists and is an array
      if (!data.teachers || !Array.isArray(data.teachers)) {
        throw new Error('Invalid data format received from server');
      }
      
      setTeachers(data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách giáo viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="font-medium">Lỗi khi tải danh sách giáo viên</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-600">
          <p>Chưa có giáo viên nào</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Giáo viên nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <img
                  src={teacher.avatar || '/default-avatar.png'}
                  alt={teacher.fullName}
                  className="w-full h-48 object-cover"
                />
                {teacher.isVerified && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{teacher.fullName}</h3>
                <p className="text-gray-600 mb-4">{teacher.title}</p>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-semibold">{teacher.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({teacher.ratingCount} đánh giá)</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{teacher.location || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{teacher.totalStudents} học viên</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.subjects && teacher.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    {teacher.hourlyRate.toLocaleString('vi-VN')}đ/giờ
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTeachers; 