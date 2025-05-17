import { Helmet } from "react-helmet";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Đăng nhập - EduViet</title>
        <meta name="description" content="Đăng nhập vào tài khoản EduViet của bạn để truy cập vào nền tảng học tập trực tuyến" />
      </Helmet>
      
      <AuthForm type="login" />
    </>
  );
};

export default Login;
