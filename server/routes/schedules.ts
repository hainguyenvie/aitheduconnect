import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

const router = Router();

// Lấy lịch trống của giáo viên
router.get('/teachers/:id/schedules', async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate 
      ? new Date(req.query.endDate as string) 
      : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Mặc định 7 ngày sau startDate

    // Kiểm tra xem giáo viên có tồn tại không
    const teacherExists = await storage.getTeacherProfile(teacherId);
    if (!teacherExists) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin giáo viên' });
    }

    // Trong ví dụ này, chúng ta sẽ tạo một số lịch trống giả định
    // Thực tế, bạn sẽ thay thế phần này bằng cuộc gọi storage.getTeacherSchedules
    const now = new Date();
    const schedules = [];
    
    // Tạo lịch trống mẫu cho 7 ngày
    for (let i = 0; i < 7; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() + i);
      
      // Tạo 3 khung giờ mỗi ngày
      for (let hour = 9; hour < 18; hour += 3) {
        const startTime = new Date(day);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(day);
        endTime.setHours(hour + 2, 0, 0, 0);
        
        schedules.push({
          id: schedules.length + 1,
          teacherProfileId: teacherId,
          startTime,
          endTime,
          status: 'available'
        });
      }
    }

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching teacher schedules:', error);
    res.status(500).json({ message: 'Lỗi khi tải lịch trống của giáo viên' });
  }
});

// Tạo lịch trống cho giáo viên
router.post('/teachers/:id/schedules', async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện hành động này' });
    }

    // Kiểm tra quyền (chỉ giáo viên mới có thể tạo lịch của mình)
    const teacherProfile = await storage.getTeacherProfile(teacherId);
    if (!teacherProfile || teacherProfile.userId !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền tạo lịch cho giáo viên này' });
    }

    // Validate dữ liệu đầu vào
    const scheduleSchema = z.object({
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      status: z.enum(['available', 'pending', 'booked', 'canceled']).default('available'),
    });

    const validatedData = scheduleSchema.parse(req.body);
    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    // Kiểm tra thời gian bắt đầu phải trước thời gian kết thúc
    if (startTime >= endTime) {
      return res.status(400).json({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc' });
    }

    // Tạo lịch mới (giả định)
    const newSchedule = {
      id: Math.floor(Math.random() * 1000),
      teacherProfileId: teacherId,
      startTime,
      endTime,
      status: validatedData.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error creating teacher schedule:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi khi tạo lịch trống' });
  }
});

// Cập nhật trạng thái lịch
router.patch('/schedules/:id', async (req, res) => {
  try {
    const scheduleId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện hành động này' });
    }

    // Giả định thông tin lịch
    const schedule = {
      id: scheduleId,
      teacherProfileId: 1,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Giả định thông tin giáo viên
    const teacherProfile = await storage.getTeacherProfile(schedule.teacherProfileId);
    if (!teacherProfile || teacherProfile.userId !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật lịch này' });
    }

    // Validate dữ liệu đầu vào
    const updateSchema = z.object({
      status: z.enum(['available', 'pending', 'booked', 'canceled']),
    });

    const validatedData = updateSchema.parse(req.body);

    // Cập nhật trạng thái lịch (giả định)
    const updatedSchedule = {
      ...schedule,
      status: validatedData.status,
      updatedAt: new Date()
    };

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái lịch' });
  }
});

export default router;