import {
  User, InsertUser, 
  TeacherApplication, InsertTeacherApplication,
  TeacherProfile, InsertTeacherProfile,
  TeacherSubject, InsertTeacherSubject,
  Course, InsertCourse,
  Schedule, InsertSchedule,
  Booking, InsertBooking,
  Payment, InsertPayment,
  Review, InsertReview,
  ChatGroup, InsertChatGroup,
  ChatGroupMember, InsertChatGroupMember,
  Message, InsertMessage,
  Attachment, InsertAttachment,
  users, teacherApplications, teacherProfiles, teacherSubjects, courses,
  schedules, bookings, payments, reviews, 
  chatGroups, chatGroupMembers, messages, attachments
} from "@shared/schema";
import { supabase } from './lib/supabase';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(userId: number, role: 'student' | 'teacher' | 'admin'): Promise<User>;
  
  // Teacher application operations
  getTeacherApplication(id: number): Promise<TeacherApplication | undefined>;
  getTeacherApplicationsByUserId(userId: number): Promise<TeacherApplication[]>;
  createTeacherApplication(application: InsertTeacherApplication): Promise<TeacherApplication>;
  listTeacherApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<TeacherApplication[]>;
  updateTeacherApplicationStatus(id: number, status: 'pending' | 'approved' | 'rejected', feedback?: string): Promise<TeacherApplication>;
  
  // Teacher profile operations
  getTeacherProfile(id: number): Promise<TeacherProfile | undefined>;
  getTeacherProfileByUserId(userId: number): Promise<TeacherProfile | undefined>;
  createTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile>;
  listTeacherProfiles(filters?: Partial<{ category: string, rating: number, priceMin: number, priceMax: number }>): Promise<TeacherProfile[]>;
  
  // Teacher subject operations
  getTeacherSubjects(teacherProfileId: number): Promise<TeacherSubject[]>;
  createTeacherSubject(subject: InsertTeacherSubject): Promise<TeacherSubject>;
  
  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getTeacherCourses(teacherProfileId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  listCourses(filters?: Partial<{ category: string }>): Promise<Course[]>;
  
  // Schedule operations
  getSchedule(id: number): Promise<Schedule | undefined>;
  getTeacherSchedules(teacherProfileId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateScheduleStatus(id: number, status: 'available' | 'booked' | 'unavailable'): Promise<Schedule>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getStudentBookings(studentId: number): Promise<Booking[]>;
  getTeacherBookings(teacherProfileId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Booking>;
  
  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: 'pending' | 'completed' | 'failed' | 'refunded', transactionId?: string): Promise<Payment>;
  
  // Review operations
  getReviews(teacherProfileId: number): Promise<Review[]>;
  getCourseReviews(courseId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Chat group operations
  getChatGroup(id: number): Promise<ChatGroup | undefined>;
  listChatGroups(userId: number): Promise<ChatGroup[]>;
  createChatGroup(group: InsertChatGroup): Promise<ChatGroup>;
  getChatGroupMembers(groupId: number): Promise<ChatGroupMember[]>;
  addChatGroupMember(member: InsertChatGroupMember): Promise<ChatGroupMember>;
  removeChatGroupMember(groupId: number, userId: number): Promise<void>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(senderId: number, receiverId: number): Promise<Message[]>;
  getGroupMessages(groupId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
  
  // Attachment operations
  getAttachments(messageId: number): Promise<Attachment[]>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      // Optionally handle/log error
      return undefined;
    }
    return data as User | undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (error) {
      return undefined;
    }
    return data as User | undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) {
      return undefined;
    }
    return data as User | undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([insertUser])
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to create user: ' + (error?.message || 'Unknown error'));
    }
    return data as User;
  }

  async updateUserRole(userId: number, role: 'student' | 'teacher' | 'admin'): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to update user role: ' + (error?.message || 'Unknown error'));
    }
    return data as User;
  }
  
  async getTeacherApplication(id: number): Promise<TeacherApplication | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherApplication');
  }

  async getTeacherApplicationsByUserId(userId: number): Promise<TeacherApplication[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherApplicationsByUserId');
  }

  async createTeacherApplication(application: InsertTeacherApplication): Promise<TeacherApplication> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createTeacherApplication');
  }

  async listTeacherApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<TeacherApplication[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: listTeacherApplications');
  }

  async updateTeacherApplicationStatus(id: number, status: 'pending' | 'approved' | 'rejected', feedback?: string): Promise<TeacherApplication> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: updateTeacherApplicationStatus');
  }
  
  async getTeacherProfile(id: number): Promise<TeacherProfile | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherProfile');
  }

  async getTeacherProfileByUserId(userId: number): Promise<TeacherProfile | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherProfileByUserId');
  }

  async createTeacherProfile(profile: InsertTeacherProfile): Promise<TeacherProfile> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createTeacherProfile');
  }
  
  async updateTeacherProfile(
    profileId: number, 
    data: Partial<{ 
      title: string; 
      education: string | null; 
      experience: string | null; 
      hourlyRate: number; 
      introVideo: string | null;
    }>
  ): Promise<TeacherProfile> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: updateTeacherProfile');
  }

  async listTeacherProfiles(filters?: Partial<{ category: string, rating: number, priceMin: number, priceMax: number }>): Promise<TeacherProfile[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*');
    console.log('DEBUG: Supabase teachers data:', data, 'error:', error);
    if (error) throw new Error('Supabase error: ' + error.message);

    return (data || []).map(row => ({
      id: row.id,
      fullName: row.full_name,
      title: row.title,
      avatar: row.avatar,
      rating: row.rating,
      ratingCount: row.rating_count,
      location: row.location,
      hourlyRate: row.hourly_rate,
      subjects: row.subjects,
      totalStudents: row.total_students,
      isVerified: row.is_verified,
    }));
  }

  async getTeacherSubjects(teacherProfileId: number): Promise<TeacherSubject[]> {
    // TEMP: Return empty array so API doesn't break
    return [];
  }

  async createTeacherSubject(subject: InsertTeacherSubject): Promise<TeacherSubject> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createTeacherSubject');
  }

  async getCourse(id: number): Promise<Course | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getCourse');
  }

  async getTeacherCourses(teacherProfileId: number): Promise<Course[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherCourses');
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createCourse');
  }

  async listCourses(filters?: Partial<{ category: string }>): Promise<Course[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: listCourses');
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getSchedule');
  }

  async getTeacherSchedules(teacherProfileId: number): Promise<Schedule[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherSchedules');
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createSchedule');
  }

  async updateScheduleStatus(id: number, status: 'available' | 'booked' | 'unavailable'): Promise<Schedule> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: updateScheduleStatus');
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getBooking');
  }

  async getStudentBookings(studentId: number): Promise<Booking[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getStudentBookings');
  }

  async getTeacherBookings(teacherProfileId: number): Promise<Booking[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getTeacherBookings');
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createBooking');
  }

  async updateBookingStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Booking> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: updateBookingStatus');
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getPayment');
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createPayment');
  }

  async updatePaymentStatus(id: number, status: 'pending' | 'completed' | 'failed' | 'refunded', transactionId?: string): Promise<Payment> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: updatePaymentStatus');
  }

  async getReviews(teacherProfileId: number): Promise<Review[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getReviews');
  }

  async getCourseReviews(courseId: number): Promise<Review[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getCourseReviews');
  }

  async createReview(review: InsertReview): Promise<Review> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createReview');
  }

  async getMessages(senderId: number, receiverId: number): Promise<Message[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getMessages');
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createMessage');
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: markMessagesAsRead');
  }

  async getAttachments(messageId: number): Promise<Attachment[]> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: getAttachments');
  }

  async createAttachment(attachment: InsertAttachment): Promise<Attachment> {
    // TODO: Migrate to Supabase
    throw new Error('Not implemented: createAttachment');
  }
}

export const storage = new DatabaseStorage();
