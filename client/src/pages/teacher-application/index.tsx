import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";

// Schema cho form đăng ký giáo viên
const applicationSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  education: z.string().min(10, "Thông tin học vấn phải có ít nhất 10 ký tự").max(500, "Thông tin học vấn không được vượt quá 500 ký tự"),
  experience: z.string().min(10, "Kinh nghiệm giảng dạy phải có ít nhất 10 ký tự").max(500, "Kinh nghiệm giảng dạy không được vượt quá 500 ký tự"),
  hourlyRate: z.string().pipe(z.coerce.number().min(50000, "Học phí không được thấp hơn 50.000 VND").max(1000000, "Học phí không được cao hơn 1.000.000 VND")),
  introVideo: z.string().url("Vui lòng nhập URL hợp lệ").optional().or(z.literal("")),
  teachingCategories: z.string().min(1, "Vui lòng chọn ít nhất một lĩnh vực giảng dạy"),
  specialization: z.string().min(5, "Chuyên môn phải có ít nhất 5 ký tự").max(100, "Chuyên môn không được vượt quá 100 ký tự"),
  motivation: z.string().min(20, "Lý do bạn muốn trở thành giáo viên phải có ít nhất 20 ký tự").max(1000, "Lý do không được vượt quá 1000 ký tự"),
  certifications: z.string().optional().or(z.literal("")),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const TeacherApplication = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      title: "",
      education: "",
      experience: "",
      hourlyRate: "150000",
      introVideo: "",
      teachingCategories: "",
      specialization: "",
      motivation: "",
      certifications: "",
    },
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role === "teacher") {
    return (
      <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Đăng ký làm giáo viên</CardTitle>
            <CardDescription>
              Bạn đã là giáo viên trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Tài khoản của bạn đã là giáo viên</h3>
            <p className="text-muted-foreground mb-8">
              Bạn đã là giáo viên trên hệ thống và có thể truy cập vào bảng điều khiển giáo viên 
              để quản lý lớp học, lịch dạy và học viên của mình.
            </p>
            <Button onClick={() => navigate("/dashboard/teacher")}>
              Đi đến bảng điều khiển giáo viên
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/teacher-applications", data);
      
      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Đăng ký thành công",
          description: "Đơn đăng ký của bạn đã được gửi và đang chờ xét duyệt.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Đăng ký thất bại",
          description: errorData.message || "Có lỗi xảy ra khi gửi đơn đăng ký.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Đăng ký làm giáo viên</CardTitle>
            <CardDescription>
              Đơn đăng ký của bạn đã được gửi
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Đơn đăng ký đã được gửi thành công</h3>
            <p className="text-muted-foreground mb-8">
              Đơn đăng ký của bạn đã được gửi đến quản trị viên và đang chờ xét duyệt. 
              Chúng tôi sẽ thông báo cho bạn khi có kết quả.
            </p>
            <Button onClick={() => navigate("/")}>
              Trở về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>Đăng ký làm giáo viên - Aithedu Connect</title>
        <meta name="description" content="Đăng ký trở thành giáo viên trên nền tảng học trực tuyến Aithedu Connect" />
      </Helmet>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Đăng ký làm giáo viên</CardTitle>
          <CardDescription>
            Điền thông tin để đăng ký trở thành giáo viên trên Aithedu Connect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề giới thiệu</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="VD: Giáo viên Toán có 5 năm kinh nghiệm" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Học vấn</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả về trình độ học vấn, bằng cấp của bạn" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh nghiệm giảng dạy</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả về kinh nghiệm giảng dạy, số năm công tác..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teachingCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lĩnh vực giảng dạy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn lĩnh vực giảng dạy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Toán học</SelectItem>
                        <SelectItem value="languages">Ngôn ngữ</SelectItem>
                        <SelectItem value="programming">Lập trình</SelectItem>
                        <SelectItem value="music">Âm nhạc</SelectItem>
                        <SelectItem value="science">Khoa học</SelectItem>
                        <SelectItem value="art">Nghệ thuật</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên môn cụ thể</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="VD: Toán cao cấp, Tiếng Anh giao tiếp..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Học phí mong muốn (VND/giờ)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="150000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video giới thiệu (YouTube hoặc Vimeo URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://youtube.com/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chứng chỉ (URLs, phân cách bằng dấu phẩy)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/certificate1.jpg, https://example.com/certificate2.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do bạn muốn trở thành giáo viên</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Chia sẻ lý do bạn muốn trở thành giáo viên trên nền tảng của chúng tôi" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi đơn đăng ký
                  </>
                ) : (
                  "Gửi đơn đăng ký"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Đơn đăng ký sẽ được xem xét bởi đội ngũ quản trị viên của chúng tôi. 
            Vui lòng đảm bảo thông tin bạn cung cấp là chính xác.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherApplication;