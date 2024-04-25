"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { MdOutlineClear } from "react-icons/md";

import AddProject from "./addProject";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ListProject = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [expandedRowsSubProject, setExpandedRowsSubProject] = useState([]);
  const [subprojectData, setSubProjectData] = useState([]);
  const [projectName, setProjectName] = useState("");

  const [openAddProject, setOpenAddProject] = useState(false);

  const toggleRowSubProject = (index) => {
    const newExpandedRows = [...expandedRowsSubProject];
    const currentIndex = newExpandedRows.indexOf(index);

    if (currentIndex !== -1) {
      newExpandedRows.splice(currentIndex, 1);
    } else {
      newExpandedRows.splice(0, newExpandedRows.length, index);
    }

    setExpandedRowsSubProject(newExpandedRows);
  };

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const projectList = async () => {
    const data = await sendRequest(
      "get",
      "api/getProject",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjectData(data?.data?.data);
  };

  const projectSearch = async () => {
    const data = await sendRequest(
      "get",
      `api/getProjectSearch?projectName=${projectName}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    setProjectData(data?.data?.data);
  };

  useEffect(() => {
    projectList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const getSubProjects = async (id) => {
    const data = await sendRequest(
      "get",
      `api/subProject?project_id=${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSubProjectData(data?.data?.data);
  };

  const deleteMainProject = async (id) => {
    const data = await sendRequest(
      "put",
      `api/deleteMainProject/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      await projectList();
    }
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure ? This will delete all its subtask too.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            // console.log(id);
            deleteMainProject(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleAddEvent = async (data) => {
    console.log("data: ", data);
    setOpenAddProject(!openAddProject);
    document.getElementById("my_modal_3").showModal();
  };
  console.log("openAddProject: ", openAddProject);

  const handleCloseModal = async (data) => {
    // console.log("data: ", data);
    // if (data) {
    //   setSuccessMsg("Project created");
    //   await projectList();
    //   await onDataArrived();
    // }
  };

  function onDataArrived(data) {
    console.log("data: ", data);
    var closeButton = document.getElementById("closeButton");
    if (closeButton) {
      closeButton.click();
    }
  }

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
          <div className="web-wrapper">
            <BreadCrum
              breadcumr1={"Manage Project"}
              breadcumr1_link={"/admin/projects/listProject"}
              breadcumr2={"List"}
              // button_name={"Add Project"}
              // button_link={"/admin/projects/addProject"}
            />
            <section className="project-listing web-box mt-4">
              <div className="box-heading">
                <div class="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4 items-center">
                  <div className="grid grid-cols-3">
                    <h1 className="heading">All Projects</h1>
                    <button className="btn web-btn" onClick={handleAddEvent}>
                      Add project
                    </button>
                  </div>
                  <div className="grid md:grid-cols-4 md:gap-4 items-center">
                    <div class="join ml-auto col-span-3 mt-2 md:mt-0">
                      <input
                        class="input input-bordered join-item"
                        placeholder="Search"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                      <button
                        class="btn web-btn join-item"
                        onClick={() => projectSearch()}
                      >
                        <FaSearch />
                        Search
                      </button>
                    </div>
                    <div>
                      <button
                        class="btn btn-error w-full mt-3 md:mt-0"
                        onClick={() => {
                          setProjectName("");
                          projectList();
                        }}
                      >
                        <MdOutlineClear />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-body">
                <div className="overflow-x-auto">
                  <table className="table table-bordered table-hoverable">
                    <thead>
                      <tr className="web-bg">
                        <th width="50px">Sr. No.</th>
                        <th>Project Name</th>
                        <th width="180px">Start Date</th>
                        <th width="180px">End Date</th>
                        <th width="180px">Delay</th>
                        <th width="180px">Status</th>
                        <th width="20px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectData?.map((task, index) => (
                        <>
                          <tr key={task.task_id}>
                            <td>{index + 1}</td>
                            <td>
                              <button
                                className="project-name"
                                onClick={() => {
                                  toggleRowSubProject(index);
                                  getSubProjects(task.project_id);
                                }}
                              >
                                <Link
                                  href={`/admin/projects/projectDetails?project_id=${task.project_id}`}
                                >
                                  {task?.project_name}
                                </Link>

                                {expandedRowsSubProject.includes(index) ? (
                                  <FaAngleUp />
                                ) : (
                                  <FaAngleDown />
                                )}
                              </button>
                            </td>
                            <td>
                              {moment(task?.startDate).format("DD MMMM YYYY") ==
                              "Invalid date"
                                ? "NA"
                                : moment(task?.startDate).format(
                                    "DD MMMM YYYY"
                                  )}
                            </td>
                            <td>
                              {moment(task?.endDate).format("DD MMMM YYYY") ==
                              "Invalid date"
                                ? "NA"
                                : moment(task?.endDate).format("DD MMMM YYYY")}
                            </td>
                            <td>0 Days</td>
                            <td>
                              <span className="badge bg-danger">
                                {task?.projectStatus || "NA"}
                              </span>
                            </td>
                            <td>
                              {/* <button className="">...</button> */}
                              <div className="dropdown dropdown-left">
                                <div tabIndex={0} role="button" className="">
                                  ...
                                </div>
                                <ul
                                  tabIndex={0}
                                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                  <li>
                                    <a onClick={() => console.log("")}>
                                      Add Sub Project
                                    </a>
                                  </li>
                                  <li
                                    onClick={(e) =>
                                      deletConfirmation(task.project_id)
                                    }
                                  >
                                    <a>Delete</a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>

                          {expandedRowsSubProject.includes(index) && (
                            <>
                              <tr>
                                <td className="bg-white">
                                  {/* <Image
                                  src="/img/arrow.svg"
                                  width={500}
                                  height={500}
                                  className="table-arrow"
                                  alt=""
                                /> */}
                                </td>
                                <td colSpan="5" className="bg-white">
                                  {subprojectData.length > 0 ? (
                                    <table className="table table-bordered">
                                      <thead>
                                        <tr className="web-bg">
                                          <th width="50px">S.No.</th>
                                          <th>Sub Project</th>
                                          <th width="180px">Start Date</th>
                                          <th width="180px">End Date</th>
                                          <th width="180px">Delay</th>
                                          <th width="180px">Status</th>
                                          <th width="20px"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {subprojectData.map(
                                          (project, index) => (
                                            <tr key={project.project_id}>
                                              <td>{index + 1}</td>
                                              <td>
                                                <Link
                                                  href={`/admin/projects/subProjectDetails?id=${project.project_id}`}
                                                  className="project-name"
                                                >
                                                  {project.project_name}
                                                </Link>
                                              </td>
                                              <td>
                                                {moment(
                                                  project.startDate
                                                ).format("DD/MM/YYYY") ==
                                                "Invalid date"
                                                  ? "NA"
                                                  : moment(
                                                      project.startDate
                                                    ).format("DD/MM/YYYY")}
                                              </td>
                                              <td>
                                                {moment(project.endDate).format(
                                                  "DD/MM/YYYY"
                                                ) == "Invalid date"
                                                  ? "NA"
                                                  : moment(
                                                      project.endDate
                                                    ).format("DD/MM/YYYY")}
                                              </td>
                                              <td>0 Days</td>
                                              <td>
                                                <span className="badge bg-primary">
                                                  In Progress
                                                </span>
                                              </td>
                                              <td>
                                                <div className="dropdown dropdown-left">
                                                  <div
                                                    tabIndex={0}
                                                    role="button"
                                                    className=""
                                                  >
                                                    ...
                                                  </div>
                                                  <ul
                                                    tabIndex={0}
                                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                                  >
                                                    {/* <li>
                                                      <a
                                                        onClick={() =>
                                                          console.log("")
                                                        }
                                                      >
                                                        Add Sub Project
                                                      </a>
                                                    </li> */}
                                                    <li
                                                      onClick={(e) =>
                                                        deletConfirmation()
                                                      }
                                                    >
                                                      <a>Delete</a>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p className="text-gray-600 text-sm">
                                      No subProjects for this project yet
                                    </p>
                                  )}
                                </td>
                              </tr>
                            </>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {openAddProject == true ? (
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
              ) : (
                ""
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProject;
