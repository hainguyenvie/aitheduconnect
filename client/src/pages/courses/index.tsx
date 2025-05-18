import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CategoryIcons } from "@/lib/icons";

const categories = [
  { value: "mathematics", label: "Toán học" },
  { value: "languages", label: "Ngoại ngữ" },
  { value: "programming", label: "Lập trình" },
  { value: "music", label: "Âm nhạc" },
  { value: "science", label: "Khoa học" },
  { value: "art", label: "Nghệ thuật" },
];

// Sample/mock data for demo
const sampleCourses = [
  {
    id: 1,
    title: 'Toán Cao Cấp Cơ Bản',
    category: 'mathematics',
    rating: 4.8,
    ratingCount: 120,
    price: 2500000,
    enrolledStudents: 80,
    totalSessions: 10,
    teacher: { user: { fullName: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' } },
    description: 'Khóa học nền tảng toán cao cấp cho học sinh, sinh viên.',
  },
  {
    id: 2,
    title: 'Lập trình Python cơ bản',
    category: 'programming',
    rating: 4.6,
    ratingCount: 95,
    price: 1800000,
    enrolledStudents: 120,
    totalSessions: 8,
    teacher: { user: { fullName: 'Trần Thị B', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' } },
    description: 'Học lập trình Python từ cơ bản đến ứng dụng thực tế.',
  },
  {
    id: 3,
    title: 'Tiếng Anh giao tiếp',
    category: 'languages',
    rating: 4.9,
    ratingCount: 200,
    price: 2200000,
    enrolledStudents: 150,
    totalSessions: 12,
    teacher: { user: { fullName: 'Lê Văn C', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' } },
    description: 'Khóa học tiếng Anh giao tiếp cho người mới bắt đầu.',
  },
];

const CoursesIndex = () => {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Parse URL search params on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    if (params.has("category")) {
      setSelectedCategory(params.get("category") || "");
    }
  }, [location]);

  // Fetch courses
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["/api/courses", selectedCategory],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.set("category", selectedCategory);
        }
        const queryString = params.toString();
        const response = await fetch(`/api/courses${queryString ? `?${queryString}` : ""}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error();
        return data;
      } catch {
        // Fallback to sample data
        if (selectedCategory) {
          return sampleCourses.filter(c => c.category === selectedCategory);
        }
        return sampleCourses;
      }
    }
  });

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    const queryString = params.toString();
    setLocation(`/courses${queryString ? `?${queryString}` : ""}`);
  };

  // Sort courses based on selected criteria
  const sortedCourses = () => {
    if (!courses) return [];
    
    const coursesCopy = [...courses];
    
    switch (sortBy) {
      case "popularity":
        return coursesCopy.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
      case "rating":
        return coursesCopy.sort((a, b) => b.rating - a.rating);
      case "price-asc":
        return coursesCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return coursesCopy.sort((a, b) => b.price - a.price);
      default:
        return coursesCopy;
    }
  };

  return (
    <>
      <Helmet>
        <title>Khóa học - EduViet</title>
        <meta name="description" content="Khám phá các khóa học chất lượng cao trên nhiều lĩnh vực khác nhau. Học tập cùng những giáo viên hàng đầu trên EduViet." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-neutral-lightest py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Khóa học</h1>
            
            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              <Button 
                variant={selectedCategory === "" ? "default" : "outline"}
                className={selectedCategory === "" ? "bg-primary" : ""}
                onClick={() => handleCategoryChange("")}
              >
                Tất cả
              </Button>
              
              {categories.map((category) => {
                const Icon = CategoryIcons[category.value];
                return (
                  <Button 
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    className={selectedCategory === category.value ? "bg-primary" : ""}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {category.label}
                  </Button>
                );
              })}
            </div>
            
            {/* Sort and Filter */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">
                {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : "Tất cả khóa học"}
              </h2>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Phổ biến nhất</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Courses List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg text-red-500">
                  Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                </p>
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses().map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2">Không có khóa học</h3>
                  <p className="text-neutral-dark mb-6">
                    {selectedCategory 
                      ? `Không tìm thấy khóa học nào trong lĩnh vực ${categories.find(c => c.value === selectedCategory)?.label}.` 
                      : "Không tìm thấy khóa học nào trên hệ thống."}
                  </p>
                  {selectedCategory && (
                    <Button 
                      onClick={() => handleCategoryChange("")}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      Xem tất cả khóa học
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CoursesIndex;
