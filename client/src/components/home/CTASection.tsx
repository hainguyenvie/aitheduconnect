import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  subject: z.string().min(1, { message: "Vui lòng chọn lĩnh vực quan tâm" }),
});

type FormValues = z.infer<typeof formSchema>;

const CTASection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Đã gửi thông tin thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Đã xảy ra lỗi",
        description: "Không thể gửi thông tin của bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu hành trình học tập của bạn ngay hôm nay
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Đăng ký miễn phí và khám phá hàng ngàn giáo viên chất lượng cao trong nhiều lĩnh vực khác nhau.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="bg-[#ffd60a] text-neutral-darkest hover:bg-yellow-400"
              >
                <Link href="/register">Đăng ký ngay</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                <Link href="/teachers">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12 w-full">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-neutral-darkest">
                Đăng ký nhận tư vấn miễn phí
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ và tên của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Nhập email của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số điện thoại của bạn"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lĩnh vực quan tâm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn lĩnh vực bạn quan tâm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mathematics">Toán học</SelectItem>
                            <SelectItem value="english">Tiếng Anh</SelectItem>
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
                  <Button
                    type="submit"
                    className="w-full bg-[#e63946] text-white hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
