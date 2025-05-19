import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().optional(),
  hasFreeTrial: z.boolean().optional(),
  availability: z.string().optional(),
});

type TeacherSearchFilterProps = {
  onFilterChange: (filters: z.infer<typeof formSchema>) => void;
};

export function TeacherSearchFilter({ onFilterChange }: TeacherSearchFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      category: 'all',
      rating: 0,
      priceMin: 0,
      priceMax: 1000000,
      hasFreeTrial: false,
      availability: 'all',
    },
  });

  // Danh sách môn học
  const categories = [
    { value: 'mathematics', label: 'Toán học' },
    { value: 'languages', label: 'Ngoại ngữ' },
    { value: 'programming', label: 'Lập trình' },
    { value: 'music', label: 'Âm nhạc' },
    { value: 'science', label: 'Khoa học' },
    { value: 'art', label: 'Nghệ thuật' },
  ];

  // Tùy chọn về thời gian
  const availabilityOptions = [
    { value: 'morning', label: 'Buổi sáng' },
    { value: 'afternoon', label: 'Buổi chiều' },
    { value: 'evening', label: 'Buổi tối' },
    { value: 'weekend', label: 'Cuối tuần' },
  ];

  // Đánh giá sao
  const ratingOptions = [
    { value: '0', label: 'Tất cả' },
    { value: '3', label: '3+ sao' },
    { value: '4', label: '4+ sao' },
    { value: '4.5', label: '4.5+ sao' },
  ];

  // Xử lý khi form thay đổi
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilterChange({
      ...values,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-primary">Tìm kiếm giáo viên</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Thanh tìm kiếm */}
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tìm kiếm</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Tên giáo viên, môn học, kỹ năng..." 
                    {...field} 
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Bộ lọc môn học */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Môn học</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn học</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {/* Bộ lọc đánh giá */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đánh giá</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseFloat(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đánh giá" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {/* Khoảng giá */}
          <div className="space-y-2">
            <Label>Khoảng giá (VND)</Label>
            <div className="pt-4">
              <Slider
                defaultValue={[0, 1000000]}
                max={1000000}
                step={10000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{priceRange[0].toLocaleString('vi-VN')} đ</span>
              <span>{priceRange[1].toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          
          {/* Có buổi học thử */}
          <FormField
            control={form.control}
            name="hasFreeTrial"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Có buổi học thử miễn phí
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {/* Thời gian có sẵn */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian có sẵn</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">Bất kỳ thời gian nào</SelectItem>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">Tìm kiếm</Button>
        </form>
      </Form>
    </div>
  );
}