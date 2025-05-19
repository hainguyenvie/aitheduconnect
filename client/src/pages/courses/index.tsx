import { useState, useEffect } from "react";
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
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CategoryIcons } from "@/lib/icons";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const categories = [
  { value: "mathematics", label: "Toán học" },
  { value: "languages", label: "Ngoại ngữ" },
  { value: "programming", label: "Lập trình" },
  { value: "music", label: "Âm nhạc" },
  { value: "science", label: "Khoa học" },
  { value: "art", label: "Nghệ thuật" },
];

const CoursesIndex = () => {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    if (params.has("category")) {
      setSelectedCategory(params.get("category") || "");
    }
  }, [location]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      let query = supabase
        .from('courses')
        .select(`*, teachers:teacher_profile_id (id, full_name, title, avatar, rating, rating_count)`)
        .eq('is_published', true);
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) {
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        setCourses([]);
      } else {
        setCourses(data || []);
      }
      setIsLoading(false);
    };
    fetchCourses();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    const queryString = params.toString();
    setLocation(`/courses${queryString ? `?${queryString}` : ""}`);
  };

  const sortedCourses = () => {
    if (!courses) return [];
    const coursesCopy = [...courses];
    switch (sortBy) {
      case "popularity":
        return coursesCopy.sort((a, b) => b.enrolled_students - a.enrolled_students);
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
        <title>Khóa học - AithEduConnect</title>
        <meta name="description" content="Khám phá các khóa học chất lượng cao trên nhiều lĩnh vực khác nhau. Học tập cùng những giáo viên hàng đầu trên AithEduConnect." />
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
                  {error}
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
