import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, DollarSign, Loader2, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TeacherStats = () => {
  // Fetch bookings for stats calculation
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["/api/bookings/teacher"],
    queryFn: async () => {
      const response = await fetch("/api/bookings/teacher");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Format price in Vietnamese currency
  const formatPrice = (price: number = 0) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate stats
  const calculateStats = () => {
    if (!bookings) return { totalStudents: 0, totalEarnings: 0, completedBookings: 0, pendingBookings: 0 };

    const uniqueStudents = new Set();
    let totalEarnings = 0;
    let completedBookings = 0;
    let pendingBookings = 0;

    bookings.forEach((booking: any) => {
      if (booking.studentId) {
        uniqueStudents.add(booking.studentId);
      }

      if (booking.status === "completed") {
        completedBookings++;
        // Calculate earnings based on course price or hourly rate
        const amount = booking.course
          ? booking.course.price
          : booking.teacherProfile?.hourlyRate || 0;
        totalEarnings += amount;
      }

      if (booking.status === "pending") {
        pendingBookings++;
      }
    });

    return {
      totalStudents: uniqueStudents.size,
      totalEarnings,
      completedBookings,
      pendingBookings,
    };
  };

  // Generate chart data (last 6 months)
  const generateChartData = () => {
    if (!bookings) return [];

    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    const today = new Date();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const month = today.getMonth() - i;
      const year = today.getFullYear();
      
      let adjustedMonth = month;
      let adjustedYear = year;
      
      if (month < 0) {
        adjustedMonth = 12 + month;
        adjustedYear = year - 1;
      }

      const monthName = months[adjustedMonth];
      const monthEarnings = bookings
        .filter((booking: any) => {
          if (booking.status !== "completed") return false;
          const bookingDate = new Date(booking.createdAt);
          return (
            bookingDate.getMonth() === adjustedMonth &&
            bookingDate.getFullYear() === adjustedYear
          );
        })
        .reduce((total: number, booking: any) => {
          const amount = booking.course
            ? booking.course.price
            : booking.teacherProfile?.hourlyRate || 0;
          return total + amount;
        }, 0);

      const monthStudents = new Set(
        bookings
          .filter((booking: any) => {
            const bookingDate = new Date(booking.createdAt);
            return (
              bookingDate.getMonth() === adjustedMonth &&
              bookingDate.getFullYear() === adjustedYear
            );
          })
          .map((booking: any) => booking.studentId)
      ).size;

      chartData.push({
        name: monthName,
        earnings: monthEarnings,
        students: monthStudents,
      });
    }

    return chartData;
  };

  const stats = calculateStats();
  const chartData = generateChartData();

  if (isLoadingBookings) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +4.2%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +10.3%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi học đã hoàn thành</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12.5%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu mới</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                -5.2%
              </span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê thu nhập</CardTitle>
          <CardDescription>
            Biểu đồ thu nhập và số lượng học viên trong 6 tháng qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="hsl(var(--chart-1))"
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--chart-2))"
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "earnings") {
                      return [formatPrice(value as number), "Thu nhập"];
                    }
                    return [value, "Học viên"];
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === "earnings") return "Thu nhập";
                    if (value === "students") return "Học viên";
                    return value;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="earnings"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="students"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStats;
