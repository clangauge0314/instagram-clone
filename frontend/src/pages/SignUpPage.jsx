import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, formData);
      console.log("Sign up successful:", response.data);
      toast.success("회원가입이 완료되었습니다!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Sign up failed:", error.response?.data || error.message);
      if (error.response?.data?.message === "Something is missing, please check!") {
        toast.error("모든 필드를 입력해주세요.", {
          position: "top-right", 
          autoClose: 3000,
        });
      } else if (error.response?.data?.message === "Try different email") {
        toast.error("이미 사용중인 이메일입니다.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.response?.data?.message === "Try different username") {
        toast.error("이미 사용중인 사용자 이름입니다.", {
          position: "top-right",
          autoClose: 3000, 
        });
      } else if (error.response?.data?.message === "Server error during registration") {
        toast.error("서버 오류가 발생했습니다.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("회원가입 중 오류가 발생했습니다.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-lg p-12">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Ingstagram
        </h1>
        <p className="text-gray-500 text-center text-base mb-6">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </p>

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
            type="text"
            name="fullName"
            placeholder="성명"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="사용자 이름"
            value={formData.username}
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
            가입
          </button>
        </form>
        <p className="text-gray-500 text-base text-center mt-6">
          가입하면 Ingstagram의 <span className="font-semibold">약관</span>, <span className="font-semibold">데이터 정책</span> 및{" "}
          <span className="font-semibold">쿠키 정책</span>에 동의하게 됩니다.
        </p>

        <div className="my-6 flex items-center justify-center space-x-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-base text-gray-500 px-4">또는</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="mt-6 text-center border-gray-300">
          <p className="text-base text-gray-800">
            계정이 있으신가요?{" "}
            <a href="/login" className="text-blue-500 font-semibold hover:text-blue-600">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;