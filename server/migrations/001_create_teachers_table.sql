-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar TEXT,
  rating REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  location TEXT,
  hourly_rate INTEGER NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  total_students INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO teachers (full_name, title, avatar, rating, rating_count, location, hourly_rate, subjects, total_students, is_verified)
VALUES 
  ('Nguyễn Thị Minh Tâm', 'Giảng viên Toán cao cấp', 'https://randomuser.me/api/portraits/women/44.jpg', 4.8, 124, 'Hà Nội', 250000, ARRAY['Toán Cao Cấp', 'Đại Số'], 342, true),
  ('Trần Văn Khoa', 'Giáo viên Tiếng Anh', 'https://randomuser.me/api/portraits/men/32.jpg', 4.9, 98, 'TP. Hồ Chí Minh', 280000, ARRAY['IELTS', 'TOEFL', 'Tiếng Anh giao tiếp'], 215, true),
  ('Phạm Hương Giang', 'Gia sư Piano & Thanh nhạc', 'https://randomuser.me/api/portraits/women/68.jpg', 4.7, 56, 'Đà Nẵng', 300000, ARRAY['Piano', 'Thanh nhạc', 'Lý thuyết âm nhạc'], 78, false),
  ('Lê Minh Tuấn', 'Kỹ sư phần mềm & Giảng viên lập trình', 'https://randomuser.me/api/portraits/men/42.jpg', 4.9, 187, 'Hà Nội', 350000, ARRAY['Python', 'Web Development', 'Data Science'], 456, true),
  ('Vũ Quỳnh Anh', 'Giáo viên Hóa học', 'https://randomuser.me/api/portraits/women/24.jpg', 4.6, 79, 'Hải Phòng', 220000, ARRAY['Hóa học THPT', 'Hóa đại cương'], 134, true),
  ('Đỗ Thanh Hà', 'Giáo viên Vật lý & Thiên văn học', 'https://randomuser.me/api/portraits/women/14.jpg', 4.7, 92, 'TP. Hồ Chí Minh', 270000, ARRAY['Vật lý THPT', 'Thiên văn học cơ bản'], 189, true); 