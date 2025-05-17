import { Request, Response, NextFunction, Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { createInsertSchema } from "drizzle-zod";
import { courses, courseModules, lessons, lessonContents, subjectCategoryEnum } from "@shared/schema";

const router = Router();

// Middleware kiểm tra quyền giáo viên
const ensureTeacher = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (!user || user.role !== 'teacher') {
    return res.status(403).json({ message: "Forbidden - Teacher access required" });
  }
  next();
};

// Middleware kiểm tra quyền sở hữu khóa học
const ensureCourseOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const user = req.user as any;
    
    // Admin có quyền truy cập mọi khóa học
    if (user.role === 'admin') {
      return next();
    }
    
    // Lấy thông tin khóa học
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    // Lấy thông tin hồ sơ giáo viên
    const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
    if (!teacherProfile) {
      return res.status(403).json({ message: "Bạn không có hồ sơ giáo viên" });
    }
    
    // Kiểm tra xem người dùng có phải là chủ sở hữu của khóa học không
    if (course.teacherProfileId !== teacherProfile.id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập khóa học này" });
    }
    
    // Thêm teacherProfile vào request để các route sau có thể sử dụng
    req.teacherProfile = teacherProfile;
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Schema cho khóa học
const insertCourseSchema = createInsertSchema(courses, {
  category: z.enum(subjectCategoryEnum.enumValues),
}).omit({
  id: true,
  enrolledStudents: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
});

// Schema cho module
const insertModuleSchema = createInsertSchema(courseModules, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema cho bài học
const insertLessonSchema = createInsertSchema(lessons, {
  status: z.enum(['draft', 'published']),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema cho nội dung bài học
const insertLessonContentSchema = createInsertSchema(lessonContents, {
  contentType: z.enum(['video', 'document', 'slide', 'link', 'text']),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// API endpoints

// Lấy danh sách khóa học (public)
router.get("/", async (req, res) => {
  try {
    const { category, search, teacherId, limit = 10, page = 1 } = req.query;
    
    // Chuyển đổi limit và page thành số
    const limitNum = parseInt(limit as string) || 10;
    const pageNum = parseInt(page as string) || 1;
    const offset = (pageNum - 1) * limitNum;
    
    // Lấy khóa học với bộ lọc
    const courses = await storage.listCourses({
      category: category as string,
      search: search as string,
      teacherProfileId: teacherId ? parseInt(teacherId as string) : undefined,
      limit: limitNum,
      offset: offset,
      onlyPublished: true, // Chỉ lấy các khóa học đã được công bố
    });
    
    // Lấy tổng số lượng
    const totalCount = await storage.countCourses({
      category: category as string,
      search: search as string,
      teacherProfileId: teacherId ? parseInt(teacherId as string) : undefined,
      onlyPublished: true,
    });
    
    res.json({
      data: courses,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalCount / limitNum),
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết khóa học (public)
router.get("/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = await storage.getCourse(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    // Chỉ cho phép xem khóa học đã được công bố trừ khi người dùng là chủ sở hữu
    const user = req.user as any;
    const isOwner = user && user.role === 'teacher' && 
      await storage.isTeacherCourseOwner(user.id, courseId);
    
    if (!course.isPublished && !isOwner && user?.role !== 'admin') {
      return res.status(403).json({ message: "Khóa học chưa được công bố" });
    }
    
    // Lấy thông tin giáo viên
    const teacherProfile = await storage.getTeacherProfile(course.teacherProfileId);
    if (teacherProfile) {
      const teacher = await storage.getUser(teacherProfile.userId);
      if (teacher) {
        course.teacher = {
          id: teacherProfile.id,
          name: teacher.fullName,
          avatar: teacher.avatar,
          title: teacherProfile.title,
          rating: teacherProfile.rating,
          ratingCount: teacherProfile.ratingCount,
        };
      }
    }
    
    // Lấy danh sách module của khóa học
    const modules = await storage.listCourseModules(courseId);
    course.modules = modules;
    
    // Nếu người dùng đã đăng nhập, kiểm tra xem họ đã đăng ký khóa học chưa
    if (user) {
      const enrollment = await storage.getEnrollment(courseId, user.id);
      if (enrollment) {
        course.isEnrolled = true;
        course.enrollmentStatus = enrollment.status;
        course.progress = enrollment.progress;
      }
    }
    
    res.json(course);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo khóa học mới (teacher only)
router.post("/", ensureTeacher, async (req, res) => {
  try {
    const user = req.user as any;
    
    // Lấy thông tin hồ sơ giáo viên
    const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
    if (!teacherProfile) {
      return res.status(403).json({ message: "Bạn không có hồ sơ giáo viên" });
    }
    
    // Validate dữ liệu khóa học
    const courseData = insertCourseSchema.parse({
      ...req.body,
      teacherProfileId: teacherProfile.id,
      isPublished: false,
    });
    
    // Tạo khóa học mới
    const course = await storage.createCourse(courseData);
    
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật khóa học
router.patch("/:courseId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    
    // Chỉ lấy những trường có thể cập nhật
    const { 
      title, description, category, price, thumbnail, 
      totalSessions, learningObjectives, targetAudience,
      prerequisites, isPublished 
    } = req.body;
    
    // Cập nhật khóa học
    const updatedCourse = await storage.updateCourse(courseId, {
      title,
      description,
      category,
      price,
      thumbnail,
      totalSessions,
      learningObjectives,
      targetAudience,
      prerequisites,
      isPublished
    });
    
    res.json(updatedCourse);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa khóa học
router.delete("/:courseId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    
    // Kiểm tra xem khóa học có học viên đăng ký không
    const enrollmentCount = await storage.countEnrollments(courseId);
    if (enrollmentCount > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa khóa học vì đã có học viên đăng ký" 
      });
    }
    
    await storage.deleteCourse(courseId);
    
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Module endpoints

// Lấy danh sách module của khóa học
router.get("/:courseId/modules", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = await storage.getCourse(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    // Người dùng phải đăng ký khóa học hoặc là chủ sở hữu
    const user = req.user as any;
    if (!user) {
      // Nếu không đăng nhập, chỉ hiển thị thông tin cơ bản
      const modules = await storage.listCourseModules(courseId);
      return res.json(modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        orderIndex: module.orderIndex
      })));
    }
    
    const isOwner = user.role === 'teacher' && 
      await storage.isTeacherCourseOwner(user.id, courseId);
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      const enrollment = await storage.getEnrollment(courseId, user.id);
      if (!enrollment) {
        // Nếu không đăng ký, chỉ hiển thị thông tin cơ bản
        const modules = await storage.listCourseModules(courseId);
        return res.json(modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          orderIndex: module.orderIndex
        })));
      }
    }
    
    // Lấy đầy đủ thông tin modules và bài học
    const modules = await storage.listCourseModulesWithLessons(courseId);
    
    res.json(modules);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo module mới
router.post("/:courseId/modules", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    
    // Validate dữ liệu module
    const moduleData = insertModuleSchema.parse({
      ...req.body,
      courseId,
    });
    
    // Tạo module mới
    const module = await storage.createCourseModule(moduleData);
    
    res.status(201).json(module);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật module
router.patch("/:courseId/modules/:moduleId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    
    // Chỉ lấy những trường có thể cập nhật
    const { title, description, orderIndex } = req.body;
    
    // Cập nhật module
    const updatedModule = await storage.updateCourseModule(moduleId, {
      title,
      description,
      orderIndex
    });
    
    res.json(updatedModule);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa module
router.delete("/:courseId/modules/:moduleId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    
    // Kiểm tra xem module có bài học không
    const lessonCount = await storage.countLessons(moduleId);
    if (lessonCount > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa module vì đã có bài học. Hãy xóa các bài học trước." 
      });
    }
    
    await storage.deleteCourseModule(moduleId);
    
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Lesson endpoints

// Lấy danh sách bài học của module
router.get("/:courseId/modules/:moduleId/lessons", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const moduleId = parseInt(req.params.moduleId);
    
    // Kiểm tra quyền truy cập
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    const module = await storage.getCourseModule(moduleId);
    if (!module || module.courseId !== courseId) {
      return res.status(404).json({ message: "Không tìm thấy module" });
    }
    
    // Lấy tất cả bài học
    const lessons = await storage.listLessons(moduleId);
    
    // Lọc thông tin dựa trên quyền truy cập
    const user = req.user as any;
    if (!user) {
      // Nếu không đăng nhập, chỉ hiển thị thông tin cơ bản và bài học demo
      return res.json(lessons
        .filter(lesson => lesson.isPreview || lesson.status === 'published')
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          orderIndex: lesson.orderIndex,
          durationMinutes: lesson.durationMinutes,
          isPreview: lesson.isPreview,
        }))
      );
    }
    
    const isOwner = user.role === 'teacher' && 
      await storage.isTeacherCourseOwner(user.id, courseId);
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      const enrollment = await storage.getEnrollment(courseId, user.id);
      if (!enrollment) {
        // Nếu không đăng ký, chỉ hiển thị thông tin cơ bản và bài học demo
        return res.json(lessons
          .filter(lesson => lesson.isPreview || lesson.status === 'published')
          .map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            orderIndex: lesson.orderIndex,
            durationMinutes: lesson.durationMinutes,
            isPreview: lesson.isPreview,
          }))
        );
      }
      
      // Người dùng đã đăng ký, hiển thị tất cả bài học đã công bố
      return res.json(lessons
        .filter(lesson => lesson.status === 'published')
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          orderIndex: lesson.orderIndex,
          durationMinutes: lesson.durationMinutes,
          isPreview: lesson.isPreview,
        }))
      );
    }
    
    // Giáo viên hoặc admin, hiển thị tất cả thông tin
    res.json(lessons);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết bài học
router.get("/:courseId/modules/:moduleId/lessons/:lessonId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const moduleId = parseInt(req.params.moduleId);
    const lessonId = parseInt(req.params.lessonId);
    
    // Kiểm tra quyền truy cập
    const lesson = await storage.getLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    }
    
    const module = await storage.getCourseModule(moduleId);
    if (!module || module.courseId !== courseId || lesson.moduleId !== moduleId) {
      return res.status(404).json({ message: "Không tìm thấy bài học trong module này" });
    }
    
    // Kiểm tra quyền truy cập của người dùng
    const user = req.user as any;
    const course = await storage.getCourse(courseId);
    
    if (!user) {
      // Nếu không đăng nhập, chỉ cho phép xem demo
      if (!lesson.isPreview || lesson.status !== 'published') {
        return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem bài học này" });
      }
      
      // Lấy nội dung bài học demo
      const contents = await storage.listLessonContents(lessonId);
      return res.json({
        ...lesson,
        contents
      });
    }
    
    const isOwner = user.role === 'teacher' && 
      await storage.isTeacherCourseOwner(user.id, courseId);
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      const enrollment = await storage.getEnrollment(courseId, user.id);
      if (!enrollment && !lesson.isPreview) {
        return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem bài học này" });
      }
      
      if (!lesson.isPreview && lesson.status !== 'published') {
        return res.status(403).json({ message: "Bài học này chưa được công bố" });
      }
      
      // Lấy nội dung bài học
      const contents = await storage.listLessonContents(lessonId);
      
      // Cập nhật trạng thái truy cập bài học
      if (enrollment) {
        await storage.updateLessonProgress(lessonId, user.id);
      }
      
      return res.json({
        ...lesson,
        contents
      });
    }
    
    // Giáo viên hoặc admin, hiển thị tất cả thông tin
    const contents = await storage.listLessonContents(lessonId);
    
    // Nếu có bài tập, lấy thông tin bài tập
    const assignments = await storage.listLessonAssignments(lessonId);
    
    res.json({
      ...lesson,
      contents,
      assignments
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo bài học mới
router.post("/:courseId/modules/:moduleId/lessons", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    
    // Validate dữ liệu bài học
    const lessonData = insertLessonSchema.parse({
      ...req.body,
      moduleId,
    });
    
    // Tạo bài học mới
    const lesson = await storage.createLesson(lessonData);
    
    res.status(201).json(lesson);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật bài học
router.patch("/:courseId/modules/:moduleId/lessons/:lessonId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    
    // Chỉ lấy những trường có thể cập nhật
    const { 
      title, description, orderIndex, durationMinutes, 
      status, isPreview
    } = req.body;
    
    // Cập nhật bài học
    const updatedLesson = await storage.updateLesson(lessonId, {
      title,
      description,
      orderIndex,
      durationMinutes,
      status,
      isPreview
    });
    
    res.json(updatedLesson);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa bài học
router.delete("/:courseId/modules/:moduleId/lessons/:lessonId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    
    await storage.deleteLesson(lessonId);
    
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Lesson content endpoints

// Lấy nội dung bài học
router.get("/:courseId/modules/:moduleId/lessons/:lessonId/contents", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const lessonId = parseInt(req.params.lessonId);
    
    // Kiểm tra quyền truy cập
    const lesson = await storage.getLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Không tìm thấy bài học" });
    }
    
    // Kiểm tra quyền truy cập của người dùng
    const user = req.user as any;
    
    if (!user) {
      // Nếu không đăng nhập, chỉ cho phép xem demo
      if (!lesson.isPreview || lesson.status !== 'published') {
        return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem nội dung này" });
      }
    } else {
      const isOwner = user.role === 'teacher' && 
        await storage.isTeacherCourseOwner(user.id, courseId);
      const isAdmin = user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        const enrollment = await storage.getEnrollment(courseId, user.id);
        if (!enrollment && !lesson.isPreview) {
          return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem nội dung này" });
        }
        
        if (!lesson.isPreview && lesson.status !== 'published') {
          return res.status(403).json({ message: "Bài học này chưa được công bố" });
        }
      }
    }
    
    // Lấy nội dung bài học
    const contents = await storage.listLessonContents(lessonId);
    
    res.json(contents);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm nội dung bài học
router.post("/:courseId/modules/:moduleId/lessons/:lessonId/contents", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    
    // Validate dữ liệu nội dung
    const contentData = insertLessonContentSchema.parse({
      ...req.body,
      lessonId,
    });
    
    // Tạo nội dung mới
    const content = await storage.createLessonContent(contentData);
    
    res.status(201).json(content);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật nội dung bài học
router.patch("/:courseId/modules/:moduleId/lessons/:lessonId/contents/:contentId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    
    // Chỉ lấy những trường có thể cập nhật
    const { title, orderIndex, contentType, content, duration } = req.body;
    
    // Cập nhật nội dung
    const updatedContent = await storage.updateLessonContent(contentId, {
      title,
      orderIndex,
      contentType,
      content,
      duration
    });
    
    res.json(updatedContent);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa nội dung bài học
router.delete("/:courseId/modules/:moduleId/lessons/:lessonId/contents/:contentId", ensureTeacher, ensureCourseOwner, async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    
    await storage.deleteLessonContent(contentId);
    
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;