# AITheduConnect - Online Education Platform

A modern online education platform connecting students with teachers for live interactive learning sessions.

## 🚀 Features

### Core Features

- [x] User Authentication (Student/Teacher roles)
- [x] Real-time video conferencing (WebRTC)
- [x] Basic chat system
- [x] File sharing capabilities
- [x] Payment integration (Stripe)
- [x] Course management system
- [x] Teacher search and filtering
- [x] Booking system

### User Flow

1. [x] User registration/login
2. [x] Teacher search and discovery
3. [x] Course/lesson booking
4. [x] Payment processing
5. [x] Live learning sessions
6. [x] Post-session reviews

### Course Structure

- [x] Course creation and management
- [x] Course syllabus/curriculum
- [ ] Assignment system
- [ ] File upload for assignments
- [ ] Assignment submission and grading
- [ ] Progress tracking

### Communication

- [x] 1:1 chat between student and teacher
- [x] Course group chat
- [x] Real-time notifications
- [ ] File sharing in chat
- [ ] Message history

### Teacher Features

- [x] Teacher profile creation
- [x] Course creation
- [x] Schedule management
- [x] Rating system
- [ ] Teaching materials upload
- [ ] Student progress tracking
- [ ] Double camera support for teaching

### Search & Discovery

- [x] Basic teacher search
- [ ] Advanced filtering:
  - [ ] By subject/category
  - [ ] By price range
  - [ ] By location
  - [ ] By availability
  - [ ] By rating
  - [ ] By student count
  - [ ] By teaching level

### Payment System

- [x] Per-course payment
- [x] Per-session payment
- [ ] Subscription model
- [ ] Refund system
- [ ] Payment history

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Real-time**: Socket.IO + WebRTC
- **UI**: Tailwind CSS + Radix UI
- **Auth**: Passport.js + Express Session
- **Payment**: Stripe
- **Storage**: Supabase

## 🚧 Todo List

### High Priority

1. [ ] Implement assignment system
2. [ ] Add file upload for assignments
3. [ ] Complete advanced teacher search filters
4. [ ] Add double camera support for teachers
5. [ ] Implement course group chat
6. [ ] Add teaching materials management
7. [ ] Create student progress tracking

### Medium Priority

1. [ ] Add subscription payment model
2. [ ] Implement refund system
3. [ ] Add message history
4. [ ] Create payment history view
5. [ ] Add student analytics dashboard
6. [ ] Implement teacher analytics

### Low Priority

1. [ ] Add gamification elements
2. [ ] Implement referral system
3. [ ] Add certificate generation
4. [ ] Create mobile app version

## 🔧 Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Run development server:

```bash
npm run dev
```

## 📝 Database Schema

### Users

- Basic user info
- Role (student/teacher)
- Profile details
- Ratings
- Teaching history

### Courses

- Course details
- Syllabus
- Assignments
- Materials
- Student enrollment

### Sessions

- Booking details
- Payment info
- Session recordings
- Reviews

### Messages

- Chat history
- File attachments
- Group chats

## 🔐 Security Features

- [x] Secure authentication
- [x] Role-based access control
- [x] Secure file uploads
- [x] Payment security
- [ ] End-to-end encryption for chat
- [ ] Session recording security

## 📈 Analytics & Monitoring

- [ ] Teacher performance metrics
- [ ] Student progress tracking
- [ ] Course popularity analytics
- [ ] Revenue tracking
- [ ] User engagement metrics

## 🎯 Future Enhancements

1. Mobile app development
2. AI-powered teacher matching
3. Automated scheduling
4. Virtual classroom tools
5. Learning management system
6. Certificate system
7. Multi-language support
