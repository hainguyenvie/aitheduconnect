import { pgTable, text, serial, integer, boolean, timestamp, real, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const scheduleStatusEnum = pgEnum('schedule_status', ['available', 'booked', 'unavailable']);
export const subjectCategoryEnum = pgEnum('subject_category', [
  'mathematics', 'languages', 'programming', 'music', 'science', 'art'
]);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'approved', 'rejected']);
export const contentTypeEnum = pgEnum('content_type', ['video', 'document', 'slide', 'link', 'text']);
export const lessonStatusEnum = pgEnum('lesson_status', ['draft', 'published']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['assigned', 'submitted', 'graded', 'returned']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'completed', 'dropped']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  role: userRoleEnum("role").notNull().default('student'),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher application schema
export const teacherApplications = pgTable("teacher_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  education: text("education").notNull(),
  experience: text("experience").notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  introVideo: text("intro_video"),
  teachingCategories: text("teaching_categories").notNull(), // Comma separated list of categories
  specialization: text("specialization").notNull(),
  motivation: text("motivation").notNull(),
  certifications: text("certifications"), // URLs to certification images, comma separated
  status: applicationStatusEnum("status").notNull().default('pending'),
  adminFeedback: text("admin_feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Teacher profile schema
export const teacherProfiles = pgTable("teacher_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  applicationId: integer("application_id").references(() => teacherApplications.id),
  title: text("title").notNull(),
  education: text("education"),
  experience: text("experience"),
  hourlyRate: integer("hourly_rate").notNull(),
  isVerified: boolean("is_verified").default(false),
  introVideo: text("intro_video"),
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").default(0),
});

// Teacher subjects
export const teacherSubjects = pgTable("teacher_subjects", {
  id: serial("id").primaryKey(),
  teacherProfileId: integer("teacher_profile_id").notNull().references(() => teacherProfiles.id),
  name: text("name").notNull(),
  category: subjectCategoryEnum("category").notNull(),
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  teacherProfileId: integer("teacher_profile_id").notNull().references(() => teacherProfiles.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: subjectCategoryEnum("category").notNull(),
  thumbnail: text("thumbnail"),
  totalSessions: integer("total_sessions").notNull(),
  enrolledStudents: integer("enrolled_students").default(0),
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  learningObjectives: text("learning_objectives"), // Mục tiêu khóa học
  targetAudience: text("target_audience"), // Đối tượng phù hợp
  prerequisites: text("prerequisites"), // Yêu cầu tiên quyết
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course modules schema
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0), // Thứ tự của module trong khóa học
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons schema
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0), // Thứ tự của bài học trong module
  durationMinutes: integer("duration_minutes"), // Thời lượng bài học (phút)
  status: lessonStatusEnum("status").notNull().default('draft'),
  isPreview: boolean("is_preview").default(false), // Có phải bài học demo/miễn phí 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lesson Contents schema
export const lessonContents = pgTable("lesson_contents", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  contentType: contentTypeEnum("content_type").notNull(),
  content: text("content").notNull(), // URL hoặc nội dung văn bản tùy thuộc vào type
  duration: integer("duration"), // Thời lượng (giây) nếu là video
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teacher schedule
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  teacherProfileId: integer("teacher_profile_id").notNull().references(() => teacherProfiles.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: scheduleStatusEnum("status").notNull().default('available'),
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  teacherProfileId: integer("teacher_profile_id").notNull().references(() => teacherProfiles.id),
  scheduleId: integer("schedule_id").references(() => schedules.id),
  courseId: integer("course_id").references(() => courses.id),
  status: bookingStatusEnum("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  amount: integer("amount").notNull(),
  status: paymentStatusEnum("status").notNull().default('pending'),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  teacherProfileId: integer("teacher_profile_id").notNull().references(() => teacherProfiles.id),
  courseId: integer("course_id").references(() => courses.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group chat schema
export const chatGroups = pgTable("chat_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  type: text("type").notNull(), // 'course' or 'group'
  courseId: integer("course_id").references(() => courses.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group members schema
export const chatGroupMembers = pgTable("chat_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => chatGroups.id),
  userId: integer("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  groupId: integer("group_id").references(() => chatGroups.id),
  text: text("text").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments schema
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id), // Có thể null nếu là assignment độc lập
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"), // Có thể null nếu không có hạn chót
  points: integer("points").default(100), // Điểm tối đa
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment submissions schema
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  submissionText: text("submission_text"), // Có thể null nếu submission là file
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: assignmentStatusEnum("status").notNull().default('submitted'),
  grade: integer("grade"), // Điểm số
  feedback: text("feedback"), // Phản hồi của giáo viên
  gradedAt: timestamp("graded_at"),
  gradedBy: integer("graded_by").references(() => users.id),
});

// Attachments schema
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherApplicationSchema = createInsertSchema(teacherApplications).omit({
  id: true,
  status: true,
  adminFeedback: true,
  submittedAt: true,
  processedAt: true,
});

export const insertTeacherProfileSchema = createInsertSchema(teacherProfiles).omit({
  id: true,
  rating: true,
  ratingCount: true,
});

export const insertTeacherSubjectSchema = createInsertSchema(teacherSubjects).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  enrolledStudents: true,
  rating: true,
  ratingCount: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertChatGroupSchema = createInsertSchema(chatGroups).omit({
  id: true,
  createdAt: true,
});

export const insertChatGroupMemberSchema = createInsertSchema(chatGroupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TeacherApplication = typeof teacherApplications.$inferSelect;
export type InsertTeacherApplication = z.infer<typeof insertTeacherApplicationSchema>;

export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type InsertTeacherProfile = z.infer<typeof insertTeacherProfileSchema>;

export type TeacherSubject = typeof teacherSubjects.$inferSelect;
export type InsertTeacherSubject = z.infer<typeof insertTeacherSubjectSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ChatGroup = typeof chatGroups.$inferSelect;
export type InsertChatGroup = z.infer<typeof insertChatGroupSchema>;

export type ChatGroupMember = typeof chatGroupMembers.$inferSelect;
export type InsertChatGroupMember = z.infer<typeof insertChatGroupMemberSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;
