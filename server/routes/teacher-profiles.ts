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
    console.log('DEBUG: Fetching teacher with ID:', id);

    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    console.log('DEBUG: Supabase response:', { data, error });
    
    if (error || !data) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin giáo viên' });
    }

    // Map to frontend format
    const teacher = {
      id: data.id,
      fullName: data.full_name,
      title: data.title,
      avatar: data.avatar,
      rating: data.rating,
      ratingCount: data.rating_count,
      location: data.location,
      hourlyRate: data.hourly_rate,
      subjects: data.subjects,
      totalStudents: data.total_students,
      isVerified: data.is_verified,
      bio: data.bio,
      education: data.education,
      experience: data.experience,
      introVideo: data.intro_video,
    };
    
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Lỗi khi tải thông tin giáo viên' });
  }
});

export default router;