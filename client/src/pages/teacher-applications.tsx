import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useLocation } from "wouter";
import AdminTeacherApplications from "./admin/teacher-applications/index";

const StandaloneTeacherApplications = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || user.role !== "admin") {
    return null;
  }

  return <AdminTeacherApplications />;
};

export default StandaloneTeacherApplications; 