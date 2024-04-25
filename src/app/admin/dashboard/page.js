"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { AttedanceListDashBoard } from "@/api_calls/admin/attendance/attendanceListDashboard";
import moment from "moment";

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [totalCompany, setTotalCompany] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);

  const allCompany = async () => {
    const data = await CompanyLists();
    setTotalCompany(data?.data?.data?.length);
  };

  const allUsers = async () => {
    const data = await UserListss();
    setTotalUsers(data?.data?.data.length);
  };

  const attendanceCount = async () => {
    const data = await AttedanceListDashBoard(
      moment(new Date()).format("YYYY-MM-DD")
    );
    console.log("data: ", data?.data.data);
    setTotalAttendance(data?.data?.data);
  };

  useEffect(() => {
    allCompany();
    allUsers();
    attendanceCount();
  }, []);

  console.log("todayDate", moment(new Date()).format("YYYY-MM-DD"));

  return (
    <>
      <div className="main-wrapper">
        <Sidebar
          sidemenu={`${
            isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"
          }`}
        />
        <div className="rightside">
          <Header
            clickEvent={() => {
              setSidebarVisible(!isSidebarVisible);
            }}
            sidebarVisible={isSidebarVisible}
          />
          <section className="mx-auto w-full max-w-7xl py-4 px-3 md:px-0">
            <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
              <div className="bg-base-100 shadow-xl w-full rounded-md">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Total Branches</h3>
                    <h2 className="font-bold">{totalCompany}</h2>
                  </div>
                </div>
              </div>
              <div className="bg-base-100 shadow-xl w-full rounded-md">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Total Users</h3>
                    <h2 className="font-bold">{totalUsers}</h2>
                  </div>
                </div>
              </div>
              {/* <div className="bg-base-100 shadow-xl w-full rounded-md">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Today Attendance</h3>
                    <h2 className="font-bold">{totalAttendance.totalAttendance}</h2>
                  </div>
                </div>
              </div> */}
              <div className="bg-base-100 shadow-xl w-full rounded-md">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Today Present</h3>
                    <h2 className="font-bold">
                      {totalAttendance?.presentEmployee}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bg-base-100 shadow-xl w-full rounded-md">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h3 className="font-bold">Today Absent</h3>
                    <h2 className="font-bold">
                      {totalAttendance?.absentEmployee}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
