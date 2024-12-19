import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
  UserCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const ICON_SIZE = 28;
const ICON_STROKE_WIDTH = 2;

const MenuItems = [
  { icon: <Home size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Home" },
  { icon: <Search size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Search" },
  { icon: <TrendingUp size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Explore" },
  { icon: <MessageCircle size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Messages" },
  { icon: <Heart size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Notifications" },
  { icon: <PlusSquare size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Create" },
  { icon: <UserCircle size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Profile" },
  { icon: <LogOut size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />, text: "Logout" },
];

const Left = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (text) => {
    if (text === "Logout") {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/logout`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("로그아웃이 완료되었습니다.");
        navigate("/login");
      }
    } catch (error) {
      toast.warning(error.response.data.message);
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={ICON_SIZE} strokeWidth={2} />
      </button>

      <div
        className={`
        fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200
        p-5 transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="mt-5 mb-10 px-4">
          <h1 className="text-2xl font-extrabold">Ingstagram</h1>
        </div>

        <nav className="space-y-3">
          {MenuItems.map((item, index) => (
            <div
              onClick={() => handleMenuClick(item.text)}
              key={index}
              className="flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <span className="mr-5">{item.icon}</span>
              <span className="text-base font-bold">{item.text}</span>
            </div>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed  bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Left;
