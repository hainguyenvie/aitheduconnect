import { Switch, Route } from "wouter";
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
import CreateCourse from "@/pages/dashboard/teacher/create-course";
import TeacherCourses from "@/pages/dashboard/teacher/courses";

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
      <Route path="/dashboard/teacher/courses/create" component={CreateCourse} />
      <Route path="/dashboard/teacher/courses" component={TeacherCourses} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [inClass, setInClass] = useState(false);
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
                {!inClass && <Header />}
                <div className={inClass ? '' : 'flex-grow pt-20 md:pt-20'}>
                  <Router />
                </div>
                {!inClass && <Footer />}
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
