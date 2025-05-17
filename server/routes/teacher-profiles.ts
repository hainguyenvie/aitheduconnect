import { Router } from 'express';
import { storage } from '../storage';
import { supabase } from '../lib/supabase';

const router = Router();

// Lấy danh sách giáo viên với bộ lọc
router.get('/teacher-profiles', async (req, res) => {
  try {
    console.log('DEBUG: /api/teacher-profiles endpoint HIT');
    // Build query
    let query = supabase
      .from('teachers')
      .select('*', { count: 'exact' });

    // Execute query
    const { data, error, count } = await query;
    console.log('DEBUG: Supabase query result:', { data, error, count });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Lỗi khi tải danh sách giáo viên từ Supabase', error });
    }

    if (!data || data.length === 0) {
      return res.json({ teachers: [] });
    }

    // Map data to frontend format
    const teachers = data.map(row => ({
      id: row.id,
      fullName: row.full_name,
      title: row.title,
      avatar: row.avatar,
      rating: row.rating || 0,
      ratingCount: row.rating_count || 0,
      location: row.location,
      hourlyRate: row.hourly_rate,
      subjects: row.subjects || [],
      totalStudents: row.total_students || 0,
      isVerified: row.is_verified || false,
    }));

    console.log('DEBUG: teachers mapped for frontend:', teachers);

    // Return in the format expected by the frontend
    res.json({
      teachers,
      pagination: {
        total: count || teachers.length,
        pages: count ? Math.ceil(count / 10) : 1,
        page: 1,
        limit: 10,
      },
    });
  } catch (error) {
    console.error('Error fetching teacher profiles:', error);
    res.status(500).json({ message: 'Lỗi khi tải danh sách giáo viên', error });
  }
});

// Lấy thông tin chi tiết giáo viên theo ID
router.get('/teacher-profiles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Trong môi trường thử nghiệm, chúng ta giả định có một số hồ sơ giáo viên
    const mockTeachers = [
      {
        id: 1,
        user: {
          id: 1,
          fullName: 'Nguyễn Văn A',
          avatar: null,
          email: 'nguyenvana@example.com',
        },
        title: 'Giáo viên Toán học',
        education: 'Thạc sĩ Toán ứng dụng, Đại học Quốc gia Hà Nội',
        experience: '5 năm giảng dạy tại các trung tâm gia sư',
        teachingMethod: 'Phương pháp giảng dạy tương tác, tập trung vào việc hiểu khái niệm và giải quyết vấn đề',
        rating: 4.8,
        ratingCount: 25,
        hourlyRate: 200000,
        isVerified: true,
        introVideo: 'https://example.com/video1.mp4',
        subjects: [
          { category: 'Toán học' },
          { category: 'Vật lý' }
        ],
        courses: [
          {
            id: 1,
            title: 'Luyện thi Toán THPT Quốc gia',
            description: 'Khóa học cung cấp kiến thức và kỹ năng làm bài thi Toán THPT Quốc gia.',
            category: 'Toán học',
            price: 1500000,
            totalSessions: 12,
          },
          {
            id: 2,
            title: 'Toán cao cấp cơ bản',
            description: 'Khóa học dành cho sinh viên năm nhất các trường đại học.',
            category: 'Toán học',
            price: 1200000,
            totalSessions: 10,
          }
        ],
        reviews: [
          {
            id: 1,
            rating: 5,
            comment: 'Thầy giáo dạy rất nhiệt tình và dễ hiểu.',
            createdAt: new Date(),
            student: {
              fullName: 'Học sinh A',
              avatar: null,
            },
          },
          {
            id: 2,
            rating: 4.5,
            comment: 'Phương pháp giảng dạy hiệu quả, tôi đã học được nhiều điều mới.',
            createdAt: new Date(),
            student: {
              fullName: 'Học sinh B',
              avatar: null,
            },
          }
        ]
      },
      {
        id: 2,
        user: {
          id: 2,
          fullName: 'Trần Thị B',
          avatar: null,
          email: 'tranthib@example.com',
        },
        title: 'Giáo viên Tiếng Anh',
        education: 'Cử nhân Ngôn ngữ Anh, Đại học Ngoại ngữ',
        experience: '3 năm kinh nghiệm dạy tiếng Anh giao tiếp',
        teachingMethod: 'Phương pháp học qua đối thoại và tình huống thực tế, tập trung vào kỹ năng giao tiếp',
        rating: 4.5,
        ratingCount: 18,
        hourlyRate: 180000,
        isVerified: true,
        introVideo: 'https://example.com/video2.mp4',
        subjects: [
          { category: 'Tiếng Anh' }
        ],
        courses: [
          {
            id: 3,
            title: 'Tiếng Anh giao tiếp cơ bản',
            description: 'Khóa học dành cho người mới bắt đầu học tiếng Anh.',
            category: 'Ngoại ngữ',
            price: 900000,
            totalSessions: 8,
          }
        ],
        reviews: [
          {
            id: 3,
            rating: 5,
            comment: 'Cô giáo nhiệt tình, dạy rất hay.',
            createdAt: new Date(),
            student: {
              fullName: 'Học sinh C',
              avatar: null,
            },
          }
        ]
      }
    ];
    
    const teacher = mockTeachers.find(t => t.id === id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin giáo viên' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Lỗi khi tải thông tin giáo viên' });
  }
});

export default router;