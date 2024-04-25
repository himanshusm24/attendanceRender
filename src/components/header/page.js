"use client";
import React, { useState, useEffect } from "react";
import {
  Menu as HamburgerIcon,
  Notifications as BellIcon,
} from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/navigation";
import {
  HomeOutlined as HomeIcon,
  DateRangeOutlined as DateRangeIcon,
  SettingsOutlined as SettingsIcon,
  CalendarMonthOutlined as CalendarMonthIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonitorIcon from "@mui/icons-material/Monitor";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = ({ page_name }) => {
  const router = useRouter();
  const [menuicon, setMenuicon] = useState(page_name);
  // const [sidebar, setSidebar] = useState("");
  // console.log('sidebar: ', sidebar);

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_contact");
    localStorage.removeItem("user_company_name");
    localStorage.removeItem("companyId");
    localStorage.removeItem("user_department_Id");
    localStorage.removeItem("user_role_Id");
    localStorage.removeItem("mobtaskSidebar");
    router.push("/");
  };

  const [taskSidebar, setTaskSidebar] = useState(true);
  const [attendanceSidebar, setAttendanceSidebar] = useState(false);

  useEffect(() => {
    const storedTaskSidebar = localStorage.getItem("mobtaskSidebar");
    const storedAttendanceSidebar = localStorage.getItem(
      "mobattendanceSidebar"
    );

    if (storedTaskSidebar === "true") {
      setTaskSidebar(true);
      setAttendanceSidebar(false);
    } else if (storedAttendanceSidebar === "true") {
      setTaskSidebar(false);
      setAttendanceSidebar(true);
    }
  }, []);

  const showTaskSidebar = () => {
    setTaskSidebar(true);
    setAttendanceSidebar(false);
    localStorage.setItem("mobtaskSidebar", "true");
    localStorage.setItem("mobattendanceSidebar", "false");
    router.push("/projects");
  };

  const showAttendanceSidebar = () => {
    setTaskSidebar(false);
    setAttendanceSidebar(true);
    localStorage.setItem("mobtaskSidebar", "false");
    localStorage.setItem("mobattendanceSidebar", "true");
    router.push("/home");
  };

  return (
    <>
      <nav className="bg-[#188389] p-4 flex items-center justify-between">
        <h1
          className={`text-white text-lg font-semibold ${
            menuicon != "home" ? "company-heading" : ""
          }`}
        >
          <img
            src="/img/7oclock-logo-white-new.png"
            style={{ width: "160px" }}
            alt="Image"
          />
        </h1>

        {menuicon == "home" ? (
          <>
            <div className=" curson-pointer">
              <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
              />

              <div className="drawer-content">
                <label htmlFor="my-drawer-4" className="drawer-button">
                  <HamburgerIcon className="w-5 h-6 text-white" />
                </label>
              </div>

              {attendanceSidebar == true ? (
                <>
                  <div className="drawer-side" style={{ zIndex: 1 }}>
                    <label
                      htmlFor="my-drawer-4"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>

                    <ul className="menu w-80 min-h-full bg-base-200 text-base-content p-0">
                      <div className="bg-[#188389] items-center p-4">
                        <h1
                          className={`text-white text-lg font-semibold ${
                            menuicon != "home" ? "company-heading" : ""
                          }`}
                        >
                          <img
                            src="/img/7oclock-logo-white-new.png"
                            style={{ width: "160px" }}
                            alt="Image"
                          />
                        </h1>
                      </div>

                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/home">
                          <HomeIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          Home
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <button
                          className="text-lg"
                          onClick={() => showTaskSidebar()}
                        >
                          <HomeIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          Task
                        </button>
                      </li>

                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/calendar">
                          <CalendarMonthIcon className="inline-block w-6 h-6 mr-2" />
                          Calendar
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/visits">
                          <LocalHotelIcon className="inline-block w-6 h-6 mr-2" />
                          Visits
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/leave">
                          <LocalHotelIcon className="inline-block w-6 h-6 mr-2" />
                          Leave
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/view-log">
                          <MonitorIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          View Log
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/my-profile">
                          <AccountCircleIcon className="inline-block w-6 h-6 mr-2" />
                          Profile
                        </Link>
                      </li>
                      <div
                        className="rounded-md py-4 flex items-center"
                        onClick={logout}
                      >
                        <LogoutIcon className="ml-4" />
                        <div className="ml-4 text-lg">Logout</div>
                      </div>
                      <span
                        className="pt-3 font-bold text-2xl"
                        style={{
                          textAlign: "left",
                          marginLeft: "18px",
                          fontSize: "x-large",
                        }}
                      >
                        Help
                      </span>
                      <li className="py-3 hover:bg-[#188389]">
                        <h5 className="text-lg">
                          <EmailIcon className="inline-block w-6 h-6" />
                          hr@secondmedic.com
                        </h5>
                      </li>
                      <li className="py-3 hover:bg-[#188389]">
                        <h5 className="text-lg">
                          <PhoneIcon className="inline-block w-6 h-6" />
                          +91 9876542211
                        </h5>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                ""
              )}

              {taskSidebar == true ? (
                <>
                  <div className="drawer-side" style={{ zIndex: 1 }}>
                    <label
                      htmlFor="my-drawer-4"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>

                    <ul className="menu w-80 min-h-full bg-base-200 text-base-content p-0">
                      <div className="bg-[#188389] items-center p-4">
                        <h1
                          className={`text-white text-lg font-semibold ${
                            menuicon != "home" ? "company-heading" : ""
                          }`}
                        >
                          <img
                            src="/img/7oclock-logo-white-new.png"
                            style={{ width: "160px" }}
                            alt="Image"
                          />
                        </h1>
                      </div>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/task">
                          <HomeIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          Task
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <Link className="text-lg" href="/projects">
                          <HomeIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          Projects
                        </Link>
                      </li>
                      <li className="py-3 border hover:bg-[#188389]">
                        <button
                          className="text-lg"
                          onClick={() => showAttendanceSidebar()}
                        >
                          <HomeIcon className="inline-block w-6 h-6 mr-2" />{" "}
                          Attendance
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          <>
            {page_name == "visit" ? (
              <a
                onClick={() => router.push("/home")}
                className="text-white cursor-pointer"
              >
                <ArrowBackOutlinedIcon className="w-6 h-6" />
              </a>
            ) : (
              <a
                onClick={() => router.back()}
                className="text-white cursor-pointer"
              >
                <ArrowBackOutlinedIcon className="w-6 h-6" />
              </a>
            )}
          </>
        )}
      </nav>
    </>
  );
};

export default Header;
