import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from "@/components/ui/checkbox";
import TermsModal from "./TermsModal";

// Login form schema
const loginSchema = z.object({
  phoneNumber: z.string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 số" })
    .max(11, { message: "Số điện thoại không được quá 11 số" })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ được chứa số" })
    .regex(/^(0[0-9]{9,10})$/, { message: "Số điện thoại phải bắt đầu bằng số 0" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

// Register form schema
const registerSchema = z.object({
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
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper: convert VN phone to E.164
function toE164(phone: string) {
  // Nếu là số Việt Nam và bắt đầu bằng 0, chuyển thành +84
  if (phone.startsWith('0') && phone.length === 10) {
    return '+84' + phone.slice(1);
  }
  return phone;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const otpInterval = useRef<NodeJS.Timeout | null>(null);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: mode === "login" 
      ? { phoneNumber: "", password: "" } 
      : { 
          phoneNumber: "", 
          password: "", 
          confirmPassword: "", 
          acceptTerms: false 
        },
  });

  // Countdown timer effect
  useEffect(() => {
    if (otpStep && otpTimer > 0) {
      otpInterval.current = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (otpInterval.current) clearInterval(otpInterval.current);
    };
  }, [otpStep, otpTimer]);

  useEffect(() => {
    if (otpTimer === 0 && otpInterval.current) {
      clearInterval(otpInterval.current);
    }
  }, [otpTimer]);

  // Handle form submission
  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      if (mode === "login") {
        const phoneE164 = toE164((data as LoginFormValues).phoneNumber);
        await login(phoneE164, (data as LoginFormValues).password);
        // Upsert profile after login
        const { data: authUser } = await supabase.auth.getUser();
        const userId = authUser?.user?.id;
        if (userId) {
          await supabase.from('profiles').upsert([
            {
              id: userId,
              phone_number: phoneE164,
              provider: 'phone',
            },
          ]);
        }
        onClose();
      } else {
        if (!phoneVerified) {
          toast({
            title: 'Chưa xác thực số điện thoại',
            description: 'Vui lòng xác thực số điện thoại trước khi đăng ký.',
            variant: 'destructive',
          });
          return;
        }
        const { confirmPassword, acceptTerms, ...registerData } = data as RegisterFormValues;
        const phoneE164 = toE164(registerData.phoneNumber);
        await register({ ...registerData, phoneNumber: phoneE164, role: "student" });
        // Upsert profile after register
        const { data: authUser } = await supabase.auth.getUser();
        const userId = authUser?.user?.id;
        if (userId) {
          await supabase.from('profiles').upsert([
            {
              id: userId,
              phone_number: phoneE164,
              provider: 'phone',
              role: 'student',
              avatar: null,
            },
          ]);
        }
        onClose();
      }
    } catch (error: any) {
      toast({
        title: mode === "login" ? "Đăng nhập thất bại" : "Đăng ký thất bại",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      onClose();
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
      // Generate a random 6-digit OTP for testing
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setOtpSent(true);
      setOtpStep(true);
      setOtpTimer(60); // 60 seconds countdown
      setOtp("");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setPhoneVerified(false);
      // Simulate sending OTP (log to browser console)
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log(`[DEV] OTP for ${phoneNumber}: ${newOtp}`);
      }
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

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  // OTP input change handler
  const handleOtpDigitChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digit
    const newDigits = [...otpDigits];
    newDigits[idx] = value;
    setOtpDigits(newDigits);
    setOtpError("");
    // Move focus to next input if value entered
    if (value && idx < 5) {
      otpInputsRef.current[idx + 1]?.focus();
    }
    // Auto-verify if all digits are filled
    if (newDigits.every((d) => d.length === 1)) {
      const enteredOtp = newDigits.join("");
      if (enteredOtp === generatedOtp) {
        setPhoneVerified(true);
        setOtpError("");
        toast({
          title: 'Xác thực thành công',
          description: 'Số điện thoại đã được xác thực!',
        });
      } else {
        setOtpError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    }
  };

  // Handle backspace to move focus
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpInputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Container with Backdrop and Centering */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ minHeight: '100vh' }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6"
              style={{ zIndex: 10 }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
                {mode === "login" ? "Đăng nhập vào AithEduConnect" : "Đăng ký tài khoản AithEduConnect"}
              </h2>

              {/* Social Login */}
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => handleSocialLogin('google')}
                >
                  {/* Inline Google SVG icon */}
                  <span className="w-5 h-5 mr-2 inline-block align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                      <g>
                        <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.6l6-6C36.1 5.1 30.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.7 20-21 0-1.4-.2-2.7-.4-3.5z"/>
                        <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.6l6-6C36.1 5.1 30.4 3 24 3 16.1 3 9.1 7.6 6.3 14.7z"/>
                        <path fill="#FBBC05" d="M24 45c6.2 0 11.4-2 15.2-5.5l-7-5.7C29.7 35.6 27 36.5 24 36.5c-5.6 0-10.3-3.7-12-8.7l-6.7 5.2C9.1 40.4 16.1 45 24 45z"/>
                        <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.5 5.2-6.3 6.3l7 5.7C41.7 37.2 45 31.2 45 24c0-1.4-.2-2.7-.4-3.5z"/>
                      </g>
                    </svg>
                  </span>
                  {mode === "login" ? "Đăng nhập với Google" : "Đăng ký với Google"}
                </Button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      {mode === "login" ? "Hoặc đăng nhập với số điện thoại" : "Hoặc đăng ký với số điện thoại"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="tel"
                      placeholder="Nhập số điện thoại của bạn"
                      {...form.register("phoneNumber")}
                      className={form.formState.errors.phoneNumber ? "border-red-500" : ""}
                      disabled={otpStep}
                    />
                    {phoneVerified && (
                      <span className="flex items-center text-green-600 text-xs ml-1">
                        <CheckCircle className="w-4 h-4 mr-1" /> Đã xác thực
                      </span>
                    )}
                    {mode === "register" && !otpStep && !phoneVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendOTP}
                        disabled={otpSent}
                      >
                        {otpSent ? 'Đã gửi' : 'Gửi OTP'}
                      </Button>
                    )}
                  </div>
                  {form.formState.errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* OTP Input and Timer */}
                {mode === "register" && otpStep && !phoneVerified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhập mã OTP
                    </label>
                    <div className="flex gap-2 items-center">
                      {/* 6 OTP input boxes */}
                      {otpDigits.map((digit, idx) => (
                        <Input
                          key={idx}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          ref={el => otpInputsRef.current[idx] = el}
                          className="w-10 text-center text-lg font-mono border border-gray-300 focus:border-primary"
                          autoFocus={idx === 0}
                          disabled={phoneVerified}
                        />
                      ))}
                      {otpTimer > 0 ? (
                        <span className="text-xs text-gray-500 ml-2">Gửi lại OTP sau {otpTimer}s</span>
                      ) : (
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-xs ml-2"
                          onClick={handleResendOTP}
                        >
                          Gửi lại OTP
                        </Button>
                      )}
                    </div>
                    {otpError && (
                      <p className="mt-1 text-xs text-red-500">{otpError}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...form.register("password")}
                      className={form.formState.errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          {...form.register("confirmPassword" as keyof RegisterFormValues)}
                          className={(form.formState.errors as any).confirmPassword ? "border-red-500" : ""}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? "Ẩn" : "Hiện"}
                        </button>
                      </div>
                      {(form.formState.errors as any).confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">
                          {(form.formState.errors as any).confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={form.watch("acceptTerms" as keyof RegisterFormValues) as boolean}
                        onCheckedChange={(checked) => {
                          form.setValue("acceptTerms" as keyof RegisterFormValues, checked as boolean);
                        }}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        Tôi đồng ý với{" "}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => setIsTermsModalOpen(true)}
                        >
                          điều khoản và điều kiện
                        </button>
                      </label>
                    </div>
                    {(form.formState.errors as any).acceptTerms && (
                      <p className="mt-1 text-sm text-red-500">
                        {(form.formState.errors as any).acceptTerms.message}
                      </p>
                    )}
                  </>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={mode === 'register' && !phoneVerified}>
                  {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                </Button>
              </form>

              {/* Toggle mode */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    form.reset();
                  }}
                >
                  {mode === "login"
                    ? "Chưa có tài khoản? Đăng ký ngay"
                    : "Đã có tài khoản? Đăng nhập"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal; 