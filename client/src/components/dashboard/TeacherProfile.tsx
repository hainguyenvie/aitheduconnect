import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertCircle, 
  CheckCircle, 
  GraduationCap, 
  Loader2, 
  RefreshCw, 
  Video 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Kiểu dữ liệu hồ sơ giáo viên
type TeacherProfile = {
  id: number;
  userId: number;
  title: string;
  education: string | null;
  experience: string | null;
  hourlyRate: number;
  introVideo: string | null;
  applicationId: number | null;
  isVerified: boolean | null;
  rating: number | null;
  ratingCount: number | null;
  user?: {
    fullName: string;
    email: string;
    avatar: string | null;
  };
};

// Schema cho form cập nhật hồ sơ
const profileSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  education: z.string().min(10, "Thông tin học vấn phải có ít nhất 10 ký tự").max(500, "Thông tin học vấn không được vượt quá 500 ký tự").nullable(),
  experience: z.string().min(10, "Kinh nghiệm giảng dạy phải có ít nhất 10 ký tự").max(500, "Kinh nghiệm giảng dạy không được vượt quá 500 ký tự").nullable(),
  hourlyRate: z.number().min(50000, "Học phí không được thấp hơn 50.000 VND").max(1000000, "Học phí không được cao hơn 1.000.000 VND"),
  introVideo: z.string().url("Vui lòng nhập URL hợp lệ").nullable().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const TeacherProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy thông tin hồ sơ giáo viên
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["/api/teacher-profile/me"],
    queryFn: async () => {
      const response = await fetch("/api/teacher-profile/me");
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin hồ sơ giáo viên");
      }
      return response.json() as Promise<TeacherProfile>;
    },
  });

  // Khởi tạo form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: profile?.title || "",
      education: profile?.education || "",
      experience: profile?.experience || "",
      hourlyRate: profile?.hourlyRate || 150000,
      introVideo: profile?.introVideo || "",
    },
  });

  // Cập nhật giá trị mặc định khi profile được tải
  useState(() => {
    if (profile) {
      form.reset({
        title: profile.title,
        education: profile.education,
        experience: profile.experience,
        hourlyRate: profile.hourlyRate,
        introVideo: profile.introVideo,
      });
    }
  });

  // Xử lý cập nhật hồ sơ
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest("PATCH", "/api/teacher-profile/me", data);
      
      if (response.ok) {
        toast({
          title: "Cập nhật thành công",
          description: "Hồ sơ giáo viên của bạn đã được cập nhật.",
        });
        
        // Cập nhật lại dữ liệu
        queryClient.invalidateQueries({ queryKey: ["/api/teacher-profile/me"] });
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Cập nhật thất bại",
          description: errorData.message || "Có lỗi xảy ra khi cập nhật hồ sơ.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ giáo viên</CardTitle>
          <CardDescription>
            Thông tin giảng viên của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ giáo viên</CardTitle>
          <CardDescription>
            Thông tin giảng viên của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              Không thể tải thông tin hồ sơ giáo viên. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/teacher-profile/me"] })}
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ giáo viên</CardTitle>
          <CardDescription>
            Chưa có hồ sơ giáo viên
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-lg mb-2">Hồ sơ giáo viên chưa được tạo</h3>
          <p className="text-muted-foreground mb-6">
            Không tìm thấy hồ sơ giáo viên của bạn. Vui lòng liên hệ với quản trị viên.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <CardTitle>Hồ sơ giáo viên</CardTitle>
            <CardDescription>
              {isEditing ? "Cập nhật thông tin giảng viên của bạn" : "Thông tin giảng viên của bạn"}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              className="shrink-0"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa hồ sơ
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
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
                        value={field.value || ""}
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
                        value={field.value || ""}
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
                    <FormLabel>Học phí (VND/giờ)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
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
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Cung cấp một video giới thiệu về bản thân và phương pháp giảng dạy của bạn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-20 w-20">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user?.fullName || "Ảnh đại diện"} />
                ) : (
                  <AvatarFallback>{user?.fullName?.charAt(0) || "T"}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{user?.fullName}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {profile.isVerified ? (
                    <div className="flex items-center text-sm text-green-600 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Đã xác thực</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Chưa xác thực</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{profile.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <GraduationCap className="h-4 w-4" />
                    <p className="font-medium">Học vấn</p>
                  </div>
                  <p className="text-sm whitespace-pre-line">{profile.education || "Chưa cập nhật"}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <GraduationCap className="h-4 w-4" />
                    <p className="font-medium">Kinh nghiệm</p>
                  </div>
                  <p className="text-sm whitespace-pre-line">{profile.experience || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Video className="h-4 w-4" />
                <p className="font-medium">Video giới thiệu</p>
              </div>
              {profile.introVideo ? (
                <a 
                  href={profile.introVideo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {profile.introVideo}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa cập nhật</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {profile.hourlyRate?.toLocaleString()} VND
                    </p>
                    <p className="text-sm text-muted-foreground">Học phí/giờ</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {profile.rating?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Đánh giá</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {profile.ratingCount || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Lượt đánh giá</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherProfile;