import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, MapPin, Bookmark, ArrowRight, ChevronLeft, ChevronRight, Users, Book, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TeacherDetailModal from "@/components/teachers/TeacherDetailModal";

interface Teacher {
  id: number;
  fullName: string;
  title: string;
  avatar: string;
  rating: number;
  ratingCount: number;
  location: string;
  hourlyRate: number;
  subjects: string[];
  totalStudents: number;
  isVerified: boolean;
}

interface TeacherResponse {
  teachers: Teacher[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

const FeaturedTeachers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Add a type for the API response
  type TeacherResponse = { teachers: Teacher[] };
  const { data, isLoading } = useQuery<TeacherResponse>({
    queryKey: ["/api/teacher-profiles"],
    queryFn: async () => {
      const res = await fetch("/api/teacher-profiles");
      return res.json();
    }
  });
  console.log("DEBUG: raw data from API", data);
  const teachers = data?.teachers ?? [];
  console.log("DEBUG: teachers from API", teachers);
  const featuredTeachers = teachers;

  if (!featuredTeachers || featuredTeachers.length === 0) {
    return <div>Không có giáo viên nào.</div>;
  }
  
  const openModal = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // Calculate teacher cards to display based on current page (3 on mobile, 4 on desktop)
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 4;
  const totalPages = Math.ceil(featuredTeachers.length / itemsPerPage);
  
  // Helper function to format price
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"}
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };
  
  const renderTeacherCard = (teacher: any) => {
    return (
      <motion.div 
        variants={itemVariants} 
        className="h-full"
      >
        <Card className="h-full flex flex-col transition-all duration-200 overflow-hidden hover:shadow-md group border-gray-200">
          <div className="relative pt-[80%] overflow-hidden">
            <img 
              src={teacher.avatar} 
              alt={teacher.fullName} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <button 
              className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Save to favorites"
            >
              <Bookmark size={18} />
            </button>
            {teacher.isVerified && (
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                Đã xác thực
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-4">
            <div className="mb-2 flex justify-between items-start">
              <h3 className="font-bold text-lg line-clamp-1">{teacher.fullName}</h3>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-1">{teacher.rating}</span>
                <Star size={14} className="text-amber-400" fill="currentColor" />
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mb-3 line-clamp-1">{teacher.title}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin size={14} className="mr-1" />
              <span>{teacher.location}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {teacher.subjects.slice(0, 2).map((subject: string, i: number) => (
                <Badge key={`subject-${teacher.id}-${i}`} variant="outline" className="text-xs font-normal">
                  {subject}
                </Badge>
              ))}
              {teacher.subjects.length > 2 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{teacher.subjects.length - 2}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-sm">
                <Users size={14} className="mr-1 text-gray-400" />
                <span>{teacher.totalStudents} học viên</span>
              </div>
              <span className="font-bold text-primary">
                {formatPrice(teacher.hourlyRate)}/giờ
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
              onClick={() => openModal(teacher.id)}
            >
              Xem chi tiết
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };
  
  // Gradient and animation for the section
  return (
    <section
      className="relative py-20 px-0 md:px-0 -mt-16"
      style={{
        background: "linear-gradient(to bottom, #e0e7ff 0%, #f0fdfa 100%)",
        boxShadow: "0 8px 32px 0 rgba(80, 80, 200, 0.15), 0 1.5px 8px 0 rgba(80, 200, 200, 0.08)",
        borderRadius: "2rem",
        margin: "0 auto",
        maxWidth: "1440px",
        overflow: "hidden"
      }}
    >
      {/* Pink-to-blue fade overlay at the top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        background: 'linear-gradient(to bottom, #fce7f3 0%, rgba(224,231,255,0.7) 100%)',
        zIndex: 20,
        pointerEvents: 'none',
      }} />
      {/* Decorative sparkles at the top */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-10">
        <Sparkles size={48} className="text-indigo-300 animate-pulse" />
      </div>
      {/* Section Title with strong blue/indigo color and star */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2
          className="text-4xl md:text-5xl font-extrabold mb-2 text-indigo-700 inline-flex items-center justify-center gap-2 drop-shadow-lg"
        >
          <Star className="text-amber-400 drop-shadow-md animate-bounce" size={36} />
              Giáo viên nổi bật
            </h2>
        <p className="text-lg md:text-xl text-gray-700 mt-2 font-medium max-w-2xl mx-auto">
          Khám phá các giáo viên xuất sắc, được đánh giá cao trong cộng đồng. Họ là linh hồn của nền tảng Aithedu Connect!
        </p>
      </motion.div>
      {/* Fade-in animation for the cards grid */}
        <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2 }}
        className="relative z-10"
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-8">
            {featuredTeachers
              .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((teacher: Teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * teacher.id }}
                className="h-full"
              >
                {renderTeacherCard(teacher)}
              </motion.div>
            ))}
          </div>
      </motion.div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              <button
                className={`p-2 rounded-full ${
                  currentPage === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === index
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className={`p-2 rounded-full ${
                  currentPage === totalPages - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
      
      {/* Teacher detail modal */}
      {selectedTeacherId && (
        <TeacherDetailModal
          teacherId={selectedTeacherId}
          isOpen={modalOpen}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default FeaturedTeachers;