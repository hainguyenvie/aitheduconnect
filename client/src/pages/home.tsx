import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import FeaturedTeachers from '@/components/home/FeaturedTeachers';
import CategorySection from '@/components/home/CategorySection';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Aithedu Connect | Kết Nối Chuyên Gia, Khai Phá Tiềm Năng</title>
        <meta 
          name="description" 
          content="Aithedu Connect - Nền tảng kết nối học sinh và giáo viên hàng đầu Việt Nam, mang đến trải nghiệm học tập trực tuyến chất lượng cao và hiệu quả." 
        />
        <meta property="og:title" content="Aithedu Connect | Kết Nối Chuyên Gia, Khai Phá Tiềm Năng" />
        <meta property="og:description" content="Nền tảng kết nối học sinh và giáo viên hàng đầu Việt Nam, mang đến trải nghiệm học tập trực tuyến chất lượng cao." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aitheduconnect.vn" />
      </Helmet>
      
      <main>
        <HeroSection />
        {/* SOUL SECTION: Giáo viên nổi bật - make this stand out visually! */}
        <div style={{ marginTop: 40, marginBottom: 40 }}>
        <FeaturedTeachers />
        </div>
        <CategorySection />
        <FeaturedCourses />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
};

export default HomePage;