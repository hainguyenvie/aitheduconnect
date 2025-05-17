-- Migration: Create teacher_applications table
CREATE TABLE IF NOT EXISTS teacher_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  experience text NOT NULL,
  certificates text,
  intro_video text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Index for faster lookup by user
CREATE INDEX IF NOT EXISTS idx_teacher_applications_user_id ON teacher_applications(user_id); 