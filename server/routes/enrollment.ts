import { Request, Response, NextFunction, Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { createInsertSchema } from "drizzle-zod";
import { enrollmentStatusEnum } from "@shared/schema";

const router = Router();

// Middleware kiểm tra quyền truy cập
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Schema cho đăng ký khóa học
const insertEnrollmentSchema = z.object({
  courseId: z.number(),
  studentId: z.number(),
  status: z.enum(enrollmentStatusEnum.enumValues),
});

// API endpoints

// Đăng ký khóa học
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể đăng ký khóa học" });
    }
    
    const { courseId } = req.body;
    
    // Kiểm tra courseId
    if (!courseId) {
      return res.status(400).json({ message: "ID khóa học không hợp lệ" });
    }
    
    // Lấy thông tin khóa học
    const course = await storage.getCourse(parseInt(courseId));
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    // Kiểm tra xem khóa học đã được công bố chưa
    if (!course.isPublished) {
      return res.status(400).json({ message: "Khóa học chưa được công bố" });
    }
    
    // Kiểm tra xem học viên đã đăng ký khóa học chưa
    const existingEnrollment = await storage.getEnrollment(parseInt(courseId), user.id);
    if (existingEnrollment) {
      return res.status(400).json({ message: "Bạn đã đăng ký khóa học này rồi" });
    }
    
    // Tạo đăng ký mới
    const enrollment = await storage.createEnrollment({
      courseId: parseInt(courseId),
      studentId: user.id,
      status: 'enrolled',
    });
    
    // Cập nhật số lượng học viên đăng ký cho khóa học
    await storage.incrementCourseEnrollments(parseInt(courseId));
    
    // Tạo tiến độ học tập cho các bài học của khóa học
    const modules = await storage.listCourseModules(parseInt(courseId));
    for (const module of modules) {
      const lessons = await storage.listLessons(module.id);
      for (const lesson of lessons) {
        await storage.createLessonProgress({
          lessonId: lesson.id,
          studentId: user.id,
          isCompleted: false,
        });
      }
    }
    
    res.status(201).json({
      ...enrollment,
      course: {
        id: course.id,
        title: course.title,
        teacherProfileId: course.teacherProfileId,
      }
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy danh sách khóa học đã đăng ký
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể xem khóa học đã đăng ký" });
    }
    
    // Lấy danh sách đăng ký
    const enrollments = await storage.listStudentEnrollments(user.id);
    
    // Lấy thông tin khóa học cho mỗi đăng ký
    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await storage.getCourse(enrollment.courseId);
        
        if (course) {
          // Lấy thông tin giáo viên
          const teacherProfile = await storage.getTeacherProfile(course.teacherProfileId);
          let teacher = null;
          
          if (teacherProfile) {
            const teacherUser = await storage.getUser(teacherProfile.userId);
            if (teacherUser) {
              teacher = {
                id: teacherProfile.id,
                name: teacherUser.fullName,
                avatar: teacherUser.avatar,
              };
            }
          }
          
          return {
            ...enrollment,
            course: {
              id: course.id,
              title: course.title,
              description: course.description,
              thumbnail: course.thumbnail,
              category: course.category,
              teacher,
            }
          };
        }
        
        return enrollment;
      })
    );
    
    res.json(enrollmentsWithCourses);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết đăng ký khóa học
router.get("/:courseId", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const courseId = parseInt(req.params.courseId);
    
    // Lấy thông tin đăng ký
    const enrollment = await storage.getEnrollment(courseId, user.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Bạn chưa đăng ký khóa học này" });
    }
    
    // Lấy thông tin khóa học
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    // Lấy danh sách module và bài học
    const modules = await storage.listCourseModulesWithLessons(courseId);
    
    // Lấy tiến độ học tập cho mỗi bài học
    const modulesWithProgress = await Promise.all(
      modules.map(async (module) => {
        if (!module.lessons) return module;
        
        const lessonsWithProgress = await Promise.all(
          module.lessons.map(async (lesson) => {
            const progress = await storage.getLessonProgress(lesson.id, user.id);
            return {
              ...lesson,
              progress: progress ? {
                isCompleted: progress.isCompleted,
                completedAt: progress.completedAt,
                lastAccessedAt: progress.lastAccessedAt,
              } : null,
            };
          })
        );
        
        return {
          ...module,
          lessons: lessonsWithProgress,
        };
      })
    );
    
    // Lấy danh sách bài tập
    const assignments = await storage.listCourseAssignments(courseId);
    
    // Lấy thông tin bài nộp cho mỗi bài tập
    const assignmentsWithSubmissions = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await storage.getAssignmentSubmission(assignment.id, user.id);
        return {
          ...assignment,
          submission,
        };
      })
    );
    
    res.json({
      enrollment,
      course,
      modules: modulesWithProgress,
      assignments: assignmentsWithSubmissions,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật tiến độ học tập
router.post("/lessons/:lessonId/progress", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const lessonId = parseInt(req.params.lessonId);
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể cập nhật tiến độ học tập" });
    }
    
    // Lấy thông tin bài học
    const lesson = await storage.getLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    }
    
    // Lấy thông tin module
    const module = await storage.getCourseModule(lesson.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Không tìm thấy module của bài học" });
    }
    
    // Kiểm tra xem học viên đã đăng ký khóa học chưa
    const enrollment = await storage.getEnrollment(module.courseId, user.id);
    if (!enrollment) {
      return res.status(403).json({ message: "Bạn chưa đăng ký khóa học này" });
    }
    
    const { isCompleted } = req.body;
    
    // Cập nhật tiến độ học tập
    const progress = await storage.updateLessonProgress(lessonId, user.id, {
      isCompleted: isCompleted === true,
      completedAt: isCompleted === true ? new Date() : null,
    });
    
    // Cập nhật tiến độ tổng thể của khóa học
    await storage.updateEnrollmentProgress(module.courseId, user.id);
    
    res.json(progress);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy tiến độ học tập của một bài học
router.get("/lessons/:lessonId/progress", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const lessonId = parseInt(req.params.lessonId);
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể xem tiến độ học tập" });
    }
    
    // Lấy thông tin tiến độ học tập
    const progress = await storage.getLessonProgress(lessonId, user.id);
    if (!progress) {
      return res.status(404).json({ message: "Không tìm thấy tiến độ học tập cho bài học này" });
    }
    
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Hoàn thành khóa học
router.post("/:courseId/complete", ensureAuthenticated, async (req, res) => {
  try {
    const user = req.user as any;
    const courseId = parseInt(req.params.courseId);
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể hoàn thành khóa học" });
    }
    
    // Lấy thông tin đăng ký
    const enrollment = await storage.getEnrollment(courseId, user.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Bạn chưa đăng ký khóa học này" });
    }
    
    // Kiểm tra xem tất cả bài học đã hoàn thành chưa
    const modules = await storage.listCourseModules(courseId);
    let allLessonsCompleted = true;
    
    for (const module of modules) {
      const lessons = await storage.listLessons(module.id);
      for (const lesson of lessons) {
        const progress = await storage.getLessonProgress(lesson.id, user.id);
        if (!progress || !progress.isCompleted) {
          allLessonsCompleted = false;
          break;
        }
      }
      if (!allLessonsCompleted) break;
    }
    
    if (!allLessonsCompleted) {
      return res.status(400).json({ message: "Bạn cần hoàn thành tất cả bài học trước khi hoàn thành khóa học" });
    }
    
    // Cập nhật trạng thái đăng ký
    const updatedEnrollment = await storage.updateEnrollment(courseId, user.id, {
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
    });
    
    res.json(updatedEnrollment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;