import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTeacherApplicationSchema,
  insertTeacherProfileSchema, 
  insertTeacherSubjectSchema,
  insertCourseSchema,
  insertScheduleSchema,
  insertBookingSchema,
  insertPaymentSchema,
  insertReviewSchema,
  insertMessageSchema
} from "@shared/schema";
import Stripe from "stripe";
import chatRouter, { setupChatWebSocket } from "./routes/chat";
import courseRouter from "./routes/course";
import assignmentRouter from "./routes/assignment";
import enrollmentRouter from "./routes/enrollment";
import teacherProfilesRouter from "./routes/teacher-profiles";
import schedulesRouter from "./routes/schedules";

// Initialize Stripe with a demo secret key (this is not a real key)
const stripe = new Stripe("sk_test_demo_key_not_real", {
  apiVersion: "2023-10-16" as any, // Using 'as any' to bypass typechecking for demo
});
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "eduviet_secret_key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        // In a real application, we'd use bcrypt.compare, but for simplicity:
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Middleware to check authentication
  const ensureAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Middleware to check teacher role
  const ensureTeacher = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "teacher") {
      return next();
    }
    res.status(403).json({ message: "Forbidden - Teacher access required" });
  };
  
  // Middleware to check admin role
  const ensureAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden - Admin access required" });
  };
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", ensureAuthenticated, (req, res) => {
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // Teacher profile routes
  app.post("/api/teacher-profiles", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Check if teacher profile already exists for user
      const existingProfile = await storage.getTeacherProfileByUserId(user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Teacher profile already exists for this user" });
      }
      
      const profileData = {
        ...insertTeacherProfileSchema.parse(req.body),
        userId: user.id
      };
      
      const profile = await storage.createTeacherProfile(profileData);
      
      // Update user role to teacher
      // In a real app, we'd update the user record in the database
      // For our in-memory implementation, we'll just update the user
      const updatedUser = { ...user, role: "teacher" };
      
      res.status(201).json(profile);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/teacher-profiles/:id", async (req, res) => {
    try {
      const profileId = Number(req.params.id);
      const profile = await storage.getTeacherProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      const user = await storage.getUser(profile.userId);
      const subjects = await storage.getTeacherSubjects(profile.id);
      const courses = await storage.getTeacherCourses(profile.id);
      const reviews = await storage.getReviews(profile.id);
      
      // Enrich reviews with student info
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const student = await storage.getUser(review.studentId);
          return {
            ...review,
            student: student ? {
              id: student.id,
              username: student.username,
              fullName: student.fullName,
              avatar: student.avatar
            } : undefined
          };
        })
      );
      
      res.json({
        ...profile,
        user: user ? {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          bio: user.bio
        } : undefined,
        subjects,
        courses,
        reviews: enrichedReviews
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Teacher subject routes
  app.post("/api/teacher-subjects", ensureTeacher, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get teacher profile
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      if (!teacherProfile) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      const subjectData = {
        ...insertTeacherSubjectSchema.parse(req.body),
        teacherProfileId: teacherProfile.id
      };
      
      const subject = await storage.createTeacherSubject(subjectData);
      res.status(201).json(subject);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Course routes
  app.post("/api/courses", ensureTeacher, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get teacher profile
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      if (!teacherProfile) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      const courseData = {
        ...insertCourseSchema.parse(req.body),
        teacherProfileId: teacherProfile.id
      };
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/courses", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined
      };
      
      const courses = await storage.listCourses(filters);
      
      // For each course, fetch the teacher profile
      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          const teacherProfile = await storage.getTeacherProfile(course.teacherProfileId);
          const user = teacherProfile ? await storage.getUser(teacherProfile.userId) : undefined;
          
          return {
            ...course,
            teacher: teacherProfile ? {
              ...teacherProfile,
              user: user ? {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
              } : undefined
            } : undefined
          };
        })
      );
      
      res.json(enrichedCourses);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = Number(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const teacherProfile = await storage.getTeacherProfile(course.teacherProfileId);
      const user = teacherProfile ? await storage.getUser(teacherProfile.userId) : undefined;
      const reviews = await storage.getCourseReviews(courseId);
      
      // Enrich reviews with student info
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const student = await storage.getUser(review.studentId);
          return {
            ...review,
            student: student ? {
              id: student.id,
              username: student.username,
              fullName: student.fullName,
              avatar: student.avatar
            } : undefined
          };
        })
      );
      
      res.json({
        ...course,
        teacher: teacherProfile ? {
          ...teacherProfile,
          user: user ? {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar
          } : undefined
        } : undefined,
        reviews: enrichedReviews
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Schedule routes
  app.post("/api/schedules", ensureTeacher, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get teacher profile
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      if (!teacherProfile) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      const scheduleData = {
        ...insertScheduleSchema.parse(req.body),
        teacherProfileId: teacherProfile.id
      };
      
      const schedule = await storage.createSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/teachers/:teacherProfileId/schedules", async (req, res) => {
    try {
      const teacherProfileId = Number(req.params.teacherProfileId);
      const schedules = await storage.getTeacherSchedules(teacherProfileId);
      res.json(schedules);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Booking routes
  app.post("/api/bookings", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const bookingData = {
        ...insertBookingSchema.parse(req.body),
        studentId: user.id
      };
      
      const booking = await storage.createBooking(bookingData);
      
      // Create a payment record for this booking
      const teacherProfile = await storage.getTeacherProfile(booking.teacherProfileId);
      let amount = 0;
      
      if (booking.courseId) {
        const course = await storage.getCourse(booking.courseId);
        amount = course ? course.price : 0;
      } else if (teacherProfile) {
        amount = teacherProfile.hourlyRate;
      }
      
      if (amount > 0) {
        await storage.createPayment({
          bookingId: booking.id,
          amount,
          status: 'pending'
        });
      }
      
      res.status(201).json(booking);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/bookings/student", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const bookings = await storage.getStudentBookings(user.id);
      
      // Enrich bookings with teacher and course info
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const teacherProfile = await storage.getTeacherProfile(booking.teacherProfileId);
          const teacher = teacherProfile ? await storage.getUser(teacherProfile.userId) : undefined;
          const course = booking.courseId ? await storage.getCourse(booking.courseId) : undefined;
          const schedule = booking.scheduleId ? await storage.getSchedule(booking.scheduleId) : undefined;
          
          return {
            ...booking,
            teacher: teacher ? {
              id: teacher.id,
              username: teacher.username,
              fullName: teacher.fullName,
              avatar: teacher.avatar
            } : undefined,
            teacherProfile,
            course,
            schedule
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.get("/api/bookings/teacher", ensureTeacher, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Get teacher profile
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      if (!teacherProfile) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }
      
      const bookings = await storage.getTeacherBookings(teacherProfile.id);
      
      // Enrich bookings with student and course info
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const student = await storage.getUser(booking.studentId);
          const course = booking.courseId ? await storage.getCourse(booking.courseId) : undefined;
          const schedule = booking.scheduleId ? await storage.getSchedule(booking.scheduleId) : undefined;
          
          return {
            ...booking,
            student: student ? {
              id: student.id,
              username: student.username,
              fullName: student.fullName,
              avatar: student.avatar
            } : undefined,
            course,
            schedule
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.patch("/api/bookings/:id/status", ensureAuthenticated, async (req, res) => {
    try {
      const bookingId = Number(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user has permission to update
      const user = req.user as any;
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      
      if (user.id !== booking.studentId && (!teacherProfile || teacherProfile.id !== booking.teacherProfileId)) {
        return res.status(403).json({ message: "Forbidden - No permission to update this booking" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status as any);
      res.json(updatedBooking);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Payment routes
  app.get("/api/payments/booking/:bookingId", ensureAuthenticated, async (req, res) => {
    try {
      const bookingId = Number(req.params.bookingId);
      
      // Get booking to check permissions
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user has permission to view
      const user = req.user as any;
      const teacherProfile = await storage.getTeacherProfileByUserId(user.id);
      
      if (user.id !== booking.studentId && (!teacherProfile || teacherProfile.id !== booking.teacherProfileId)) {
        return res.status(403).json({ message: "Forbidden - No permission to view this payment" });
      }
      
      // For simplicity, we're assuming a 1:1 mapping between bookings and payments
      // In a real app, we'd query by booking ID
      const payments = Array.from(Object.values(storage) as any)
        .filter((payment: any) => payment && payment.bookingId === bookingId);
      
      const payment = payments.length > 0 ? payments[0] : null;
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(payment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.post("/api/payments/:id/process", ensureAuthenticated, async (req, res) => {
    try {
      const paymentId = Number(req.params.id);
      const { transactionId } = req.body;
      
      // In a real application, this would integrate with a payment gateway
      // For now, we'll just update the payment status
      const updatedPayment = await storage.updatePaymentStatus(paymentId, 'completed', transactionId);
      
      // Update the booking status to confirmed
      if (updatedPayment.bookingId) {
        await storage.updateBookingStatus(updatedPayment.bookingId, 'confirmed');
      }
      
      res.json(updatedPayment);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Review routes
  app.post("/api/reviews", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const reviewData = {
        ...insertReviewSchema.parse(req.body),
        studentId: user.id
      };
      
      // Check if booking exists and belongs to the student
      const booking = await storage.getBooking(reviewData.bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.studentId !== user.id) {
        return res.status(403).json({ message: "Forbidden - Not your booking" });
      }
      
      // Check if booking is completed
      if (booking.status !== 'completed') {
        return res.status(400).json({ message: "Cannot review a booking that's not completed" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Message routes
  app.get("/api/messages/:userId", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const otherUserId = Number(req.params.userId);
      
      const messages = await storage.getMessages(user.id, otherUserId);
      
      // Mark messages from other user as read
      await storage.markMessagesAsRead(otherUserId, user.id);
      
      res.json(messages);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  app.post("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const messageData = {
        ...insertMessageSchema.parse(req.body),
        senderId: user.id
      };
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Stripe payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, bookingType, teacherId, courseId } = req.body;
      
      // For demo purposes, create a PaymentIntent with a fixed amount in VND
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit (cents/xu)
        currency: "vnd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          bookingType,
          teacherId: teacherId?.toString(),
          courseId: courseId?.toString(),
        },
      });
      
      res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Endpoint to check payment status
  app.get("/api/payment-status/:paymentIntentId", async (req, res) => {
    try {
      // For demo purposes, we'll generate a random success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      res.status(200).json({
        status: isSuccess ? "succeeded" : "requires_payment_method",
        message: isSuccess ? "Payment processed successfully" : "Payment failed, please try again"
      });
    } catch (error: any) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Teacher Application routes
  
  // Submit a teacher application
  app.post("/api/teacher-applications", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Check if user already has a pending application
      const existingApplications = await storage.getTeacherApplicationsByUserId(userId);
      const hasPendingApplication = existingApplications.some(app => app.status === 'pending');
      
      if (hasPendingApplication) {
        return res.status(400).json({ 
          message: "Bạn đã có một đơn đăng ký đang chờ xét duyệt" 
        });
      }
      
      // If the user is already a teacher, they can't submit another application
      if ((req.user as any).role === 'teacher') {
        return res.status(400).json({ 
          message: "Bạn đã là giáo viên trong hệ thống" 
        });
      }
      
      // Parse and validate the application data
      const applicationData = insertTeacherApplicationSchema.parse({
        ...req.body,
        userId
      });
      
      // Create the application
      const application = await storage.createTeacherApplication(applicationData);
      
      res.status(201).json(application);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Get current user's applications
  app.get("/api/teacher-applications/me", ensureAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const applications = await storage.getTeacherApplicationsByUserId(userId);
      res.json(applications);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all teacher applications (admin only)
  app.get("/api/teacher-applications", ensureAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      const applications = await storage.listTeacherApplications(
        status as 'pending' | 'approved' | 'rejected'
      );
      res.json(applications);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get a specific application
  app.get("/api/teacher-applications/:id", ensureAuthenticated, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getTeacherApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
      }
      
      // Only allow admin or the applicant to view the application
      if ((req.user as any).role !== 'admin' && application.userId !== (req.user as any).id) {
        return res.status(403).json({ message: "Bạn không có quyền xem đơn đăng ký này" });
      }
      
      // If admin is requesting, include user info
      if ((req.user as any).role === 'admin' && application.userId) {
        const user = await storage.getUser(application.userId);
        if (user) {
          // Cast to any to add user property dynamically
          (application as any).user = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar
          };
        }
      }
      
      res.json(application);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update application status (admin only)
  app.patch("/api/teacher-applications/:id", ensureAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, feedback } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }
      
      const application = await storage.updateTeacherApplicationStatus(applicationId, status as 'pending' | 'approved' | 'rejected', feedback);
      
      // If application is approved, update user role to teacher
      if (status === 'approved') {
        const updatedUser = await storage.updateUserRole(application.userId, 'teacher');
        
        // Create a teacher profile based on the application
        await storage.createTeacherProfile({
          userId: application.userId,
          title: application.title,
          education: application.education,
          experience: application.experience,
          hourlyRate: application.hourlyRate,
          introVideo: application.introVideo,
          applicationId: application.id
        });
      }
      
      res.json(application);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Teacher profile management (for teachers only)
  app.get("/api/teacher-profile/me", ensureTeacher, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await storage.getTeacherProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ giáo viên" });
      }

      // Get user information
      const user = await storage.getUser(userId);
      if (user) {
        (profile as any).user = {
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar
        };
      }
      
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get teacher profile by ID (public endpoint)
  app.get("/api/teacher-profiles/:id", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getTeacherProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ giáo viên" });
      }
      
      // Get user information
      const user = await storage.getUser(profile.userId);
      if (user) {
        (profile as any).user = {
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar
        };
      }
      
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update teacher profile (for teachers only)
  app.patch("/api/teacher-profile/me", ensureTeacher, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const profile = await storage.getTeacherProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ giáo viên" });
      }
      
      // Get update data from request body
      const { title, education, experience, hourlyRate, introVideo } = req.body;
      
      // Update the profile
      const updatedProfile = await storage.updateTeacherProfile(profile.id, {
        title,
        education,
        experience,
        hourlyRate,
        introVideo: introVideo || null
      });
      
      res.json(updatedProfile);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Use routers
  app.use('/api/chat', chatRouter);
  app.use('/api/courses', courseRouter);
  app.use('/api/assignments', assignmentRouter);
  app.use('/api/enrollments', enrollmentRouter);
  app.use('/api', teacherProfilesRouter);
  app.use('/api', schedulesRouter);
  
  const httpServer = createServer(app);
  
  // Setup WebSocket server for classroom
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Setup WebSocket server for chat
  const chatWss = setupChatWebSocket(httpServer);
  
  // Setup Socket.io server
  const io = new SocketServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    
    // Join a room
    socket.on('join-room', (data: { roomId: string, userId: string, userName: string }) => {
      const { roomId, userId, userName } = data;
      
      socket.join(roomId);
      console.log(`User ${userName} (${userId}) joined room ${roomId}`);
      
      // Broadcast to all users in the room that a new user has joined
      socket.to(roomId).emit('user-joined', { userId, userName });
      
      // Listen for signaling data
      socket.on('sending-signal', (data: { userId: string, callerId: string, signal: any }) => {
        const { userId, callerId, signal } = data;
        
        // Forward the signal to the user
        io.to(userId).emit('receiving-signal', { userId: callerId, signal });
      });
      
      // Handle audio toggle
      socket.on('toggle-audio', (data: { userId: string, isMuted: boolean }) => {
        socket.to(roomId).emit('user-toggle-audio', data);
      });
      
      // Handle video toggle
      socket.on('toggle-video', (data: { userId: string, isVideoOff: boolean }) => {
        socket.to(roomId).emit('user-toggle-video', data);
      });
      
      // Handle chat messages
      socket.on('chat-message', (message: any) => {
        socket.to(roomId).emit('chat-message', message);
      });
      
      // Handle file sharing
      socket.on('chat-file', (fileMessage: any) => {
        socket.to(roomId).emit('chat-file', fileMessage);
      });
      
      // Handle whiteboard events
      socket.on('draw', (drawData: any) => {
        socket.to(roomId).emit('draw', drawData);
      });
      
      // Handle whiteboard clear
      socket.on('clear-whiteboard', () => {
        socket.to(roomId).emit('clear-whiteboard');
      });
      
      // Handle whiteboard undo/redo
      socket.on('whiteboard-undo', () => {
        socket.to(roomId).emit('whiteboard-undo');
      });
      
      socket.on('whiteboard-redo', () => {
        socket.to(roomId).emit('whiteboard-redo');
      });
      
      // Handle file sharing
      socket.on('share-file', (fileData: any) => {
        socket.to(roomId).emit('file-shared', fileData);
      });
      
      socket.on('delete-file', (fileId: string) => {
        socket.to(roomId).emit('file-deleted', fileId);
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${userName} (${userId}) left room ${roomId}`);
        socket.to(roomId).emit('user-left', userId);
      });
    });
  });
  
  return httpServer;
}
