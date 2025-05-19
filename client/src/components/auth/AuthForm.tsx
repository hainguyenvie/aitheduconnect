import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useRoute } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import LotusBackground from "@/components/ui/LotusBackground";
import { supabase } from '@/lib/supabaseClient';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

// Register form schema
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  username: z.string().min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string().min(1, { message: "Xác nhận mật khẩu không được để trống" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/');
  const [location, navigate] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  // Extract redirect parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, []);

  // Select the appropriate schema based on form type
  const schema = type === "login" ? loginSchema : registerSchema;

  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: type === "login" 
      ? { username: "", password: "" } 
      : { fullName: "", username: "", email: "", password: "", confirmPassword: "" },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      if (type === "login") {
        await login((data as LoginFormValues).username, (data as LoginFormValues).password);
        
        // Redirect after successful login
        navigate(redirectTo);
      } else {
        const { confirmPassword, ...registerData } = data as RegisterFormValues;
        const userCredential = await register({ ...registerData, role: "student" });
        // Try to get the user id from the register result or from Supabase Auth
        let userId = userCredential?.user?.id;
        if (!userId && supabase.auth.getUser) {
          const { data: authUser } = await supabase.auth.getUser();
          userId = authUser?.user?.id;
        }
        if (userId) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: userId,
              full_name: registerData.fullName,
              role: 'student',
              avatar: null,
            },
          ]);
          if (profileError) {
            toast({
              title: 'Tạo hồ sơ thất bại',
              description: profileError.message,
              variant: 'destructive',
            });
          }
        }
        navigate(redirectTo);
      }
    } catch (error) {
      toast({
        title: type === "login" ? "Đăng nhập thất bại" : "Đăng ký thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <LotusBackground className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          {type === "login" ? "Đăng nhập vào AithEduConnect" : "Đăng ký tài khoản AithEduConnect"}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "register" && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đăng nhập" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {type === "register" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Nhập mật khẩu" 
                        {...field} 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {type === "register" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Nhập lại mật khẩu" 
                          {...field} 
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full bg-[#e63946] hover:bg-red-700 text-white">
              {type === "login" ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-sm">
          {type === "login" ? (
            <p>
              Chưa có tài khoản?{" "}
              <Link href="/register">
                <a className="text-primary font-medium hover:underline">Đăng ký ngay</a>
              </Link>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{" "}
              <Link href="/login">
                <a className="text-primary font-medium hover:underline">Đăng nhập</a>
              </Link>
            </p>
          )}
        </div>
      </div>
    </LotusBackground>
  );
};

export default AuthForm;
