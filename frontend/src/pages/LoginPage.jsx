import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        formData
      );
      console.log("Login successful:", response.data);
      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      if (error.response?.data?.message === "Something is missing, please check!") {
        toast.error("이메일과 비밀번호를 모두 입력해주세요.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.response?.data?.message === "Incorrect email or password") {
        toast.error("이메일 또는 비밀번호가 일치하지 않습니다.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("로그인 중 오류가 발생했습니다.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-lg p-12">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Ingstagram
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all text-base"
          >
            로그인
          </button>
        </form>

        <div className="my-6 flex items-center justify-center space-x-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-base text-gray-500 px-4">또는</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="mt-6 text-center border-gray-300">
          <p className="text-base text-gray-800">
            계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              가입하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
