"use client";
import React, { useState, useEffect } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";

const TaskHeader = ({ page_name }) => {
  const router = useRouter();
  const [menuicon, setMenuicon] = useState(page_name);
  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = () => {
    let user_id = localStorage.getItem("user_id");
    let user_type = localStorage.getItem("user_type");

    if (user_type == null && user_id == null) {
      router.push("/");
    }
  };

  return (
    <>
      <nav className=" py-4 px-1 flex items-center justify-between">
        <a onClick={() => router.back()} className="text-black cursor-pointer">
          <ArrowBackOutlinedIcon className="w-6 h-6" />
        </a>

        <a>
          <AddIcon />
        </a>
      </nav>
    </>
  );
};

export default TaskHeader;
