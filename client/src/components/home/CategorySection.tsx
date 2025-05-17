import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { 
  Calculator, 
  Languages, 
  Code, 
  Music, 
  FlaskRound, 
  Palette 
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Toán học",
    icon: <Calculator className="text-primary text-xl" />,
    teacherCount: 120,
    path: "/teachers?category=mathematics"
  },
  {
    id: 2,
    name: "Ngoại ngữ",
    icon: <Languages className="text-primary text-xl" />,
    teacherCount: 256,
    path: "/teachers?category=languages"
  },
  {
    id: 3,
    name: "Lập trình",
    icon: <Code className="text-primary text-xl" />,
    teacherCount: 98,
    path: "/teachers?category=programming"
  },
  {
    id: 4,
    name: "Âm nhạc",
    icon: <Music className="text-primary text-xl" />,
    teacherCount: 75,
    path: "/teachers?category=music"
  },
  {
    id: 5,
    name: "Khoa học",
    icon: <FlaskRound className="text-primary text-xl" />,
    teacherCount: 110,
    path: "/teachers?category=science"
  },
  {
    id: 6,
    name: "Nghệ thuật",
    icon: <Palette className="text-primary text-xl" />,
    teacherCount: 64,
    path: "/teachers?category=art"
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Khám phá các lĩnh vực</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Tìm kiếm giáo viên trong các lĩnh vực học tập đa dạng phù hợp với nhu cầu của bạn
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.path}>
              <a className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-neutral-dark mt-1">{category.teacherCount} giáo viên</p>
              </a>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/teachers">
            <a className="inline-flex items-center text-primary font-medium hover:underline">
              Xem tất cả các lĩnh vực
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
