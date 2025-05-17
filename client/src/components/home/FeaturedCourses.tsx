import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/courses/CourseCard";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const FeaturedCourses = () => {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    }
  });

  return (
    <section className="py-12 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Khóa học nổi bật</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Khám phá các khóa học được thiết kế chuyên biệt bởi những giáo viên hàng đầu
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-light animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-6 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/courses">
                <a className="inline-flex items-center text-primary font-medium hover:underline">
                  Xem tất cả khóa học
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
