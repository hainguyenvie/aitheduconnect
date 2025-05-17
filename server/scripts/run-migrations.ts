import { supabase } from '../lib/supabase';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    // Read migration file
    const migrationPath = path.join(import.meta.dirname, '..', 'migrations', '001_create_teachers_table.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');

    // Split into individual statements
    const statements = migration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log('Executing:', statement);
      const { error } = await supabase.from('teachers').select('*').limit(1);
      if (error) {
        // If table doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { error: createError } = await supabase.rpc('create_teachers_table');
          if (createError) {
            console.error('Error creating table:', createError);
            throw createError;
          }
        } else {
          console.error('Error executing statement:', error);
          throw error;
        }
      }
    }

    // Insert sample data
    const sampleData = [
      {
        full_name: 'Nguyễn Thị Minh Tâm',
        title: 'Giảng viên Toán cao cấp',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.8,
        rating_count: 124,
        location: 'Hà Nội',
        hourly_rate: 250000,
        subjects: ['Toán Cao Cấp', 'Đại Số'],
        total_students: 342,
        is_verified: true
      },
      {
        full_name: 'Trần Văn Khoa',
        title: 'Giáo viên Tiếng Anh',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.9,
        rating_count: 98,
        location: 'TP. Hồ Chí Minh',
        hourly_rate: 280000,
        subjects: ['IELTS', 'TOEFL', 'Tiếng Anh giao tiếp'],
        total_students: 215,
        is_verified: true
      }
    ];

    for (const teacher of sampleData) {
      const { error } = await supabase.from('teachers').insert(teacher);
      if (error) {
        console.error('Error inserting teacher:', error);
        throw error;
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 