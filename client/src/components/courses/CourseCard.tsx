import { Link } from "wouter";
import { Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from '@/components/ui/progress';

interface CourseTeacher {
  id: number;
  title: string;
  user?: {
    id: number;
    fullName: string;
    avatar?: string;
  };
}

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail?: string;
    totalSessions: number;
    enrolledStudents: number;
    rating: number;
    ratingCount: number;
    teacher?: CourseTeacher;
    description?: string;
  };
  progress?: number;
}

const CourseCard = ({ course, progress }: CourseCardProps) => {
  const { 
    id, 
    title, 
    price, 
    category, 
    thumbnail, 
    totalSessions, 
    enrolledStudents, 
    rating, 
    teacher 
  } = course;

  // Format price in Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get category name in Vietnamese
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      mathematics: "Toán học",
      languages: "Ngoại ngữ",
      programming: "Lập trình",
      music: "Âm nhạc",
      science: "Khoa học",
      art: "Nghệ thuật",
    };
    
    return categories[category] || category;
  };

  // Get teacher initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Select an appropriate course image
  const courseImage = thumbnail || 
    category === "mathematics" ? "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" :
    category === "languages" ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" :
    category === "programming" ? "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" :
    category === "music" ? "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" :
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full relative">
      {/* Course image/thumbnail */}
      <div className="h-36 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={courseImage}
          alt={title}
          className="object-cover w-full h-full"
        />
        {/* Badge */}
        {enrolledStudents > 100 && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow">Bán chạy</span>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4">
        {/* Category, Price */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 font-medium">{getCategoryName(category)}</span>
          <span className="text-primary font-bold">{formatPrice(price)}</span>
        </div>
        {/* Title */}
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{title}</h3>
        {/* Short description */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course?.description || 'Khóa học chất lượng cao, phù hợp cho mọi đối tượng.'}</p>
        {/* Teacher info */}
        <div className="flex items-center gap-2 mb-2">
          <img src={teacher?.user?.avatar} alt={teacher?.user?.fullName} className="w-7 h-7 rounded-full object-cover border" />
          <span className="text-sm font-medium">{teacher?.user?.fullName}</span>
        </div>
        {/* Stats */}
        <div className="flex items-center text-xs text-gray-500 gap-4 mb-2">
          <span><span className="font-semibold">{totalSessions}</span> buổi</span>
          <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" /></svg>{rating.toFixed(1)}</span>
          <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 0a4 4 0 01-8 0m8 0v4a4 4 0 01-8 0v-4" /></svg>{enrolledStudents} học viên</span>
        </div>
        {/* Progress bar if enrolled */}
        {progress !== undefined && (
          <div className="mb-2">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-gray-500">Tiến độ: {progress}%</span>
          </div>
        )}
        <Button asChild className="mt-auto w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg">
          <Link href={`/courses/${id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
