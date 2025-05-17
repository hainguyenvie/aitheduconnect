import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Calendar, User, BookOpen } from "lucide-react";

const mockRegisteredClasses = [
  {
    id: 1,
    name: "Toán cao cấp cơ bản",
    teacher: "Nguyễn Văn A",
    schedule: "Thứ 2, 18:00 - 19:00",
    status: "Sắp diễn ra",
  },
  {
    id: 2,
    name: "Đại số tuyến tính",
    teacher: "Trần Thị B",
    schedule: "Thứ 4, 19:00 - 20:00",
    status: "Đã hoàn thành",
  },
  {
    id: 3,
    name: "Giải tích",
    teacher: "Lê Hoàng C",
    schedule: "Thứ 6, 20:00 - 21:00",
    status: "Sắp diễn ra",
  },
];

const RegisteredClasses = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lớp đã đăng ký</CardTitle>
        <CardDescription>Danh sách các lớp bạn đã đăng ký tham gia</CardDescription>
      </CardHeader>
      <CardContent>
        {mockRegisteredClasses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-2" />
            <div>Bạn chưa đăng ký lớp học nào.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {mockRegisteredClasses.map((cls) => (
              <div key={cls.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-lg">{cls.name}</div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>Giáo viên: {cls.teacher}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Lịch: {cls.schedule}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls.status === "Sắp diễn ra" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegisteredClasses; 