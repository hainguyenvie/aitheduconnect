import { Helmet } from "react-helmet";
import AuthForm from "@/components/auth/AuthForm";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Đăng ký - AithEduConnect</title>
        <meta name="description" content="Đăng ký tài khoản AithEduConnect để bắt đầu hành trình học tập trực tuyến cùng những giáo viên chất lượng cao" />
      </Helmet>
      
      <AuthForm type="register" />
    </>
  );
};

export default Register;
