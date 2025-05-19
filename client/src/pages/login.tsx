import { Helmet } from "react-helmet";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Đăng nhập - AithEduConnect</title>
        <meta name="description" content="Đăng nhập vào tài khoản AithEduConnect của bạn để truy cập vào nền tảng học tập trực tuyến" />
      </Helmet>
      
      <AuthForm type="login" />
    </>
  );
};

export default Login;
