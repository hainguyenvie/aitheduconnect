import React, { useState } from 'react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarIcon, GraduationCap, Briefcase, DollarSign, Users, CheckCircle, Award, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type TeacherCardProps = {
  id: number | string;
  name: string;
  avatar: string | null;
  title: string;
  rating: number;
  ratingCount: number;
  hourlyRate: number;
  subjects: string[];
  education: string;
  experience: string;
  is_verified?: boolean;
  total_students?: number;
  bio?: string;
  featured?: boolean;
};

export function TeacherCard({
  id,
  name,
  avatar,
  title,
  rating,
  ratingCount,
  hourlyRate,
  subjects,
  education,
  experience,
  is_verified,
  total_students,
  bio,
  featured
}: TeacherCardProps) {
  const [showProfile, setShowProfile] = useState(false);

  // Hiển thị sao đánh giá
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 
                i < rating ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)} ({ratingCount})
        </span>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full relative bg-gradient-to-br from-pink-50 via-white to-blue-50 hover:scale-[1.025] hover:shadow-xl transition-all duration-200 overflow-hidden">
        {/* Featured Ribbon */}
        {featured && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-3 py-1 text-xs font-bold rounded-br-lg z-10">
            Nổi bật
          </div>
        )}
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16 ring-2 ring-primary">
            <AvatarImage src={avatar || undefined} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl flex items-center gap-2">
                {name}
                {is_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
                {rating >= 4.7 && <Award className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
            </div>
            <CardDescription className="text-base font-medium">{title}</CardDescription>
            {renderStars(rating)}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1 my-2">
            {subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                {subject}
              </Badge>
            ))}
          </div>
          <div className="space-y-2 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">Học vấn:</span> {education}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-600" />
              <span className="font-semibold">Kinh nghiệm:</span> {experience}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold">Học phí:</span> <span className="text-lg font-semibold text-primary">{hourlyRate.toLocaleString('vi-VN')} đ/giờ</span>
            </div>
            {typeof total_students === 'number' && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="font-semibold">Học viên:</span> {total_students}+
              </div>
            )}
            {bio && (
              <div className="italic text-gray-600 mt-2">"{bio.length > 80 ? bio.slice(0, 80) + '...' : bio}"</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowProfile(true)}
          >
            Xem hồ sơ
          </Button>
          <Link href={`/booking/${id}`}>
            <Button className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:from-pink-600 hover:to-yellow-500 scale-105 transition-transform duration-200">
              Đặt lịch ngay
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl flex items-center gap-2">
                {name}
                {is_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
                {rating >= 4.7 && <Award className="h-5 w-5 text-yellow-500" />}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Left Column - Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24 ring-2 ring-primary">
                  <AvatarImage src={avatar || undefined} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-600">{title}</h3>
                  {renderStars(rating)}
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {bio && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Giới thiệu</h4>
                  <p className="text-gray-600">{bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">Học vấn:</span>
                  </div>
                  <p className="text-gray-600 ml-6">{education}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold">Kinh nghiệm:</span>
                  </div>
                  <p className="text-gray-600 ml-6">{experience}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin học phí</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xl font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {hourlyRate.toLocaleString('vi-VN')} đ/giờ
                  </div>
                </CardContent>
              </Card>

              {typeof total_students === 'number' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thống kê</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">{total_students}+ học viên</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col gap-2">
                <Link href={`/teachers/${id}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Xem hồ sơ chi tiết
                  </Button>
                </Link>
                <Link href={`/booking/${id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold hover:from-pink-600 hover:to-yellow-500">
                    Đặt lịch ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}