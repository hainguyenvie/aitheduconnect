import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle, Video, MapPin, Award, Calendar, Book, Briefcase, MessageCircle, X } from "lucide-react";

// Social proof logos (demo)
const socialProof = [
  { name: "VTV", logo: "/logos/vtv.png" },
  { name: "Đại học Quốc gia Hà Nội", logo: "/logos/vnu.png" },
  { name: "VNExpress", logo: "/logos/vnexpress.png" },
];

const demoTeacher = {
  id: 1,
  fullName: "Nguyễn Thị Minh Châu",
  title: "Giảng viên Tiếng Việt cho người nước ngoài",
  avatar: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&w=400&h=400&fit=crop", // Realistic teacher image
  rating: 4.9,
  ratingCount: 312,
  hourlyRate: 350000,
  location: "Hà Nội, Việt Nam",
  subjects: ["Tiếng Việt cơ bản", "Tiếng Việt giao tiếp", "Tiếng Việt thương mại"],
  education: [
    {
      degree: "Thạc sĩ Ngôn ngữ học",
      school: "Đại học Quốc gia Hà Nội",
      year: "2018-2020"
    },
    {
      degree: "Cử nhân Sư phạm Tiếng Việt",
      school: "Đại học Sư phạm Hà Nội",
      year: "2014-2018"
    }
  ],
  experience: [
    {
      position: "Giảng viên Tiếng Việt",
      company: "Trung tâm Ngôn ngữ Quốc tế",
      duration: "2020 - Hiện tại",
      description: "Giảng dạy tiếng Việt cho người nước ngoài, phát triển giáo trình và tài liệu học tập."
    },
    {
      position: "Trợ giảng",
      company: "Đại học Quốc gia Hà Nội",
      duration: "2018 - 2020",
      description: "Hỗ trợ giảng dạy các khóa học tiếng Việt cho sinh viên quốc tế."
    }
  ],
  certifications: [
    { name: "Chứng chỉ giảng dạy tiếng Việt cho người nước ngoài", image: "/certs/vietnamese-teaching.png" },
    { name: "Chứng chỉ TESOL", image: "/certs/tesol.png" },
    { name: "Chứng chỉ tiếng Anh C1", image: "/certs/c1.png" }
  ],
  statistics: {
    totalStudents: 245,
    lessonsDelivered: 1200,
    yearsExperience: 6,
    topRated: true,
    mostBooked: true
  },
  isVerified: true,
  bio: "Tôi là giảng viên có hơn 6 năm kinh nghiệm giảng dạy tiếng Việt cho người nước ngoài. Tôi đam mê chia sẻ văn hóa và ngôn ngữ Việt Nam với học viên quốc tế. Phương pháp giảng dạy của tôi tập trung vào giao tiếp thực tế và trải nghiệm văn hóa.",
  introVideo: "https://www.youtube.com/embed/2e5q5b8KpLk", // Real Vietnamese teacher video
  teachingPhilosophy: "Tôi tin rằng mỗi học viên đều có thể thành công nếu được hướng dẫn đúng cách. Tôi luôn tạo môi trường học tập thân thiện, khuyến khích học viên thực hành và giao tiếp nhiều nhất có thể.",
  culturalActivities: ["Nấu ăn món Việt", "Tham quan di tích lịch sử", "Giao lưu văn hóa"],
  demoLesson: true,
  contactLink: "/chat/teacher/1",
  courses: [
    {
      id: 1,
      title: "Tiếng Việt cơ bản cho người mới bắt đầu",
      description: "Khóa học dành cho người mới bắt đầu, tập trung vào phát âm, từ vựng và giao tiếp cơ bản.",
      price: 1200000,
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&h=300&fit=crop",
      calendar: [
        { day: "Thứ 2", slots: ["08:00", "10:00"] },
        { day: "Thứ 4", slots: ["14:00", "16:00"] },
        { day: "Thứ 6", slots: ["09:00"] },
      ]
    },
    {
      id: 2,
      title: "Tiếng Việt giao tiếp nâng cao",
      description: "Phát triển kỹ năng giao tiếp thực tế, luyện nghe nói qua các tình huống đời sống.",
      price: 1500000,
      image: "https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&w=400&h=300&fit=crop",
      calendar: [
        { day: "Thứ 3", slots: ["09:00", "15:00"] },
        { day: "Thứ 5", slots: ["10:00", "16:00"] },
        { day: "Thứ 7", slots: ["17:00"] },
      ]
    }
  ],
  calendar: [
    { day: "Thứ 2", slots: ["08:00", "10:00", "14:00"] },
    { day: "Thứ 3", slots: ["09:00", "15:00"] },
    { day: "Thứ 4", slots: ["08:00", "13:00", "19:00"] },
    { day: "Thứ 5", slots: ["10:00", "16:00"] },
    { day: "Thứ 6", slots: ["08:00", "11:00", "20:00"] },
    { day: "Thứ 7", slots: ["09:00", "17:00"] },
    { day: "Chủ nhật", slots: [] },
  ],
  reviews: [
    {
      student: "Lê Thị B",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      date: "2024-05-01",
      comment: "Cô dạy rất dễ hiểu và nhiệt tình!"
    },
    {
      student: "Nguyễn Văn C",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 4,
      date: "2024-04-20",
      comment: "Bài học sinh động, nhiều ví dụ thực tế."
    },
    {
      student: "Ẩn danh",
      avatar: "",
      rating: 5,
      date: "2024-03-15",
      comment: "Giáo viên rất quan tâm đến tiến bộ của học viên."
    }
  ],
  faq: [
    {
      question: "Tôi có thể học thử không?",
      answer: "Có, bạn được học thử buổi đầu miễn phí để trải nghiệm phương pháp giảng dạy."
    },
    {
      question: "Lớp học có linh hoạt về thời gian không?",
      answer: "Bạn có thể chọn khung giờ phù hợp trong lịch trống của giáo viên."
    },
    {
      question: "Có hỗ trợ học viên ngoài giờ không?",
      answer: "Giáo viên luôn sẵn sàng hỗ trợ qua chat hoặc email ngoài giờ học."
    }
  ]
};

function renderStars(rating: number) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

const TeacherProfileView = () => {
  const [selectedCourse, setSelectedCourse] = useState<typeof demoTeacher.courses[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement | null>(null);

  const handleCourseClick = (course: typeof demoTeacher.courses[0]) => {
    setSelectedCourse(course);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setTimeout(() => {
      if (bookingSectionRef.current) {
        bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header & Stats */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={demoTeacher.avatar} alt={demoTeacher.fullName} />
              <AvatarFallback>{demoTeacher.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{demoTeacher.fullName}</h1>
                {demoTeacher.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                {demoTeacher.statistics.topRated && <Badge variant="outline" className="ml-2 text-green-700 border-green-400">Top Rated</Badge>}
                {demoTeacher.statistics.mostBooked && <Badge variant="outline" className="ml-2 text-pink-700 border-pink-400">Most Booked</Badge>}
              </div>
              <h2 className="text-lg text-gray-600">{demoTeacher.title}</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{demoTeacher.rating}</span>
                  <span className="text-gray-500">({demoTeacher.ratingCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{demoTeacher.statistics.totalStudents} học viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <Book className="h-5 w-5 text-gray-500" />
                  <span>{demoTeacher.statistics.lessonsDelivered} buổi học</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span>{demoTeacher.statistics.yearsExperience} năm kinh nghiệm</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{demoTeacher.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button variant="secondary" className="w-40" asChild>
                <a href={demoTeacher.contactLink}><MessageCircle className="mr-2 h-4 w-4" />Liên hệ giáo viên</a>
              </Button>
              {demoTeacher.demoLesson && <Badge variant="destructive">Học thử miễn phí!</Badge>}
              <div className="flex gap-2 mt-2">
                {socialProof.map((sp) => (
                  <img key={sp.name} src={sp.logo} alt={sp.name} className="h-8" title={sp.name} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Book className="h-5 w-5" />Khoá học của giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoTeacher.courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 hover:shadow-lg transition cursor-pointer" onClick={() => handleCourseClick(course)}>
                <img src={course.image} alt={course.title} className="h-32 w-full object-cover rounded mb-2" />
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold">{course.price.toLocaleString('vi-VN')} đ</span>
                  <Button size="sm" variant="outline">Xem lịch học</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Calendar Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setSelectedCourse(null)}><X /></button>
            <h2 className="text-xl font-bold mb-2">Lịch học cho: {selectedCourse.title}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-center mb-4">
                <thead>
                  <tr>
                    {selectedCourse.calendar.map((day: { day: string; slots: string[] }) => (
                      <th key={day.day} className="px-2 py-2 border-b bg-gray-50">{day.day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {selectedCourse.calendar.map((day: { day: string; slots: string[] }) => (
                      <td key={day.day} className="px-2 py-4 border-b">
                        {day.slots.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {day.slots.map((slot: string) => (
                              <Button key={slot} size="sm" variant="outline" className="w-full" onClick={() => handleSlotClick(slot)}>{slot} <span className="ml-2 text-xs text-primary">Đặt ngay</span></Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Không có lịch</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {selectedSlot && (
              <div className="text-center mt-4">
                <Badge variant="secondary">Đã chọn: {selectedSlot}</Badge>
                <Button className="ml-4" onClick={() => {
                  setSelectedCourse(null);
                  setTimeout(() => {
                    if (bookingSectionRef.current) bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>Chuyển đến đặt lịch</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Video giới thiệu</CardTitle>
          <CardDescription>Xem video để hiểu thêm về phong cách giảng dạy và cá tính của giáo viên.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src={demoTeacher.introVideo}
              title="Video giới thiệu giáo viên"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Section Anchor */}
      <div ref={bookingSectionRef}></div>

      {/* About, Philosophy, Cultural Activities, etc. (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-line">{demoTeacher.bio}</p>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Học vấn & Chứng chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoTeacher.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
                <div className="flex flex-wrap gap-4 mt-4">
                  {demoTeacher.certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img src={cert.image} alt={cert.name} className="h-14 w-14 object-contain rounded shadow" />
                      <span className="text-xs mt-1 text-center">{cert.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Kinh nghiệm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoTeacher.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-medium">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <p className="mt-2 text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teaching Philosophy & Cultural Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Book className="h-5 w-5" />Phương pháp & Hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <span className="font-semibold">Phương pháp giảng dạy:</span>
                <p className="text-gray-600 mt-1">{demoTeacher.teachingPhilosophy}</p>
              </div>
              <div>
                <span className="font-semibold">Hoạt động văn hóa:</span>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {demoTeacher.culturalActivities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Subjects, Reviews, FAQ */}
        <div className="space-y-6">
          {/* Subjects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Book className="h-5 w-5" />Chuyên môn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {demoTeacher.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />Đánh giá học viên</CardTitle>
              <CardDescription>
                {renderStars(
                  demoTeacher.reviews.reduce((sum, r) => sum + r.rating, 0) / demoTeacher.reviews.length
                )} ({demoTeacher.reviews.length} đánh giá)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoTeacher.reviews.map((review, idx) => (
                  <div key={idx} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                    <Avatar className="h-10 w-10">
                      {review.avatar ? (
                        <AvatarImage src={review.avatar} alt={review.student} />
                      ) : (
                        <AvatarFallback>{review.student.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.student}</span>
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" />Câu hỏi thường gặp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoTeacher.faq.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-primary">{item.question}</p>
                    <p className="text-gray-700 ml-2">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileView; 