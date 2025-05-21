import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Search, Filter, Users, Clock, GraduationCap, Target, Award, DollarSign, Calendar, Globe, Video, Star } from "lucide-react";

interface Teacher {
  name: string;
  experience: string;
  education: string;
  rating: number;
  avatar: string;
}

interface Schedule {
  startDate: string;
  endDate: string;
  time: string;
  days: string[];
}

interface Students {
  current: number;
  max: number;
}

interface GroupClass {
  id: number;
  name: string;
  teacher: Teacher;
  schedule: Schedule;
  students: Students;
  price: number;
  subject: string;
  level: string;
  goal: string;
  language: string;
  format: string;
  description: string;
}

// Sample data for group classes
const sampleGroupClasses: GroupClass[] = [
  {
    id: 1,
    name: "Lớp Tiếng Anh Giao Tiếp Cơ Bản",
    teacher: {
      name: "Nguyễn Văn A",
      experience: "5 năm",
      education: "Thạc sĩ Ngôn ngữ Anh",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    schedule: {
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      time: "18:00 - 20:00",
      days: ["Thứ 2", "Thứ 4", "Thứ 6"]
    },
    students: {
      current: 8,
      max: 12
    },
    price: 1200000,
    subject: "Tiếng Anh",
    level: "Cơ bản",
    goal: "Giao tiếp",
    language: "Tiếng Việt",
    format: "Online",
    description: "Khóa học tập trung vào kỹ năng giao tiếp tiếng Anh cơ bản, giúp học viên tự tin trong các tình huống giao tiếp hàng ngày."
  },
  {
    id: 2,
    name: "Lớp Toán Nâng Cao THPT",
    teacher: {
      name: "Trần Thị B",
      experience: "8 năm",
      education: "Thạc sĩ Toán học",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    schedule: {
      startDate: "2024-04-05",
      endDate: "2024-07-05",
      time: "19:00 - 21:00",
      days: ["Thứ 3", "Thứ 5", "Thứ 7"]
    },
    students: {
      current: 10,
      max: 15
    },
    price: 1500000,
    subject: "Toán",
    level: "Nâng cao",
    goal: "Thi đại học",
    language: "Tiếng Việt",
    format: "Offline",
    description: "Khóa học chuyên sâu về các chuyên đề toán học THPT, tập trung vào các dạng bài thi đại học."
  },
  {
    id: 3,
    name: "Lớp Vật Lý THPT - Chuyên đề Điện",
    teacher: {
      name: "Lê Văn C",
      experience: "6 năm",
      education: "Thạc sĩ Vật lý",
      rating: 4.7,
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    schedule: {
      startDate: "2024-04-10",
      endDate: "2024-07-10",
      time: "17:30 - 19:30",
      days: ["Thứ 2", "Thứ 5"]
    },
    students: {
      current: 6,
      max: 10
    },
    price: 1800000,
    subject: "Vật lý",
    level: "Nâng cao",
    goal: "Thi đại học",
    language: "Tiếng Việt",
    format: "Hybrid",
    description: "Chuyên sâu về chuyên đề Điện học trong chương trình Vật lý THPT, bao gồm lý thuyết và bài tập nâng cao."
  },
  {
    id: 4,
    name: "Lớp Tiếng Anh IELTS 6.5+",
    teacher: {
      name: "Sarah Johnson",
      experience: "10 năm",
      education: "Thạc sĩ TESOL",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    schedule: {
      startDate: "2024-04-15",
      endDate: "2024-08-15",
      time: "19:00 - 21:00",
      days: ["Thứ 3", "Thứ 6"]
    },
    students: {
      current: 5,
      max: 8
    },
    price: 2500000,
    subject: "Tiếng Anh",
    level: "Nâng cao",
    goal: "Chứng chỉ quốc tế",
    language: "Tiếng Anh",
    format: "Online",
    description: "Khóa học chuyên sâu luyện thi IELTS, tập trung vào các kỹ năng cần thiết để đạt band 6.5 trở lên."
  },
  {
    id: 5,
    name: "Lớp Hóa Học THPT - Chuyên đề Hữu cơ",
    teacher: {
      name: "Phạm Thị D",
      experience: "7 năm",
      education: "Thạc sĩ Hóa học",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    schedule: {
      startDate: "2024-04-20",
      endDate: "2024-07-20",
      time: "18:00 - 20:00",
      days: ["Thứ 4", "Thứ 7"]
    },
    students: {
      current: 9,
      max: 12
    },
    price: 1600000,
    subject: "Hóa học",
    level: "Trung bình",
    goal: "Thi đại học",
    language: "Tiếng Việt",
    format: "Offline",
    description: "Chuyên sâu về Hóa học Hữu cơ, bao gồm các phản ứng, cơ chế và bài tập ứng dụng."
  },
  {
    id: 6,
    name: "Lớp Ngữ Văn THPT - Chuyên đề Nghị luận",
    teacher: {
      name: "Hoàng Văn E",
      experience: "12 năm",
      education: "Thạc sĩ Ngữ văn",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    schedule: {
      startDate: "2024-04-25",
      endDate: "2024-07-25",
      time: "17:00 - 19:00",
      days: ["Thứ 2", "Thứ 4"]
    },
    students: {
      current: 7,
      max: 10
    },
    price: 1400000,
    subject: "Ngữ văn",
    level: "Nâng cao",
    goal: "Thi đại học",
    language: "Tiếng Việt",
    format: "Hybrid",
    description: "Chuyên sâu về kỹ năng viết văn nghị luận, phân tích tác phẩm văn học và làm bài thi THPT Quốc gia."
  }
];

// Filter options
const filterOptions = {
  subjects: ["Toán", "Tiếng Anh", "Vật lý", "Hóa học", "Sinh học", "Ngữ văn"],
  levels: ["Cơ bản", "Trung bình", "Nâng cao"],
  goals: ["Giao tiếp", "Thi đại học", "Chứng chỉ quốc tế", "Nâng cao kiến thức"],
  teacherExperience: ["1-3 năm", "3-5 năm", "5-10 năm", "Trên 10 năm"],
  priceRanges: ["Dưới 1 triệu", "1-2 triệu", "2-3 triệu", "Trên 3 triệu"],
  timeSlots: ["Sáng (8:00-12:00)", "Chiều (13:00-17:00)", "Tối (18:00-22:00)"],
  languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Việt + Tiếng Anh"],
  formats: ["Online", "Offline", "Hybrid"],
  ratings: ["4.0+", "4.5+", "4.8+"]
};

const GroupClassesPage = () => {
  const [filters, setFilters] = useState({
    subject: "",
    level: "",
    goal: "",
    experience: "",
    price: "",
    timeSlot: "",
    language: "",
    format: "",
    rating: ""
  });

  const [selectedClass, setSelectedClass] = useState<GroupClass | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredClasses = sampleGroupClasses.filter(classItem => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      switch (key) {
        case "subject":
          return classItem.subject === value;
        case "level":
          return classItem.level === value;
        case "goal":
          return classItem.goal === value;
        case "experience":
          return classItem.teacher.experience.includes(value.split("-")[0]);
        case "price":
          const priceRange = value.split(" ")[0].split("-");
          if (priceRange[0] === "Dưới") {
            return classItem.price < 1000000;
          } else if (priceRange[0] === "Trên") {
            return classItem.price > 3000000;
          } else {
            return classItem.price >= parseInt(priceRange[0]) * 1000000 &&
                   classItem.price <= parseInt(priceRange[1]) * 1000000;
          }
        case "timeSlot":
          return classItem.schedule.time.includes(value.split("(")[1].split("-")[0].trim());
        case "language":
          return classItem.language === value;
        case "format":
          return classItem.format === value;
        case "rating":
          return classItem.teacher.rating >= parseFloat(value);
        default:
          return true;
      }
    });
  });

  return (
    <>
      <Helmet>
        <title>Lớp học nhóm | Vietnamese Study Hub</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
                <CardDescription>Tìm lớp học phù hợp với bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Môn học</label>
                  <Select value={filters.subject} onValueChange={(value) => handleFilterChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trình độ</label>
                  <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mục tiêu</label>
                  <Select value={filters.goal} onValueChange={(value) => handleFilterChange("goal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mục tiêu" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.goals.map(goal => (
                        <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kinh nghiệm giáo viên</label>
                  <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kinh nghiệm" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.teacherExperience.map(exp => (
                        <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Học phí</label>
                  <Select value={filters.price} onValueChange={(value) => handleFilterChange("price", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.priceRanges.map(price => (
                        <SelectItem key={price} value={price}>{price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Khung giờ</label>
                  <Select value={filters.timeSlot} onValueChange={(value) => handleFilterChange("timeSlot", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khung giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngôn ngữ</label>
                  <Select value={filters.language} onValueChange={(value) => handleFilterChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hình thức học</label>
                  <Select value={filters.format} onValueChange={(value) => handleFilterChange("format", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.formats.map(format => (
                        <SelectItem key={format} value={format}>{format}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Đánh giá</label>
                  <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.ratings.map(rating => (
                        <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({
                    subject: "",
                    level: "",
                    goal: "",
                    experience: "",
                    price: "",
                    timeSlot: "",
                    language: "",
                    format: "",
                    rating: ""
                  })}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Lớp học nhóm</h1>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm lớp học..."
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map(classItem => (
                <motion.div
                  key={classItem.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedClass(classItem)}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <img
                            src={classItem.teacher.avatar}
                            alt={classItem.teacher.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{classItem.teacher.name}</span>
                          <Badge variant="secondary">{classItem.teacher.rating} ⭐</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{classItem.schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{classItem.students.current}/{classItem.students.max} học viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{classItem.price.toLocaleString()} VNĐ</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Class Detail Dialog */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-3xl">
          {selectedClass && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedClass.name}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedClass.teacher.avatar}
                      alt={selectedClass.teacher.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedClass.teacher.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedClass.teacher.education} • {selectedClass.teacher.experience} kinh nghiệm
                      </p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Mô tả khóa học</h3>
                  <p className="text-muted-foreground">{selectedClass.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Thông tin lớp học</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedClass.schedule.days.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedClass.schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{selectedClass.students.current}/{selectedClass.students.max} học viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{selectedClass.price.toLocaleString()} VNĐ</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Thông tin bổ sung</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Trình độ: {selectedClass.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Mục tiêu: {selectedClass.goal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Ngôn ngữ: {selectedClass.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span>Hình thức: {selectedClass.format}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="lg" className="w-full md:w-auto">
                    Đăng ký lớp học
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupClassesPage; 