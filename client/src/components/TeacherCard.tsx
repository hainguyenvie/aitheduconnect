import React from 'react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarIcon } from 'lucide-react';

export type TeacherCardProps = {
  id: number;
  name: string;
  avatar: string | null;
  title: string;
  rating: number;
  ratingCount: number;
  hourlyRate: number;
  subjects: string[];
  education: string;
  experience: string;
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
  experience
}: TeacherCardProps) {
  
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
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar || undefined} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-xl">{name}</CardTitle>
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
          <div>
            <span className="font-semibold">Học vấn:</span> {education}
          </div>
          <div>
            <span className="font-semibold">Kinh nghiệm:</span> {experience}
          </div>
          <div className="mt-3 text-lg font-semibold text-primary">
            {hourlyRate.toLocaleString('vi-VN')} đ/giờ
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link href={`/teachers/${id}`}>
          <Button variant="outline">Xem hồ sơ</Button>
        </Link>
        <Link href={`/booking/${id}`}>
          <Button>Đặt lịch</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}