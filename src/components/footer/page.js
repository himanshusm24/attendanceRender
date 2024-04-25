"use client";
import React, { useState } from "react";
import {
  HomeOutlined as HomeIcon,
  DateRangeOutlined as DateRangeIcon,
  SettingsOutlined as SettingsIcon,
  CalendarMonthOutlined as CalendarMonthIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonitorIcon from "@mui/icons-material/Monitor";
import { useRouter } from "next/navigation";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import { BiCategory } from "react-icons/bi";
import TourIcon from "@mui/icons-material/Tour";

const Footer = () => {
  const router = useRouter();

  const [activeIcon, setActiveIcon] = useState("home");

  const handleIconClick = (page) => {
    setActiveIcon(page);

    if (page === "profile") {
      router.push("/my-profile");
    } else if (page === "view-log") {
      router.push("/view-log");
    } else if (page === "calendar") {
      router.push("/calendar");
    } else if (page === "leave") {
      router.push("/leave");
    } else if (page == "visits") {
      router.push("/visits");
    }
  };

  return (
    <>
      <div className="bg-white p-3 h-14 flex items-center justify-around mt-auto rounded-md shadow-md footer-menu">
        <div
          className={`flex flex-col items-center text-gray-500 cursor-pointer ${
            activeIcon === "home" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("home")}
        >
          <HomeIcon style={{ fontSize: "24px" }} />

          <p className="mt-1 text-sm">Home</p>
        </div>

        <div
          className={`flex flex-col items-center ml-2 text-gray-500 cursor-pointer ${
            activeIcon === "calendar" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("calendar")}
        >
          <CalendarMonthIcon style={{ fontSize: "24px" }} />

          <p className="mt-1 text-sm">Calendar</p>
        </div>

        {/* <div
          className={`flex flex-col items-center ml-2 text-gray-500 cursor-pointer ${
            activeIcon === "leave" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("leave")}
        >
          <LocalHotelIcon />
          <p className="mt-1 text-sm">Leave</p>
        </div> */}
        <div
          className={`flex flex-col items-center ml-2 text-gray-500 cursor-pointer ${
            activeIcon === "leave" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("visits")}
        >
          <TourIcon />
          <p className="mt-1 text-sm">Visits</p>
        </div>

        <div
          className={`flex flex-col items-center ml-2 text-gray-500 cursor-pointer ${
            activeIcon === "log" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("view-log")}
        >
          <MonitorIcon style={{ fontSize: "24px" }} />

          <p className="mt-1 text-sm">Daily Log</p>
        </div>

        <div
          className={`flex flex-col items-center ml-4 text-gray-500 cursor-pointer ${
            activeIcon === "profile" && "text-yellow-500"
          }`}
          onClick={() => handleIconClick("profile")}
        >
          <AccountCircleIcon style={{ fontSize: "24px" }} />

          <p className="mt-1 text-sm">Profile</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
