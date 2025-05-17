import { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatInterface from "@/components/chat/ChatInterface";

const MessagesPage = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login?redirect=messages");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the effect above
  }

  return (
    <>
      <Helmet>
        <title>Tin nhắn | EduViet</title>
        <meta name="description" content="Kênh liên lạc với giáo viên/học viên của bạn trên nền tảng EduViet" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-2">Tin nhắn</h1>
            <p className="text-neutral-dark mb-6">
              {user?.role === "teacher" 
                ? "Liên lạc với học viên của bạn" 
                : "Liên lạc với giáo viên của bạn"}
            </p>
            
            <ChatInterface teacherMode={user?.role === "teacher"} />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MessagesPage;