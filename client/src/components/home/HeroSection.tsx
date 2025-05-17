import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  
  // Subject suggestions
  const suggestions = [
    "Toán học",
    "Tiếng Anh",
    "Lập trình",
    "Âm nhạc",
    "Khoa học",
    "Nghệ thuật",
    "Tiếng Nhật",
    "Tiếng Hàn",
    "Vật lý",
    "Hóa học"
  ];
  
  // Cycle through suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [suggestions.length]);

  // Handle search submission  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/teachers?search=${encodeURIComponent(searchQuery)}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
  };
  
  const searchBoxVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: 0.8,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
  };
  
  const floatingItemVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };
  
  // Suggestion animation
  const suggestionVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <section className="pt-32 pb-20 lg:pb-32 relative overflow-hidden bg-gradient-to-br from-white via-pink-50 to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
      
      {/* Decorative floating elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10"
        variants={floatingItemVariants}
        animate="float"
      />
      <motion.div 
        className="absolute bottom-1/3 left-1/3 w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary/10"
        variants={floatingItemVariants}
        animate="float"
        style={{ animationDelay: "1s" }}
      />
      <motion.div 
        className="absolute top-2/3 left-1/4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10"
        variants={floatingItemVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
      />
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading */}
          <motion.div className="mb-8">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
              }}
            >
              <motion.span
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-pink-500 to-red-400 text-transparent bg-clip-text drop-shadow-lg"
                variants={itemVariants}
              >
                Kết Nối Chuyên Gia
              </motion.span>
              <span className="hidden md:inline-block mx-4">
                <motion.svg
                  width="120" height="40" viewBox="0 0 120 40"
                  className="text-primary"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: 'block' }}
                >
                  <defs>
                    <linearGradient id="leftGradient" x1="10" y1="30" x2="60" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ec4899" /> {/* from-pink-500 */}
                      <stop offset="1" stopColor="#f87171" /> {/* to-red-400 */}
                    </linearGradient>
                  </defs>
                  {/* Left half curve */}
                  <motion.path
                    d="M10 30 Q 60 10 60 20"
                    stroke="url(#leftGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Right half curve */}
                  <motion.path
                    d="M110 30 Q 60 10 60 20"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Left dot animating to center */}
                  <motion.circle
                    cx="10" cy="30" r="3" fill="url(#leftGradient)"
                    initial={{ cx: 10, cy: 30 }}
                    animate={{ cx: 60, cy: 20 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                  {/* Right dot animating to center */}
                  <motion.circle
                    cx="110" cy="30" r="3" fill="currentColor"
                    initial={{ cx: 110, cy: 30 }}
                    animate={{ cx: 60, cy: 20 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </motion.svg>
              </span>
              <motion.span
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text drop-shadow-lg"
                variants={itemVariants}
              >
                Khai Phá Tiềm Năng
              </motion.span>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 md:text-xl mb-8"
            >
              Aithedu Connect giúp bạn tìm kiếm giáo viên phù hợp và kết nối với các khóa học 
              chất lượng cao, mang đến trải nghiệm học tập trực tuyến hiệu quả và thú vị.
            </motion.p>
          </motion.div>
          
          {/* Search box */}
          <motion.div 
            variants={searchBoxVariants}
            className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm giáo viên, khóa học..."
                  className="pl-12 h-14 text-lg rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 h-12 rounded-full px-6"
                >
                  Tìm kiếm
                </Button>
              </div>
              
              {/* Animated suggestions */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="flex items-center text-gray-500 font-medium min-w-[90px] justify-end">
                  <span className="mr-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                  Gợi ý:
                </span>
                <span className="relative cursor-pointer select-none"
                      onClick={() => setSearchQuery(suggestions[currentSuggestion])}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSuggestion}
                      className="inline-block text-primary font-semibold text-lg"
                      variants={suggestionVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5 }}
                    >
                      {suggestions[currentSuggestion]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </form>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">1200+</p>
              <p className="text-gray-600">Giáo viên</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">5000+</p>
              <p className="text-gray-600">Học viên</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">30+</p>
              <p className="text-gray-600">Chủ đề</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">4.8/5</p>
              <p className="text-gray-600">Đánh giá</p>
            </div>
          </motion.div>
          
          {/* Scroll down indicator */}
          <motion.div 
            className="mt-16 inline-block cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            })}
          >
            <ChevronDown className="text-primary" size={28} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;