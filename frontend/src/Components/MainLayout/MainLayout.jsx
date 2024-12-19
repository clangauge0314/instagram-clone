import React from "react";
import { Outlet } from "react-router-dom";
import Left from "../Sidebar/Left";

const MainLayout = () => {
  return (
    <div>
      <Left />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
