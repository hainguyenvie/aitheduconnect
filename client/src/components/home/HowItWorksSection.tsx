import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HowItWorksSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Cách thức hoạt động</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Chỉ với vài bước đơn giản, bạn có thể bắt đầu học tập cùng giáo viên chất lượng ngay hôm nay
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Tìm giáo viên</h3>
            <p className="text-neutral-dark">
              Tìm kiếm giáo viên phù hợp với môn học, thời gian và ngân sách của bạn
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Đặt lịch học</h3>
            <p className="text-neutral-dark">
              Chọn thời gian phù hợp và đặt lịch học trực tuyến với giáo viên
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Học trực tuyến</h3>
            <p className="text-neutral-dark">
              Tham gia lớp học trực tuyến với đầy đủ công cụ tương tác và hỗ trợ
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild
            className="bg-[#e63946] text-white hover:bg-red-700"
          >
            <Link href="/register">Bắt đầu ngay</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
