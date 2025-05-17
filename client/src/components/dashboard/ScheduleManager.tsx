import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, parseISO, startOfDay, isAfter } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00"
];

interface ScheduleManagerProps {
  isTeacher: boolean;
}

const ScheduleManager = ({ isTeacher }: ScheduleManagerProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [createDialog, setCreateDialog] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/teachers/1/schedules"], // Assuming teacher ID 1 for demo
    queryFn: async () => {
      const response = await fetch("/api/teachers/1/schedules");
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      return response.json();
    },
  });

  // Filter schedules for selected date
  const getSchedulesForDate = (date: Date | undefined) => {
    if (!date || !schedules) return [];

    const dateString = format(date, "yyyy-MM-dd");
    
    return schedules.filter((schedule: any) => 
      format(new Date(schedule.startTime), "yyyy-MM-dd") === dateString
    ).sort((a: any, b: any) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !schedules) return timeSlots;

    const dateSchedules = getSchedulesForDate(selectedDate);
    const bookedTimes = dateSchedules.map((schedule: any) => 
      format(new Date(schedule.startTime), "HH:mm")
    );
    
    return timeSlots.filter(time => !bookedTimes.includes(time));
  };

  // Handle creating new schedule
  const handleCreateSchedule = async () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn ngày và thời gian.",
        variant: "destructive",
      });
      return;
    }

    // Validate start time is before end time
    if (startTime >= endTime) {
      toast({
        title: "Thời gian không hợp lệ",
        description: "Thời gian kết thúc phải sau thời gian bắt đầu.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create date strings for the API
      const startDate = new Date(selectedDate);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startDate.setHours(startHour, startMinute, 0);

      const endDate = new Date(selectedDate);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endDate.setHours(endHour, endMinute, 0);

      // Make API request
      await apiRequest("POST", "/api/schedules", {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status: "available",
      });

      toast({
        title: "Tạo lịch thành công",
        description: "Bạn đã thêm lịch dạy mới.",
      });

      // Refetch schedules
      queryClient.invalidateQueries({ queryKey: ["/api/teachers/1/schedules"] });
      
      // Reset form and close dialog
      setStartTime("");
      setEndTime("");
      setCreateDialog(false);
    } catch (error) {
      toast({
        title: "Tạo lịch thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo lịch.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get schedules for the selected date
  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];
  const availableTimeSlots = getAvailableTimeSlots();

  // Check if the selected date is in the past
  const isPastDate = selectedDate ? isAfter(startOfDay(new Date()), startOfDay(selectedDate)) : false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý lịch {isTeacher ? "dạy" : "học"}</CardTitle>
          <CardDescription>
            {isTeacher
              ? "Thêm và quản lý lịch dạy của bạn"
              : "Xem lịch học của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Chọn ngày</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => isAfter(startOfDay(new Date()), startOfDay(date))}
              />

              {isTeacher && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => setCreateDialog(true)}
                  disabled={isPastDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm lịch dạy mới
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Lịch cho ngày {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Đang tải...</span>
                </div>
              ) : selectedDateSchedules.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateSchedules.map((schedule: any) => (
                    <div
                      key={schedule.id}
                      className={`p-3 rounded-md border ${
                        schedule.status === "available"
                          ? "border-green-500 bg-green-50"
                          : schedule.status === "booked"
                          ? "border-primary bg-primary/10"
                          : "border-neutral-200 bg-neutral-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-3 text-lg font-medium">
                            {format(new Date(schedule.startTime), "HH:mm")} -{" "}
                            {format(new Date(schedule.endTime), "HH:mm")}
                          </div>
                        </div>
                        <div>
                          {schedule.status === "available" ? (
                            <span className="text-green-600 text-sm font-medium">
                              Sẵn sàng
                            </span>
                          ) : schedule.status === "booked" ? (
                            <span className="text-primary text-sm font-medium">
                              Đã đặt
                            </span>
                          ) : (
                            <span className="text-neutral-500 text-sm font-medium">
                              Không khả dụng
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <p className="text-muted-foreground">
                    {isPastDate
                      ? "Không thể thêm lịch cho ngày đã qua."
                      : "Không có lịch cho ngày này."}
                  </p>
                  {isTeacher && !isPastDate && (
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => setCreateDialog(true)}
                    >
                      Thêm lịch dạy mới
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Schedule Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm lịch dạy mới</DialogTitle>
            <DialogDescription>
              Chọn thời gian bắt đầu và kết thúc cho buổi học
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Ngày</h4>
              <p>
                {selectedDate
                  ? format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })
                  : "Chưa chọn ngày"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="start-time">
                  Thời gian bắt đầu
                </label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="end-time">
                  Thời gian kết thúc
                </label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots
                      .filter((time) => time > startTime)
                      .map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialog(false);
                setStartTime("");
                setEndTime("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={!startTime || !endTime || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Lưu lịch dạy"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManager;
