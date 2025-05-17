import { Request, Response, NextFunction, Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { createInsertSchema } from "drizzle-zod";
import { assignments, assignmentSubmissions, assignmentStatusEnum } from "@shared/schema";

const router = Router();

// Middleware kiểm tra quyền truy cập
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware kiểm tra quyền giáo viên
const ensureTeacher = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (!user || user.role !== 'teacher') {
    return res.status(403).json({ message: "Forbidden - Teacher access required" });
  }
  next();
};

// Middleware kiểm tra quyền tạo bài tập
const ensureAssignmentCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const user = req.user as any;
    
    // Admin có quyền truy cập mọi bài tập
    if (user.role === 'admin') {
      return next();
    }
    
    // Lấy thông tin bài tập
    const assignment = await storage.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Không tìm thấy bài tập" });
    }
    
    // Kiểm tra xem người dùng có phải là người tạo bài tập không
    if (assignment.createdBy !== user.id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập bài tập này" });
    }
    
    // Thêm assignment vào request để các route sau có thể sử dụng
    req.assignment = assignment;
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Schema cho bài tập
const insertAssignmentSchema = createInsertSchema(assignments, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema cho nộp bài tập
const insertSubmissionSchema = createInsertSchema(assignmentSubmissions, {
  status: z.enum(assignmentStatusEnum.enumValues),
}).omit({
  id: true,
  submittedAt: true,
  grade: true,
  feedback: true,
  gradedAt: true,
  gradedBy: true,
});

// API endpoints

// Lấy chi tiết bài tập
router.get("/:assignmentId", ensureAuthenticated, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const user = req.user as any;
    
    // Lấy thông tin bài tập
    const assignment = await storage.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Không tìm thấy bài tập" });
    }
    
    // Nếu bài tập thuộc về một bài học, kiểm tra quyền truy cập
    if (assignment.lessonId) {
      const lesson = await storage.getLesson(assignment.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Không tìm thấy bài học của bài tập này" });
      }
      
      const module = await storage.getCourseModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Không tìm thấy module của bài học này" });
      }
      
      const isOwner = user.role === 'teacher' && 
        await storage.isTeacherCourseOwner(user.id, module.courseId);
      const isAdmin = user.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        // Kiểm tra xem người dùng đã đăng ký khóa học chưa
        const enrollment = await storage.getEnrollment(module.courseId, user.id);
        if (!enrollment) {
          return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem bài tập này" });
        }
      }
    }
    
    // Lấy thông tin tệp đính kèm
    const attachments = await storage.getAssignmentAttachments(assignmentId);
    
    // Nếu là học viên, lấy thông tin bài nộp của họ
    if (user.role === 'student') {
      const submission = await storage.getAssignmentSubmission(assignmentId, user.id);
      
      res.json({
        ...assignment,
        attachments,
        submission,
      });
    } else {
      // Nếu là giáo viên hoặc admin, lấy tất cả bài nộp
      const submissions = await storage.listAssignmentSubmissions(assignmentId);
      
      res.json({
        ...assignment,
        attachments,
        submissions,
      });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo bài tập mới
router.post("/", ensureTeacher, async (req, res) => {
  try {
    const user = req.user as any;
    
    // Validate dữ liệu bài tập
    const assignmentData = insertAssignmentSchema.parse({
      ...req.body,
      createdBy: user.id,
    });
    
    // Nếu bài tập thuộc về một bài học, kiểm tra quyền truy cập
    if (assignmentData.lessonId) {
      const lesson = await storage.getLesson(assignmentData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Không tìm thấy bài học" });
      }
      
      const module = await storage.getCourseModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Không tìm thấy module của bài học này" });
      }
      
      const isOwner = await storage.isTeacherCourseOwner(user.id, module.courseId);
      if (!isOwner && user.role !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền tạo bài tập cho bài học này" });
      }
    }
    
    // Tạo bài tập mới
    const assignment = await storage.createAssignment(assignmentData);
    
    res.status(201).json(assignment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật bài tập
router.patch("/:assignmentId", ensureTeacher, ensureAssignmentCreator, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    
    // Chỉ lấy những trường có thể cập nhật
    const { title, description, dueDate, points } = req.body;
    
    // Cập nhật bài tập
    const updatedAssignment = await storage.updateAssignment(assignmentId, {
      title,
      description,
      dueDate,
      points
    });
    
    res.json(updatedAssignment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa bài tập
router.delete("/:assignmentId", ensureTeacher, ensureAssignmentCreator, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    
    // Kiểm tra xem đã có bài nộp chưa
    const submissionCount = await storage.countAssignmentSubmissions(assignmentId);
    if (submissionCount > 0) {
      return res.status(400).json({ 
        message: "Không thể xóa bài tập vì đã có học viên nộp bài" 
      });
    }
    
    await storage.deleteAssignment(assignmentId);
    
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Bài tập submission endpoints

// Nộp bài tập
router.post("/:assignmentId/submissions", ensureAuthenticated, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const user = req.user as any;
    
    // Kiểm tra xem người dùng có phải là học viên không
    if (user.role !== 'student') {
      return res.status(403).json({ message: "Chỉ học viên mới có thể nộp bài tập" });
    }
    
    // Lấy thông tin bài tập
    const assignment = await storage.getAssignment(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Không tìm thấy bài tập" });
    }
    
    // Kiểm tra quyền truy cập nếu bài tập thuộc về một bài học
    if (assignment.lessonId) {
      const lesson = await storage.getLesson(assignment.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Không tìm thấy bài học của bài tập này" });
      }
      
      const module = await storage.getCourseModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Không tìm thấy module của bài học này" });
      }
      
      // Kiểm tra xem người dùng đã đăng ký khóa học chưa
      const enrollment = await storage.getEnrollment(module.courseId, user.id);
      if (!enrollment) {
        return res.status(403).json({ message: "Bạn cần đăng ký khóa học để nộp bài tập này" });
      }
    }
    
    // Kiểm tra xem bài tập đã quá hạn chưa
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({ message: "Bài tập đã quá hạn nộp" });
    }
    
    // Kiểm tra xem học viên đã nộp bài chưa
    const existingSubmission = await storage.getAssignmentSubmission(assignmentId, user.id);
    if (existingSubmission) {
      return res.status(400).json({ message: "Bạn đã nộp bài tập này rồi" });
    }
    
    // Validate dữ liệu nộp bài
    const submissionData = insertSubmissionSchema.parse({
      ...req.body,
      assignmentId,
      studentId: user.id,
      status: 'submitted',
    });
    
    // Tạo bài nộp mới
    const submission = await storage.createAssignmentSubmission(submissionData);
    
    // Xử lý tệp đính kèm
    if (req.body.attachments && Array.isArray(req.body.attachments)) {
      for (const attachment of req.body.attachments) {
        await storage.createAttachment({
          submissionId: submission.id,
          filename: attachment.filename,
          url: attachment.url,
          type: attachment.type,
          size: attachment.size
        });
      }
    }
    
    res.status(201).json(submission);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Chấm điểm bài tập
router.patch("/:assignmentId/submissions/:submissionId", ensureTeacher, ensureAssignmentCreator, async (req, res) => {
  try {
    const submissionId = parseInt(req.params.submissionId);
    const user = req.user as any;
    
    // Lấy thông tin bài nộp
    const submission = await storage.getSubmission(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Không tìm thấy bài nộp" });
    }
    
    // Chỉ lấy những trường có thể cập nhật
    const { grade, feedback, status } = req.body;
    
    // Cập nhật bài nộp
    const updatedSubmission = await storage.updateSubmission(submissionId, {
      grade,
      feedback,
      status,
      gradedAt: new Date(),
      gradedBy: user.id
    });
    
    res.json(updatedSubmission);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy tất cả bài tập của một khóa học
router.get("/course/:courseId", ensureAuthenticated, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const user = req.user as any;
    
    // Kiểm tra quyền truy cập
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }
    
    const isOwner = user.role === 'teacher' && 
      await storage.isTeacherCourseOwner(user.id, courseId);
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isAdmin && user.role === 'student') {
      const enrollment = await storage.getEnrollment(courseId, user.id);
      if (!enrollment) {
        return res.status(403).json({ message: "Bạn cần đăng ký khóa học để xem bài tập" });
      }
    }
    
    // Lấy tất cả bài tập của khóa học
    const assignments = await storage.listCourseAssignments(courseId);
    
    // Nếu là học viên, thêm thông tin bài nộp
    if (user.role === 'student') {
      const assignmentsWithSubmissions = await Promise.all(
        assignments.map(async (assignment) => {
          const submission = await storage.getAssignmentSubmission(assignment.id, user.id);
          return {
            ...assignment,
            submission,
          };
        })
      );
      
      res.json(assignmentsWithSubmissions);
    } else {
      // Nếu là giáo viên hoặc admin, thêm thống kê bài nộp
      const assignmentsWithStats = await Promise.all(
        assignments.map(async (assignment) => {
          const submissionCount = await storage.countAssignmentSubmissions(assignment.id);
          const gradedCount = await storage.countGradedSubmissions(assignment.id);
          return {
            ...assignment,
            submissionStats: {
              total: submissionCount,
              graded: gradedCount,
              pending: submissionCount - gradedCount
            }
          };
        })
      );
      
      res.json(assignmentsWithStats);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;