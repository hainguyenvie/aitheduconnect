import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentCardProps {
  isTeacher: boolean;
}

const PaymentCard = ({ isTeacher }: PaymentCardProps) => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get bookings that need payment (have status "confirmed" but no payment)
  const { data: bookings, isLoading } = useQuery({
    queryKey: [`/api/bookings/${isTeacher ? "teacher" : "student"}`],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${isTeacher ? "teacher" : "student"}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Filter bookings that need payment
  const getPendingPayments = () => {
    if (!bookings) return [];

    return bookings
      .filter((booking: any) => 
        booking.status === "confirmed" &&
        !booking.isPaid // Assuming there's some property that indicates if a booking is paid
      )
      .slice(0, 3); // Only show top 3
  };

  // Format price in Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Mock function to process payment
  const handleProcessPayment = async () => {
    if (!selectedBooking) return;

    try {
      setIsProcessing(true);
      
      // Simulate payment processing
      // In a real app, this would integrate with a payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API call to update payment status
      await apiRequest("POST", `/api/payments/${selectedBooking.id}/process`, {
        transactionId: `TX-${Date.now()}`
      });

      toast({
        title: "Thanh toán thành công",
        description: "Bạn đã thanh toán thành công buổi học.",
      });

      // Refetch bookings to update UI
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/${isTeacher ? "teacher" : "student"}`] });
      
      // Close dialog
      setPaymentDialog(false);
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: "Thanh toán thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý thanh toán.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingPayments = getPendingPayments();

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{isTeacher ? "Thanh toán từ học viên" : "Thanh toán học phí"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : pendingPayments.length > 0 ? (
            <div className="space-y-4">
              {pendingPayments.map((booking: any) => {
                const amount = booking.course
                  ? booking.course.price
                  : booking.teacherProfile?.hourlyRate || 0;

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <Badge className="mb-1 bg-orange-500">Chờ thanh toán</Badge>
                      <h3 className="font-medium">
                        {booking.course ? booking.course.title : "Buổi học 1:1"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.schedule
                          ? format(new Date(booking.schedule.startTime), "dd/MM/yyyy")
                          : "Khóa học"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#e63946] mb-1">
                        {formatPrice(amount)}
                      </p>
                      {!isTeacher && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setPaymentDialog(true);
                          }}
                        >
                          Thanh toán
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="text-center mt-4">
                <Button variant="link" className="text-primary">
                  {isTeacher ? "Xem tất cả thanh toán" : "Xem tất cả hóa đơn"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-lg mb-2">
                {isTeacher
                  ? "Không có thanh toán đang chờ xử lý"
                  : "Không có học phí cần thanh toán"}
              </h3>
              <p className="text-muted-foreground">
                {isTeacher
                  ? "Các khoản thanh toán từ học viên sẽ hiển thị ở đây."
                  : "Bạn không có khoản học phí nào cần thanh toán."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanh toán học phí</DialogTitle>
            <DialogDescription>
              Vui lòng hoàn tất thanh toán để xác nhận buổi học
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Thông tin thanh toán</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Buổi học:</span>
                    <span className="font-medium">
                      {selectedBooking.course
                        ? selectedBooking.course.title
                        : "Buổi học 1:1"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Giáo viên:</span>
                    <span>{selectedBooking.teacher?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ngày học:</span>
                    <span>
                      {selectedBooking.schedule
                        ? format(new Date(selectedBooking.schedule.startTime), "dd/MM/yyyy")
                        : "Khóa học"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Số tiền:</span>
                    <span className="font-bold text-[#e63946]">
                      {formatPrice(
                        selectedBooking.course
                          ? selectedBooking.course.price
                          : selectedBooking.teacherProfile?.hourlyRate || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Phương thức thanh toán</h4>
                <div className="border rounded-md p-3 flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Thẻ tín dụng/Thẻ ghi nợ</p>
                    <p className="text-xs text-muted-foreground">
                      Thanh toán an toàn qua cổng thanh toán bảo mật
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="card-number">
                      Số thẻ
                    </label>
                    <input
                      id="card-number"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="card-name">
                      Tên chủ thẻ
                    </label>
                    <input
                      id="card-name"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="card-expiry">
                      Ngày hết hạn
                    </label>
                    <input
                      id="card-expiry"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="card-cvc">
                      CVC
                    </label>
                    <input
                      id="card-cvc"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="123"
                      type="password"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPaymentDialog(false);
                setSelectedBooking(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Hoàn tất thanh toán"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentCard;
