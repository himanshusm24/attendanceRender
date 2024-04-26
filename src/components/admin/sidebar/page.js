/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Wallet, Newspaper } from "lucide-react";
import "./sidebar.css";
import { useRouter } from "next/navigation";
import TaskSidebar from "./taskSidebar";
import AttendanceSidebar from "./AttendSidebar";
// import AddProject from "@/app/admin/projects/addProject/page";
import AddProject from "@/app/admin/projects/listProject/addProject";
import AddTask from "@/app/admin/tasks/addTask";
import { FiUsers } from "react-icons/fi";
import { LuFolders } from "react-icons/lu";

const Sidebar = ({ sidemenu }) => {
  const router = useRouter();
  const [opensideMenu, setOpenSideMenu] = useState(sidemenu);
  const [openattendance, setOpenAttendance] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [checkEvent, setCheckEvent] = useState("");
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openAddSubProject, setOpenAddSubProject] = useState(false);

  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    setOpenSideMenu(sidemenu);
    const params = new URLSearchParams(window.location.search);
    setOpenAttendance(params.get("attendance") === "true");
  }, [sidemenu]);

  const toggleAttendance = () => {
    const newValue = !openattendance;
    setOpenAttendance(newValue);
    localStorage.setItem("sidebar", "attendanceSidebar");
  };
  const toggleTask = () => {
    const newValue = !openTask;
    setOpenTask(newValue);
    localStorage.setItem("sidebar", "taskSidebar");
  };

  const handleAddEvent = async (data) => {
    console.log("handleAddEventData: ", data);
    setOpenAddProject(!openAddProject);
    document.getElementById("my_modal_3").showModal();
  };

  const handleSubEvent = async (data) => {
    console.log("data: ", data);
    setTaskId(data);
    setOpenAddSubProject(!openAddSubProject);
    document.getElementById("my_modal_4").showModal();
  };

  useEffect(() => {
    const sidebar = localStorage.getItem("sidebar");
    if (sidebar == "attendanceSidebar") {
      setOpenTask(false);
      setOpenAttendance(true);
    } else if (sidebar == "taskSidebar") {
      setOpenAttendance(false);
      setOpenTask(true);
    } else {
      setOpenAttendance(false);
      setOpenTask(false);
    }
    setCheckEvent("");
  }, [checkEvent]);

  const handleEvent = (data) => {
    setCheckEvent(data);
  };

  const handleCloseModal = (data) => {
    if (data) {
      onDataArrived();
    }
  };

  function onDataArrived() {
    var closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.click();
    }
  }

  return (
    <aside
      className={`flex h-screen w-64 flex-col overflow-y-auto border-r bg-black px-5 py-8 fixed admin-sidebar ${opensideMenu}`}
    >
      <a href="/admin/dashboard">
        <img src="/img/7oclock-logo.png" className="logo" alt="Image" />
      </a>
      <button className="sidebar-main-btns" onClick={toggleAttendance}>
        <FiUsers />
        <span>Manage Attendance</span>
      </button>
      <button className="sidebar-main-btns" onClick={toggleTask}>
        <LuFolders />
        <span>Manage Task</span>
      </button>

      {openattendance ? (
        <>
          <AttendanceSidebar clickEvent={handleEvent} />
        </>
      ) : (
        ""
      )}

      {openTask ? (
        <>
          <TaskSidebar
            clickEvent={handleEvent}
            addEvent={handleAddEvent}
            subAddEvent={handleSubEvent}
          />
        </>
      ) : (
        ""
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              id="closeButton"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <AddProject closeModal={handleCloseModal} />
        </div>
      </dialog>

      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <AddTask taskid={taskId} />
        </div>
      </dialog>
    </aside>
  );
};

export default Sidebar;
