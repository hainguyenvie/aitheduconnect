import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createContext, useContext, useState } from 'react';

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import TeachersIndex from "@/pages/teachers/index";
import TeacherDetail from "@/pages/teachers/[id]";
import CoursesIndex from "@/pages/courses/index";
import CourseDetail from "@/pages/courses/[id]";
import StudentDashboard from "@/pages/dashboard/student";
import TeacherDashboard from "@/pages/dashboard/teacher";
import Messages from "@/pages/messages";
import ClassroomPage from "@/pages/classroom/[id]";
import TestClassroomPage from "@/pages/classroom/test";
import TeacherApplication from "@/pages/teacher-application";
import TeacherApplicationReview from "@/pages/admin/teacher-applications";
import TeacherApplicationDetail from "@/pages/admin/teacher-applications/[id]";
import NotFound from "@/pages/not-found";
import GroupClassesPage from "@/pages/group-classes";
import TeachersPage from "@/pages/teachers";
import StandaloneTeacherApplications from "@/pages/teacher-applications";
import TeacherApplicationsAdmin from "@/pages/teacher-applications-admin";
import AuthCallback from "@/pages/auth/callback";
import TestEmail from "@/pages/test-email";
import ParentLinkConfirm from "@/pages/parent-link-confirm";

// Classroom UI Context
const ClassroomUIContext = createContext({ inClass: false, setInClass: (v: boolean) => {} });
export const useClassroomUI = () => useContext(ClassroomUIContext);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/teachers" component={TeachersIndex} />
      <Route path="/teachers/:id" component={TeacherDetail} />
      <Route path="/courses" component={CoursesIndex} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/dashboard/student" component={StudentDashboard} />
      <Route path="/dashboard/teacher" component={TeacherDashboard} />
      <Route path="/messages" component={Messages} />
      <Route path="/dashboard/classroom" component={TestClassroomPage} />
      <Route path="/classroom/:id" component={ClassroomPage} />
      <Route path="/teacher-application" component={TeacherApplication} />
      <Route path="/admin/teacher-applications" component={TeacherApplicationReview} />
      <Route path="/admin/teacher-applications/:id" component={TeacherApplicationDetail} />
      <Route path="/group-classes" component={GroupClassesPage} />
      <Route path="/teachers" component={TeachersPage} />
      <Route path="/teacher-applications" component={StandaloneTeacherApplications} />
      <Route path="/teacher-applications-admin" component={TeacherApplicationsAdmin} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/test-email" component={TestEmail} />
      <Route path="/parent-link/confirm" component={ParentLinkConfirm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [inClass, setInClass] = useState(false);
  const [location] = useLocation();
  const hideLayout = location === "/teacher-applications-admin";
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            {/* Global style to hide any header if inClass */}
            {inClass && (
              <style>{`
                header, .fixed-header, [role="banner"], .Header, .header, .main-header {
                  display: none !important;
                }
              `}</style>
            )}
            <ClassroomUIContext.Provider value={{ inClass, setInClass }}>
              <div className={`min-h-screen flex flex-col${inClass ? ' hide-header' : ''}`}>
                {!inClass && !hideLayout && <Header />}
                <div className={inClass || hideLayout ? '' : 'flex-grow pt-20 md:pt-20'}>
                  <Router />
                </div>
                {!inClass && !hideLayout && <Footer />}
                <Toaster />
              </div>
            </ClassroomUIContext.Provider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
