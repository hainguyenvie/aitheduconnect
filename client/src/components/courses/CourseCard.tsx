import { Link } from "wouter";
import { Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-light hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={courseImage}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {enrolledStudents > 100 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-[#ffd60a] text-neutral-darkest text-xs font-medium rounded-full">
              Bán chạy
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-sm text-neutral-dark">{getCategoryName(category)}</span>
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <span className="text-[#e63946] font-medium">{formatPrice(price)}</span>
        </div>
        
        {teacher && (
          <div className="flex items-center mb-3">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={teacher.user?.avatar} alt={teacher.user?.fullName} />
              <AvatarFallback>
                {teacher.user?.fullName ? getInitials(teacher.user.fullName) : "GV"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{teacher.user?.fullName}</span>
            <span className="ml-auto text-sm flex items-center text-neutral-dark">
              <Star className="w-4 h-4 text-[#ffd60a] fill-[#ffd60a] mr-1" /> {rating.toFixed(1)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm text-neutral-dark mb-4">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" /> {totalSessions} buổi
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" /> {enrolledStudents} học viên
          </span>
        </div>
        
        <Button 
          asChild 
          className="w-full bg-primary text-white hover:bg-primary-dark"
        >
          <Link href={`/courses/${id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
