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
import { Checkbox } from "@/components/ui/checkbox";
import TermsModal from "./TermsModal";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

// Register form schema
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  dateOfBirth: z.string().min(1, { message: "Ngày sinh là bắt buộc" }),
  gender: z.enum(["male", "female", "other"], { 
    required_error: "Vui lòng chọn giới tính" 
  }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phoneNumber: z.string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
    .max(11, { message: "Số điện thoại không được quá 11 số" })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" })
    .regex(/^(0[0-9]{9,10})$/, { message: "Số điện thoại phải bắt đầu bằng số 0" }),
  password: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
    .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 số" }),
  confirmPassword: z.string().min(1, { message: "Xác nhận mật khẩu không được để trống" }),
  gradeLevel: z.string({ required_error: "Vui lòng chọn cấp học" }),
  schoolName: z.string().optional(),
  province: z.string({ required_error: "Vui lòng chọn tỉnh/thành phố" }),
  subjects: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất 1 môn học" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện",
  }),
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Constants for form options
  const gradeLevels = [
    "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", 
    "Lớp 10", "Lớp 11", "Lớp 12",
    "Sinh viên năm 1", "Sinh viên năm 2", "Sinh viên năm 3", "Sinh viên năm 4",
    "Người đi làm"
  ];

  const subjects = [
    "Toán", "Lý", "Hóa", "Văn", "Anh", "Sinh", "Sử", "Địa", 
    "Tin học", "IELTS", "TOEIC", "Lập trình", "Thiết kế", "Kỹ năng mềm"
  ];
  
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
      ? { email: "", password: "" } 
      : { 
          fullName: "", 
          dateOfBirth: "",
          gender: undefined,
          email: "", 
          phoneNumber: "", 
          password: "", 
          confirmPassword: "", 
          gradeLevel: undefined,
          schoolName: "",
          province: undefined,
          subjects: [],
          acceptTerms: false 
        },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      if (type === "login") {
        await login((data as LoginFormValues).email, (data as LoginFormValues).password);
        navigate(redirectTo);
      } else {
        const { confirmPassword, acceptTerms, ...registerData } = data as RegisterFormValues;
        await register({ ...registerData, role: "student" });
        
        // Try to get the user id from Supabase Auth
        const { data: authUser } = await supabase.auth.getUser();
        const userId = authUser?.user?.id;
        
        if (userId) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: userId,
              full_name: registerData.fullName,
              role: 'student',
              avatar: null,
              phone_number: registerData.phoneNumber,
              date_of_birth: registerData.dateOfBirth,
              gender: registerData.gender,
              grade_level: registerData.gradeLevel,
              school_name: registerData.schoolName,
              province: registerData.province,
              subjects: registerData.subjects,
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
    } catch (error: any) {
      toast({
        title: type === "login" ? "Đăng nhập thất bại" : "Đăng ký thất bại",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Handle OTP verification
  const handleSendOTP = async () => {
    try {
      const phoneNumber = form.getValues('phoneNumber');
      // Implement OTP sending logic here
      setOtpSent(true);
      toast({
        title: 'Mã OTP đã được gửi',
        description: 'Vui lòng kiểm tra điện thoại của bạn',
      });
    } catch (error: any) {
      toast({
        title: 'Gửi OTP thất bại',
        description: error.message,
        variant: 'destructive',
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
        
        {type === "register" && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
              >
                <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                Facebook
              </Button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
              </div>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "register" && (
              <>
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

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
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
            
            {type === "register" && (
              <>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                        <Input 
                          type="tel" 
                          placeholder="Nhập số điện thoại của bạn" 
                          {...field} 
                        />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendOTP}
                            disabled={otpSent}
                          >
                            {otpSent ? 'Đã gửi' : 'Gửi OTP'}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cấp học hiện tại</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="">Chọn cấp học</option>
                          {gradeLevels.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trường học</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên trường của bạn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tỉnh/Thành phố</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {/* Add Vietnamese provinces here */}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Môn học quan tâm</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {subjects.map((subject) => (
                            <label key={subject} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(subject)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...(field.value || []), subject]
                                    : (field.value || []).filter((s) => s !== subject);
                                  field.onChange(newValue);
                                }}
                              />
                              <span>{subject}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
              <>
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
            
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Tôi đồng ý với{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto font-normal"
                          onClick={() => setIsTermsModalOpen(true)}
                        >
                          điều khoản và điều kiện
                        </Button>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              </>
            )}
            
            <Button type="submit" className="w-full bg-[#e63946] hover:bg-red-700 text-white">
              {type === "login" ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
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

      {type === "register" && (
        <TermsModal 
          isOpen={isTermsModalOpen} 
          onClose={() => setIsTermsModalOpen(false)} 
        />
      )}
    </LotusBackground>
  );
};

export default AuthForm;
