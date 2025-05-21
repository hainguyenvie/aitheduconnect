import React, { useState, useRef } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle, Video, MapPin, Award, Calendar, Book, Briefcase, MessageCircle, X } from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// Social proof logos (demo)
const socialProof = [
  { name: "VTV", logo: "/logos/vtv.png" },
  { name: "Đại học Quốc gia Hà Nội", logo: "/logos/vnu.png" },
  { name: "VNExpress", logo: "/logos/vnexpress.png" },
];

function renderStars(rating: number) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{rating?.toFixed(1) ?? '0.0'}</span>
    </div>
  );
}

const TeacherProfileView = () => {
  const { id } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement | null>(null);

  const { data: teacher, isLoading, isError } = useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleCourseClick = (course: any) => {
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

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teacher) return <div>Error loading teacher</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header & Stats */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={teacher.avatar || undefined} alt={teacher.full_name || 'Avatar'} />
              <AvatarFallback>{teacher.full_name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                  {teacher.full_name || 'Chưa cập nhật'}
                  {teacher.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </h1>
                {teacher.statistics?.topRated && <Badge variant="outline" className="ml-2 text-green-700 border-green-400">Top Rated</Badge>}
                {teacher.statistics?.mostBooked && <Badge variant="outline" className="ml-2 text-pink-700 border-pink-400">Most Booked</Badge>}
              </div>
              {teacher.title && (
                <div className="text-lg text-gray-600 font-medium">{teacher.title}</div>
              )}
              {(teacher.subjects && teacher.subjects.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.subjects.map((s: string, i: number) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </div>
              )}
              {(teacher.rating || teacher.ratingCount) && (
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{teacher.rating?.toFixed(1) ?? '0.0'}</span>
                  <span className="text-gray-500">({teacher.ratingCount ?? 0} đánh giá)</span>
                </div>
              )}
              {teacher.location && (
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{teacher.location}</span>
                </div>
              )}
              {teacher.statistics?.yearsExperience && (
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span>{teacher.statistics.yearsExperience} năm kinh nghiệm</span>
                </div>
              )}
              {(teacher.statistics?.totalStudents || teacher.statistics?.lessonsDelivered) && (
                <div className="flex items-center gap-2 mt-1">
                  {teacher.statistics?.totalStudents && <><Users className="h-5 w-5 text-gray-500" /><span>{teacher.statistics.totalStudents} học viên</span></>}
                  {teacher.statistics?.lessonsDelivered && <><Book className="h-5 w-5 text-gray-500 ml-2" /><span>{teacher.statistics.lessonsDelivered} buổi học</span></>}
                </div>
              )}
              {teacher.bio && (
                <div className="mt-2 text-gray-700 italic bg-gray-50 rounded p-2">{teacher.bio}</div>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center">
              {teacher.contactLink && (
                <Button variant="secondary" className="w-40" asChild>
                  <a href={teacher.contactLink}><MessageCircle className="mr-2 h-4 w-4" />Liên hệ giáo viên</a>
                </Button>
              )}
              {teacher.demoLesson && <Badge variant="destructive">Học thử miễn phí!</Badge>}
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
            {(teacher.courses || []).map((course: any) => (
              <div key={course.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 hover:shadow-lg transition cursor-pointer" onClick={() => handleCourseClick(course)}>
                <img src={course.image} alt={course.title} className="h-32 w-full object-cover rounded mb-2" />
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold">{course.price?.toLocaleString('vi-VN')} đ</span>
                  <Button size="sm" variant="outline">Xem lịch học</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              src={teacher.introVideo}
              title="Video giới thiệu giáo viên"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Section Anchor */}
      <div ref={bookingSectionRef}></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-line">{teacher.bio}</p>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Học vấn & Chứng chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(teacher.education || []).map((edu: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
                <div className="flex flex-wrap gap-4 mt-4">
                  {(teacher.certifications || []).map((cert: any, idx: number) => (
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
                {(teacher.experience || []).map((exp: any, index: number) => (
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
                <p className="text-gray-600 mt-1">{teacher.teachingPhilosophy}</p>
              </div>
              <div>
                <span className="font-semibold">Hoạt động văn hóa:</span>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {(teacher.culturalActivities || []).map((act: string, idx: number) => (
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
                {(teacher.subjects || []).map((subject: string, index: number) => (
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
                  (teacher.reviews || []).reduce((sum: number, r: any) => sum + r.rating, 0) / ((teacher.reviews || []).length || 1)
                )} ({(teacher.reviews || []).length} đánh giá)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(teacher.reviews || []).map((review: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
                    <Avatar className="h-10 w-10">
                      {review.avatar ? (
                        <AvatarImage src={review.avatar} alt={review.student} />
                      ) : (
                        <AvatarFallback>{review.student?.charAt(0)}</AvatarFallback>
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
                {(teacher.faq || []).map((item: any, idx: number) => (
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