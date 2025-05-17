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
import { CheckCircle, Clock, Loader2, X } from "lucide-react";

const TeacherBookings = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);

  // Fetch teacher bookings
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["/api/bookings/teacher"],
    queryFn: async () => {
      const response = await fetch("/api/bookings/teacher");
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

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId: number) => {
    try {
      setIsSubmitting(true);
      await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, {
        status: "confirmed",
      });

      toast({
        title: "Xác nhận đặt lịch thành công",
        description: "Bạn đã xác nhận đặt lịch học thành công.",
      });

      // Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/teacher"] });
    } catch (error) {
      toast({
        title: "Xác nhận đặt lịch thất bại",
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setActionDialog(false);
    }
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
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/teacher"] });
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
      setActionDialog(false);
    }
  };

  // Handle complete booking
  const handleCompleteBooking = async (bookingId: number) => {
    try {
      setIsSubmitting(true);
      await apiRequest("PATCH", `/api/bookings/${bookingId}/status`, {
        status: "completed",
      });

      toast({
        title: "Hoàn thành buổi học",
        description: "Bạn đã đánh dấu buổi học là hoàn thành.",
      });

      // Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/teacher"] });
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setActionDialog(false);
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

  const pendingBookings = getFilteredBookings("pending");
  const confirmedBookings = getFilteredBookings("confirmed");
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
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ xác nhận {pendingBookings.length > 0 && `(${pendingBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Đã xác nhận {confirmedBookings.length > 0 && `(${confirmedBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành {completedBookings.length > 0 && `(${completedBookings.length})`}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy {cancelledBookings.length > 0 && `(${cancelledBookings.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Lịch học chờ xác nhận</CardTitle>
              <CardDescription>
                Danh sách các buổi học mới mà học viên đã đặt lịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học viên</TableHead>
                      <TableHead>Thông tin buổi học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.student?.avatar} />
                              <AvatarFallback>
                                {booking.student?.fullName
                                  ? getInitials(booking.student.fullName)
                                  : "HV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.student?.fullName}</p>
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setActionDialog(true);
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-2">Không có lịch học chờ xác nhận</h3>
                  <p className="text-muted-foreground">
                    Khi học viên đặt lịch học với bạn, các yêu cầu sẽ xuất hiện ở đây.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed">
          <Card>
            <CardHeader>
              <CardTitle>Lịch học đã xác nhận</CardTitle>
              <CardDescription>
                Danh sách các buổi học đã được xác nhận
              </CardDescription>
            </CardHeader>
            <CardContent>
              {confirmedBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học viên</TableHead>
                      <TableHead>Thông tin buổi học</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmedBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={booking.student?.avatar} />
                              <AvatarFallback>
                                {booking.student?.fullName
                                  ? getInitials(booking.student.fullName)
                                  : "HV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.student?.fullName}</p>
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
                          <Badge className="bg-blue-500">Đã xác nhận</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                handleCompleteBooking(booking.id);
                              }}
                            >
                              Hoàn thành
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setActionDialog(true);
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-lg mb-2">Không có lịch học đã xác nhận</h3>
                  <p className="text-muted-foreground">
                    Khi bạn xác nhận các yêu cầu lịch học, chúng sẽ xuất hiện ở đây.
                  </p>
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
                      <TableHead>Học viên</TableHead>
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
                              <AvatarImage src={booking.student?.avatar} />
                              <AvatarFallback>
                                {booking.student?.fullName
                                  ? getInitials(booking.student.fullName)
                                  : "HV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.student?.fullName}</p>
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
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setActionDialog(true);
                            }}
                          >
                            Xem chi tiết
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
                      <TableHead>Học viên</TableHead>
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
                              <AvatarImage src={booking.student?.avatar} />
                              <AvatarFallback>
                                {booking.student?.fullName
                                  ? getInitials(booking.student.fullName)
                                  : "HV"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{booking.student?.fullName}</p>
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
                    Các buổi học bị hủy sẽ hiển thị ở đây.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Action Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết đặt lịch</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về lịch học
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Học viên</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedBooking.student?.avatar} />
                      <AvatarFallback>
                        {selectedBooking.student?.fullName
                          ? getInitials(selectedBooking.student.fullName)
                          : "HV"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedBooking.student?.fullName}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Trạng thái</h4>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Thông tin buổi học</h4>
                <div className="mt-1">
                  {selectedBooking.course ? (
                    <div className="flex items-start gap-2">
                      <Badge className="bg-secondary mt-0.5">Khóa học</Badge>
                      <div>
                        <p className="font-medium">{selectedBooking.course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(selectedBooking.course.price)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <Badge className="bg-primary mt-0.5">Buổi học lẻ</Badge>
                      <div>
                        <p className="font-medium">Buổi học 1:1</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(selectedBooking.teacherProfile?.hourlyRate || 0)}/giờ
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Thời gian</h4>
                <div className="mt-1">
                  {selectedBooking.schedule ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p>
                          {format(
                            new Date(selectedBooking.schedule.startTime),
                            "dd MMMM, yyyy",
                            { locale: vi }
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedBooking.schedule.startTime), "HH:mm")} -{" "}
                          {format(new Date(selectedBooking.schedule.endTime), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Khóa học - Lịch học sẽ được thỏa thuận sau
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Ghi chú</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Học viên chưa thêm ghi chú cho buổi học này.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedBooking?.status === "pending" && (
              <div className="flex justify-between w-full">
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Từ chối"
                  )}
                </Button>
                <Button
                  onClick={() => handleConfirmBooking(selectedBooking.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Xác nhận"
                  )}
                </Button>
              </div>
            )}
            {selectedBooking?.status === "confirmed" && (
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={() => setActionDialog(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => handleCompleteBooking(selectedBooking.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Đánh dấu hoàn thành"
                  )}
                </Button>
              </div>
            )}
            {(selectedBooking?.status === "completed" ||
              selectedBooking?.status === "cancelled") && (
              <Button variant="outline" onClick={() => setActionDialog(false)}>
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherBookings;
