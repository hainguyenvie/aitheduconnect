import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Loader2, Star, X } from "lucide-react";

const StudentBookings = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch student bookings
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["/api/bookings/student"],
    queryFn: async () => {
      const response = await fetch("/api/bookings/student");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Format status for display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Chờ xác nhận</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: number) => {
    try {
      setIsSubmitting(true);
      await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, {
        status: "cancelled",
      });

      toast({
        title: "Hủy đặt lịch thành công",
        description: "Bạn đã hủy đặt lịch học thành công.",
      });

      // Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/student"] });
    } catch (error) {
      toast({
        title: "Hủy đặt lịch thất bại",
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/reviews", {
        bookingId: selectedBooking.id,
        teacherProfileId: selectedBooking.teacherProfile.id,
        courseId: selectedBooking.course?.id || null,
        rating,
        comment,
      });

      toast({
        title: "Gửi đánh giá thành công",
        description: "Cảm ơn bạn đã đánh giá buổi học.",
      });

      // Close dialog and reset form
      setReviewDialog(false);
      setRating(5);
      setComment("");
      setSelectedBooking(null);

      // Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/student"] });
    } catch (error) {
      toast({
        title: "Gửi đánh giá thất bại",
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process bookings into different categories
  const getFilteredBookings = (status: string | string[]) => {
    if (!bookings) return [];
    if (Array.isArray(status)) {
      return bookings.filter((booking: any) => status.includes(booking.status));
    }
    return bookings.filter((booking: any) => booking.status === status);
  };

  const upcomingBookings = getFilteredBookings(["confirmed", "pending"]);
  const completedBookings = getFilteredBookings("completed");
  const cancelledBookings = getFilteredBookings("cancelled");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp tới {upcomingBookings.length > 0 && `(${upcomingBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành {completedBookings.length > 0 && `(${completedBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy {cancelledBookings.length > 0 && `(${cancelledBookings.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Lịch học sắp tới</CardTitle>
              <CardDescription>
                Danh sách các buổi học sắp tới đã được đặt lịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giáo viên</TableHead>
                      <TableHead>Thông tin buổi học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.teacher?.avatar} />
                              <AvatarFallback>
                                {booking.teacher?.fullName
                                  ? getInitials(booking.teacher.fullName)
                                  : "GV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.teacher?.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.teacherProfile?.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.course ? (
                            <div>
                              <Badge className="bg-secondary mb-1">Khóa học</Badge>
                              <p className="font-medium">{booking.course.title}</p>
                            </div>
                          ) : (
                            <div>
                              <Badge className="bg-primary mb-1">Buổi học lẻ</Badge>
                              <p className="font-medium">
                                {formatPrice(booking.teacherProfile?.hourlyRate || 0)}/giờ
                              </p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.schedule ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p>
                                  {format(new Date(booking.schedule.startTime), "dd/MM/yyyy")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(booking.schedule.startTime), "HH:mm")} -{" "}
                                  {format(new Date(booking.schedule.endTime), "HH:mm")}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Chưa có lịch cụ thể</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          {booking.status === "pending" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Hủy"
                              )}
                            </Button>
                          )}
                          {booking.status === "confirmed" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={isSubmitting}
                              >
                                Hủy
                              </Button>
                              <Button size="sm" disabled>
                                Vào lớp học
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-2">Chưa có lịch học sắp tới</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Bạn chưa có buổi học nào được đặt lịch. Hãy tìm kiếm giáo viên và đặt lịch học ngay!
                  </p>
                  <Button asChild>
                    <a href="/teachers">Tìm kiếm giáo viên</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Buổi học đã hoàn thành</CardTitle>
              <CardDescription>
                Lịch sử các buổi học đã hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giáo viên</TableHead>
                      <TableHead>Thông tin buổi học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.teacher?.avatar} />
                              <AvatarFallback>
                                {booking.teacher?.fullName
                                  ? getInitials(booking.teacher.fullName)
                                  : "GV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.teacher?.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.teacherProfile?.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.course ? (
                            <div>
                              <Badge className="bg-secondary mb-1">Khóa học</Badge>
                              <p className="font-medium">{booking.course.title}</p>
                            </div>
                          ) : (
                            <div>
                              <Badge className="bg-primary mb-1">Buổi học lẻ</Badge>
                              <p className="font-medium">
                                {formatPrice(booking.teacherProfile?.hourlyRate || 0)}/giờ
                              </p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.schedule ? (
                            <div>
                              <p>
                                {format(new Date(booking.schedule.startTime), "dd/MM/yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(booking.schedule.startTime), "HH:mm")} -{" "}
                                {format(new Date(booking.schedule.endTime), "HH:mm")}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Khóa học</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Hoàn thành</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setReviewDialog(true);
                            }}
                          >
                            Đánh giá
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-2">Chưa có buổi học nào đã hoàn thành</h3>
                  <p className="text-muted-foreground">
                    Các buổi học bạn đã hoàn thành sẽ hiển thị ở đây.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Buổi học đã hủy</CardTitle>
              <CardDescription>
                Danh sách các buổi học đã bị hủy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cancelledBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giáo viên</TableHead>
                      <TableHead>Thông tin buổi học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.teacher?.avatar} />
                              <AvatarFallback>
                                {booking.teacher?.fullName
                                  ? getInitials(booking.teacher.fullName)
                                  : "GV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.teacher?.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.teacherProfile?.title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.course ? (
                            <div>
                              <Badge className="bg-secondary mb-1">Khóa học</Badge>
                              <p className="font-medium">{booking.course.title}</p>
                            </div>
                          ) : (
                            <div>
                              <Badge className="bg-primary mb-1">Buổi học lẻ</Badge>
                              <p className="font-medium">
                                {formatPrice(booking.teacherProfile?.hourlyRate || 0)}/giờ
                              </p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.schedule ? (
                            <div>
                              <p>
                                {format(new Date(booking.schedule.startTime), "dd/MM/yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(booking.schedule.startTime), "HH:mm")} -{" "}
                                {format(new Date(booking.schedule.endTime), "HH:mm")}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Khóa học</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">Đã hủy</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <X className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-2">Không có buổi học bị hủy</h3>
                  <p className="text-muted-foreground">
                    Bạn chưa có buổi học nào bị hủy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đánh giá buổi học</DialogTitle>
            <DialogDescription>
              Chia sẻ đánh giá của bạn về buổi học với giáo viên {selectedBooking?.teacher?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Xếp hạng</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-[#ffd60a] text-[#ffd60a]"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Nhận xét</h4>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                rows={4}
                placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewDialog(false);
                setRating(5);
                setComment("");
                setSelectedBooking(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentBookings;
