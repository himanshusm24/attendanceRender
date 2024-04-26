/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Wallet, Newspaper } from "lucide-react";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaBars,
  FaChartBar,
  FaRegFileAlt,
  FaRegUser,
  FaRegCalendarCheck,
  FaRegBuilding,
} from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { GrUserSettings } from "react-icons/gr";
import { BsBuildingGear } from "react-icons/bs";
import { LuMailPlus } from "react-icons/lu";

const AttendanceSidebar = ({ sidemenu, clickEvent }) => {
  const router = useRouter();
  const [opensideMenu, setOpenSideMenu] = useState(sidemenu);

  useEffect(() => {
    setOpenSideMenu(sidemenu);
  }, [sidemenu]);

  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (href) => {
    setActiveLink(href);
    localStorage.setItem("clickedsidebar", href);
  };

  useEffect(() => {
    const data = localStorage.getItem("clickedsidebar");
    setActiveLink(data);
  }, []);

  return (
    <aside
      className={`flex h-screen w-64 flex-col border-r mt-[-32px] ml-[-20px] px-5 py-8 fixed admin-sidebar ${opensideMenu}`}
    >
      <a href="/admin/dashboard">
        <img src="/img/7oclock-logo.png" className="logo" alt="Image" />
      </a>

      <button
        className="sidebar-main-btns"
        onClick={() => {
          localStorage.removeItem("sidebar");
          clickEvent(true);
        }}
      >
        <FaBars />
        Main menu
      </button>

      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav>
          <label className="sidebar-h">Admin Dashboard</label>
          {/* <Link href={"/admin/dashboard"} className="nav-item active"> */}
          <Link
            href={"/admin/dashboard"}
            as={"/admin/dashboard"}
            className={
              activeLink === "/admin/dashboard" ? "nav-item active" : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/dashboard")}
          >
            <FaChartBar />
            <span>Dashboard</span>
          </Link>
          <Link
            href={"/admin/basic-details"}
            as={"/admin/basic-details"}
            className={
              activeLink === "/admin/basic-details"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/basic-details")}
          >
            <FaRegFileAlt />
            <span>Basic Details</span>
          </Link>
          <Link
            href={"/admin/manage-attendance"}
            // className="nav-item"
            as={"/admin/manage-attendance"}
            className={
              activeLink === "/admin/manage-attendance"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-attendance")}
          >
            <FiUsers />
            <span>Manage Attendance</span>
          </Link>
          <Link
            href={"/admin/manage-company"}
            // className="nav-item "
            className={
              activeLink === "/admin/manage-company"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-company")}
          >
            <FaRegBuilding />
            <span>Manage Branch</span>
          </Link>
          <Link
            href={"/admin/manage-users"}
            // className="nav-item"
            className={
              activeLink === "/admin/manage-users"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-users")}
          >
            <FaRegUser />
            <span>Manage Employee</span>
          </Link>
          <Link
            href={"/admin/manage-holiday"}
            // className="nav-item"
            className={
              activeLink === "/admin/manage-holiday"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-holiday")}
          >
            <FaRegCalendarCheck />
            <span>Manage Holiday</span>
          </Link>
          <Link
            href={"/admin/manage-roles"}
            // className="nav-item"
            className={
              activeLink === "/admin/manage-roles"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-roles")}
          >
            <GrUserSettings />
            <span>Manage Roles</span>
          </Link>
          <Link
            href={"/admin/manage-department"}
            // className="nav-item"
            className={
              activeLink === "/admin/manage-department"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-department")}
          >
            <BsBuildingGear />
            <span>Manage Department</span>
          </Link>
          <Link
            href={"/admin/manage-default-mails"}
            // className="nav-item"
            className={
              activeLink === "/admin/manage-default-mails"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => handleLinkClick("/admin/manage-default-mails")}
          >
            <LuMailPlus />
            <span>Manage Default Mails</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default AttendanceSidebar;
