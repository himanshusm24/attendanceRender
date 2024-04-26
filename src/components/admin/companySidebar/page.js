/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Wallet, Newspaper } from "lucide-react";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CompanySidebar = ({ sidemenu }) => {
  const router = useRouter();
  const [opensideMenu, setOpenSideMenu] = useState(sidemenu);

  useEffect(() => {
    setOpenSideMenu(sidemenu);
  }, [sidemenu]);

  return (
    <aside
      className={`flex h-screen w-64 flex-col overflow-y-auto border-r bg-black px-5 py-8 fixed admin-sidebar ${opensideMenu}`}
    >
      <a>
        {/* <img src='/img/logo-white.png' alt='Image' /> */}
        <img
          src="/img/7oclock-logo-white-new.png"
          style={{ width: "160px" }}
          alt="Image"
        />
      </a>
      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            <label className="px-3 text-xs font-semibold uppercase text-white">
              Admin Dashboard
            </label>

            <Link
              href={"/branch/dashboard"}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700 py-3"
            >
              <BarChart className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Dashboard</span>
            </Link>

            <Link
              href={"/branch/manage-attendance"}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700 py-3"
            >
              <BarChart className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">
                Manage Attendance
              </span>
            </Link>
            {/* 
                        <Link href={"/branch/manage-company"} className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 py-3">
                            <Wallet className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2 text-sm font-medium">Manage Company</span>
                        </Link> */}

            <Link
              href={"/branch/manage-users"}s
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 py-3"
            >
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Manage Employee</span>
            </Link>

            <Link
              href={"/branch/manage-holiday"}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 py-3"
            >
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Manage Holiday</span>
            </Link>
            <Link
              href={"/branch/manage-roles"}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 py-3"
            >
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Manage Roles</span>
            </Link>
            <Link
              href={"/branch/manage-department"}
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 py-3"
            >
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">
                Manage Department
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default CompanySidebar;
