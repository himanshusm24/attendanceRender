"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import moment from "moment";
import Select from "react-select";
import Image from "next/image";
import { FaPlus, FaSearch } from "react-icons/fa";
import { IoCloseSharp, IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import { sendRequest } from "@/api_calls/sendRequest";
import { createLog } from "@/api_calls/taskLogs/createTaskLog";
import { getAllStatus } from "@/api_calls/admin/taskManage/getAllStatus";

const SubProjectDetails = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const params = useSearchParams();
  const projectId = params.get("id");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [startEndProject, setStartEndProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  const [inputChanged, setInputChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [allocatedUserList, setAllocatedUserList] = useState([]);
  const [oldValue, setOldValue] = useState([]);

  const [allStatusData, getAllStatusData] = useState([]);

  let token;
  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("token");
    if (token) {
      // console.log("Token found:", token);
    } else {
      console.log("No token found in localStorage.");
    }
  } else {
    console.log("localStorage is not supported in this browser/environment.");
  }

  const allProjects = async () => {
    if (projectId) {
      const data = await sendRequest(
        "get",
        `api/getSubProject?project_id=${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const projectDetail = data?.data?.data[0];
      setOldValue(projectDetail);
      setProjectName(projectDetail?.project_name);
      setDescription(projectDetail?.description);
      setProjectStatus(projectDetail?.projectStatus);
      setStartEndProject(moment(projectDetail?.startDate).format("YYYY-MM-DD"));
      setEndDateProject(moment(projectDetail?.endDate).format("YYYY-MM-DD"));
      setAllocatedUserList(data?.data?.userData);
    }
  };

  const editProject = async (
    startd = startEndProject,
    endD = endDateProject,
    projectS = projectStatus,
    logmessage = ""
  ) => {
    const adminId = localStorage.getItem("admin_id");
    if (projectId) {
      const sendData = {
        project_name: projectName,
        description: description,
        projectStatus: projectS,
        endDate: endD,
        startDate: startd,
      };
      const data = await sendRequest(
        "put",
        `api/editProject/${projectId}`,
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("data: ", data);
      if (data.status == 1) {
        createLog(
          adminId,
          logmessage,
          "put",
          JSON.stringify(oldValue),
          JSON.stringify(sendData)
        );
        setSuccessMsg(`Updated: ${logmessage}`);
      }
    }
  };

  const allStatus = async () => {
    const data = await getAllStatus();
    getAllStatusData(data.data.data);
  };

  useEffect(() => {
    allProjects();
    allStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

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
              breadcumr3={projectName}
              // button_name={"Add Project"}
              // button_link={"/admin/projects/addProject"}
            />
            <section className="project-details mt-4">
              {successMsg != "" && successMsg != null ? (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
                  role="success"
                >
                  <span className="block sm:inline">{successMsg}</span>
                </div>
              ) : (
                ""
              )}

              {errorMsg != "" && errorMsg != null ? (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{errorMsg}</span>
                </div>
              ) : (
                ""
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="web-box md:col-span-3">
                  <div className="box-heading">
                    <h1 className="heading">
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => {
                          setInputChanged(true);
                          setProjectName(e.target.value);
                        }}
                      ></input>
                      {inputChanged ? (
                        <>
                          <button
                            className="ml-2 bg-blue-200 text-lg"
                            onClick={async () => {
                              setInputChanged(false);
                              await editProject(
                                startEndProject,
                                endDateProject,
                                projectStatus,
                                `Project Name changed from ${oldValue.project_name} to ${projectName}`
                              );
                              await allProjects();
                            }}
                          >
                            <IoCheckmark />
                          </button>
                          <button
                            className="ml-2 bg-red-200 text-lg"
                            onClick={() => setInputChanged(false)}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </h1>
                  </div>
                  <div className="box-body">
                    <div className="w-full">
                      <textarea
                        placeholder="Bio"
                        className="textarea textarea-bordered textarea-xs w-full max-w-[55rem]"
                        value={description}
                        onChange={(e) => {
                          setDescriptionChanged(true);
                          setDescription(e.target.value);
                        }}
                      ></textarea>

                      {descriptionChanged ? (
                        <>
                          <button
                            className="ml-2 bg-blue-200 text-lg"
                            onClick={async () => {
                              setDescriptionChanged(false);
                              await editProject(
                                startEndProject,
                                endDateProject,
                                projectStatus,
                                `Project description changed from  ${oldValue.description} to ${description}`
                              );
                              await allProjects();
                            }}
                          >
                            <IoCheckmark />
                          </button>
                          <button
                            className="ml-2 bg-red-200 text-lg"
                            onClick={() => setDescriptionChanged(false)}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="team-section">
                      <div className=" flex items-center justify-between mt-4">
                        <h3 className="sub-heading">Manage Team</h3>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="table table-bordered table-hoverable">
                          <thead>
                            <tr className="web-bg">
                              <th width="400px">Team</th>
                              <th>Department</th>
                              <th>Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allocatedUserList?.map((res, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="team-name">
                                    <Image
                                      src="/img/user-default.png"
                                      width={50}
                                      height={50}
                                      className="user-img"
                                      alt=""
                                    />
                                    <b>{res?.name}</b>
                                  </div>
                                </td>
                                <td>{res?.departmentName}</td>
                                <td>{res?.designation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="web-box right-side">
                  <div className="box-heading">
                    <h3 className="heading">Project Status</h3>
                  </div>
                  <div className="box-body">
                    <h3 className="sub-heading">Status</h3>
                    {/* <span className="badge bg-success"> */}
                    {/* </span> */}
                    <div className="mb-2 items-center w-36">
                      <select
                        id="task_status"
                        name="task_status"
                        value={projectStatus}
                        onChange={(e) => {
                          setProjectStatus(e.target.value);
                          editProject(
                            startEndProject,
                            endDateProject,
                            e.target.value,
                            `Project Status changed from  ${oldValue.projectStatus} to ${e.target.value}`
                          );
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      >
                        {
                          allStatusData?.map((resp,index)=>(
                            <>
                            <option key={index} value={resp.project_status}> {resp.project_status} </option>
                            </>
                          ))
                        }
                        {/* <option value="Open">Open</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option> */}
                      </select>
                    </div>
                    <hr />
                    <h3 className="sub-heading">Start Date</h3>
                    <p>
                      <input
                        type="date"
                        // value={moment(startEndProject).format("DD/MM/YYYY")}
                        value={startEndProject}
                        onChange={(e) => {
                          setStartEndProject(e.target.value);
                          editProject(
                            e.target.value,
                            endDateProject,
                            projectStatus,
                            `Project Start Date changed from ${oldValue.startDate} to ${e.target.value}`
                          );
                        }}
                      ></input>
                    </p>
                    <hr />
                    <h3 className="sub-heading">End Date</h3>
                    <p>
                      <input
                        type="date"
                        // value={moment(endDateProject).format("YYYY-MM-DD")}
                        value={endDateProject}
                        onChange={(e) => {
                          setEndDateProject(e.target.value);
                          editProject(
                            startEndProject,
                            e.target.value,
                            projectStatus,
                            `Project End Date changed from ${oldValue.endDate} to ${e.target.value}`
                          );
                        }}
                      ></input>{" "}
                    </p>
                    <hr />
                    <h3 className="sub-heading">Delay</h3>
                    <p>{"20 Days"}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubProjectDetails;
