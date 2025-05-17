import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị An",
    avatar: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
    rating: 5,
    comment: "Tôi đã hoàn thành khóa học IELTS với thầy Trần Văn Hùng và đạt được 7.5 Overall trong lần thi đầu tiên. Phương pháp giảng dạy rất hiệu quả và dễ hiểu.",
    course: "Luyện thi IELTS 7.0+"
  },
  {
    id: 2,
    name: "Lê Minh Tuấn",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
    rating: 4.5,
    comment: "Khóa học Python rất phù hợp với người mới bắt đầu như tôi. Thầy Phạm Minh Tuấn giải thích rất dễ hiểu và chia sẻ nhiều kinh nghiệm thực tế.",
    course: "Python cơ bản đến nâng cao"
  },
  {
    id: 3,
    name: "Trần Hạnh Nguyên",
    avatar: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
    rating: 5,
    comment: "Tôi rất thích cách cô Lê Thị Hương dạy piano. Cô rất kiên nhẫn và luôn tạo động lực cho học viên. Sau 3 tháng, tôi đã có thể chơi được nhiều bản nhạc đơn giản.",
    course: "Piano cơ bản"
  }
];

const TestimonialsSection = () => {
  // Helper function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-[#ffd60a] text-[#ffd60a]" />);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="text-[#ffd60a]" />
          <Star className="absolute top-0 left-0 fill-[#ffd60a] text-[#ffd60a] w-[50%] overflow-hidden" />
        </span>
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-[#ffd60a]" />);
    }

    return stars;
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Học viên nói gì về chúng tôi</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Trải nghiệm và phản hồi từ những học viên đã và đang học tập trên nền tảng EduViet
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-neutral-lightest rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={`Học viên ${testimonial.name}`} 
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <div className="flex text-[#ffd60a]">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <p className="text-neutral-dark">
                "{testimonial.comment}"
              </p>
              <div className="mt-4 text-neutral-medium text-sm">
                Khóa học: {testimonial.course}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
