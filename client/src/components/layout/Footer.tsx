import { Link } from "wouter";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, Heart } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-white to-primary/5 pt-16 pb-6 text-gray-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Logo and description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 lg:col-span-1"
          >
            <div className="mb-4">
              <Logo size="small" />
            </div>
            <p className="text-gray-500 mb-4">
              Kết Nối Chuyên Gia, Khai Phá Tiềm Năng - Nền tảng kết nối học sinh và giáo viên 
              hàng đầu Việt Nam, mang đến trải nghiệm học tập hiệu quả.
            </p>
            <div className="flex space-x-3">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#4267B2" }}
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#E1306C" }}
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#1DA1F2" }}
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#FF0000" }}
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <Youtube size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Explore links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Khám phá</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/teachers" className="text-gray-500 hover:text-primary transition-colors">
                  Tìm kiếm giáo viên
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/courses" className="text-gray-500 hover:text-primary transition-colors">
                  Khóa học
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/subjects" className="text-gray-500 hover:text-primary transition-colors">
                  Môn học
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/blog" className="text-gray-500 hover:text-primary transition-colors">
                  Blog & Tài nguyên
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/teaching" className="text-gray-500 hover:text-primary transition-colors">
                  Trở thành giáo viên
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/help" className="text-gray-500 hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/faq" className="text-gray-500 hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/contact" className="text-gray-500 hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/feedback" className="text-gray-500 hover:text-primary transition-colors">
                  Gửi phản hồi
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link href="/report" className="text-gray-500 hover:text-primary transition-colors">
                  Báo cáo vấn đề
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="text-primary mr-2" />
                <a href="mailto:info@aitheduconnect.vn" className="text-gray-500 hover:text-primary transition-colors">
                  info@aitheduconnect.vn
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-primary mr-2" />
                <a href="tel:+84901234567" className="text-gray-500 hover:text-primary transition-colors">
                  +84 90 123 4567
                </a>
              </li>
              <li className="mt-4">
                <p className="text-gray-500">
                  Tòa nhà Innovation, 123 Nguyễn Huệ,<br/>
                  Quận 1, TP. Hồ Chí Minh
                </p>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} Aithedu Connect. Bảo lưu mọi quyền.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Điều khoản sử dụng
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Cookie
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-gray-400 flex items-center justify-center">
            <span>Phát triển với</span>
            <Heart size={12} className="mx-1 text-primary fill-primary" />
            <span>tại Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;