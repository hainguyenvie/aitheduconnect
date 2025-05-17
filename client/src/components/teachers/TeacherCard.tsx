import { useState } from "react";
import { Link } from "wouter";
import { Star, Video, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TeacherSubject {
  id: number;
  name: string;
  category: string;
}

interface TeacherUser {
  id: number;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
}

interface TeacherCardProps {
  teacher: {
    id: number;
    title: string;
    hourlyRate: number;
    rating: number;
    ratingCount: number;
    experience?: string;
    user?: TeacherUser;
    subjects?: TeacherSubject[];
    isVerified?: boolean;
  };
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const { id, title, hourlyRate, rating, ratingCount, experience, user, subjects } = teacher;
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get teacher image or placeholder
  const teacherImage = user?.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";

  // Format subjects to be at most 3 for display
  const formattedSubjects = subjects?.slice(0, 3) || [];

  // Status indicators
  const isOnline = Math.random() > 0.5; // Randomly decide if online for demo
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={teacherImage} 
          alt={user?.fullName || "Giáo viên"} 
          className={`w-full h-56 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Status indicators */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          {isOnline ? (
            <Badge variant="outline" className="bg-green-500 text-white border-0 px-2 py-0.5 text-xs flex items-center">
              <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
              Trực tuyến
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-neutral-600/80 text-white border-0 px-2 py-0.5 text-xs">
              <Clock className="w-3 h-3 mr-1" /> Không trực tuyến
            </Badge>
          )}
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-accent-yellow text-neutral-darkest text-xs font-medium rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" /> {rating.toFixed(1)}
          </span>
        </div>
        
        {/* Teacher info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1 drop-shadow-md">{user?.fullName || "Không tên"}</h3>
          <p className="text-sm text-white/90 drop-shadow-md line-clamp-1">{title}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-wrap gap-1">
            {formattedSubjects.map((subject) => (
              <span 
                key={subject.id} 
                className="text-xs bg-pink-50 text-primary px-2 py-0.5 rounded-full"
              >
                {subject.name}
              </span>
            ))}
          </div>
          <span className="text-primary font-bold">{formatPrice(hourlyRate)}/h</span>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center"
          >
            <Video className="w-4 h-4 mr-1" /> Gọi
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-1" /> Chat
          </Button>
          <Button 
            asChild 
            className="bg-primary text-white hover:bg-primary/90"
            size="sm"
          >
            <Link href={`/teachers/${id}`}>Hồ sơ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
