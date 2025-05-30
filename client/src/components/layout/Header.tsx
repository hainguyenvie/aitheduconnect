import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/ui/Logo";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthModal from "@/components/auth/AuthModal";
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { supabase } from '@/lib/supabaseClient';
import type { User } from "@/context/AuthContext";

const REQUIRED_PROFILE_FIELDS = [
  'fullName',
  'date_of_birth',
  'gender',
  'grade_level',
  'school_name',
  'province',
  'subjects',
  'free_time_slots',
];

function isProfileComplete(user: User | null): boolean {
  if (!user) return false;
  for (const field of REQUIRED_PROFILE_FIELDS) {
    if (Array.isArray(user[field as keyof User])) {
      if (!user[field as keyof User] || (user[field as keyof User] as any[]).length === 0) return false;
    } else {
      if (!user[field as keyof User]) return false;
    }
  }
  return true;
}

const Header = () => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout, forceRefetch } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Navigation items
  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/courses", label: "Khóa học" },
    { href: "/group-classes", label: "Lớp học nhóm" },
    { href: "/teachers", label: "Giáo viên" },
  ];

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSetOnboardingModalOpen = () => setIsOnboardingOpen(true);
    window.addEventListener('openOnboardingModal', handleSetOnboardingModalOpen);
    return () => window.removeEventListener('openOnboardingModal', handleSetOnboardingModalOpen);
  }, []);

  useEffect(() => {
    // Only check onboarding if authenticated
    const checkProfile = async () => {
      if (!isAuthenticated || !user) {
        setIsOnboardingOpen(false);
        return;
      }
      // Fetch latest profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error || !data) {
        setIsOnboardingOpen(true);
        return;
      }
      // Map data to user shape if needed
      const profile = {
        ...user,
        ...data,
        fullName: data.full_name || user.fullName,
      };
      setIsOnboardingOpen(!isProfileComplete(profile));
    };
    checkProfile();
  }, [isAuthenticated, user]);

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      }
    }
  };

  // Custom active indicator style - thinner and more elegant
  const activeIndicator = {
    initial: { width: 0 },
    animate: { 
      width: "100%", 
      transition: { duration: 0.3, ease: "easeInOut" } 
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.href} className="relative px-1">
                  <Link href={item.href}>
                    <div className={`px-3 py-2 rounded-md text-gray-700 hover:text-primary transition-colors relative`}>
                      {item.label}
                      {location === item.href && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-primary"
                          initial="initial"
                          animate="animate"
                          variants={activeIndicator}
                        />
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Auth Button / User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || ""} alt={user?.fullName || "User"} />
                        <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-medium">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={user?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}>
                        <a className="cursor-pointer w-full">Bảng điều khiển</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages">
                        <a className="cursor-pointer w-full">Tin nhắn</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={logout}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    size={isMobile ? "sm" : "default"} 
                    variant="default" 
                    className="rounded-full"
                  >
                    Đăng nhập
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <div className="ml-2 md:hidden">
                <Button variant="ghost" size="sm" onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <motion.div
        className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 md:hidden"
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="sm" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-4 py-3 mb-1 rounded-md ${
                    location === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4">
            {!isAuthenticated && (
              <Button 
                onClick={() => {
                  setIsAuthModalOpen(true);
                  closeMenu();
                }} 
                className="w-full"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {isAuthenticated && (
        <OnboardingModal
          user={user}
          open={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onProfileUpdated={forceRefetch}
        />
      )}
    </>
  );
};

export default Header;