"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getProject } from "@/api_calls/admin/projects/getProject";
import { sendRequest } from "@/api_calls/sendRequest";
import { GrDocumentCsv } from "react-icons/gr";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";
import { createLog } from "@/api_calls/taskLogs/createTaskLog";
import { MdEdit } from "react-icons/md";
import { IoCloseSharp, IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const TaskForm = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userListData, setUserListData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const router = useRouter();
  const params = useSearchParams();
  const task_id = params.get("id");
  const [imageFile, setImageFile] = useState([]);
  const [attchmentData, setAttachmentData] = useState([]);
  const [priorityid, setPriorityId] = useState("");
  const [summaryChanged, setSummaryChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [oldValue, setOldValue] = useState([]);

  const [taskLogsData, setTaskLogData] = useState([]);

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

  const [task, setTask] = useState({
    project_id: "",
    issue_type: "",
    status: "",
    summary: "",
    assignee: "",
    priority: "Low",
    reporter: "",
    description: "",
    attachment: "",
    due_date: "",
    projectData: null,
    mainProject: "",
    subProject: "",
    task_status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
    // if (e.target.name == "task_status") {
    //   handleSubmit(value);
    // }
  };

  const handleSubmit = async (status) => {
    const sendData = {
      project_id: task.project_id * 1,
      issue_type: task.issue_type,
      summary: task.summary,
      assigned_to: task.assignee * 1,
      reporter: task.reporter * 1,
      priority: task.priority,
      task_name: "",
      description: task.description,
      attachment: imageFile,
      due_date: task.due_date,
      task_status: task.task_status,
    };
    if (status == "Open") {
      sendData.task_status = "Open";
    }
    if (status == "InProgress") {
      sendData.task_status = "InProgress";
    }
    if (status == "InReview") {
      sendData.task_status = "InReview";
    }
    // console.log("sendData: ", sendData);
    if (task_id) {
      const data = await sendRequest(
        "put",
        `api/edittask/${task_id}`,
        sendData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("data: ", data);
      setSuccessMsg("Task Edited");
      // router.push("/admin/tasks/list-tasks");
    }
  };

  const editTask = async (data, logmessage = "") => {
    // console.log("data: ", data);
    const adminId = localStorage.getItem("admin_id");
    if (task_id) {
      let apiCall = await sendRequest("put", `api/edittask/${task_id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (apiCall.status == 1) {
        await fetchData();
        setSummaryChanged(false);
        setDescriptionChanged(false);
        await createLog(
          adminId,
          logmessage,
          "put",
          JSON.stringify(oldValue),
          JSON.stringify(data),
          task_id,
          "task"
        );
      }
    }
    await getTaskLogs();
  };

  const uploadAttachment = async (event) => {
    const adminId = localStorage.getItem("admin_id");
    if (task_id) {
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append("attachment", file);
      console.log("formData: ", formData);
      const data = await sendRequest(
        "post",
        `api/uploadAttachment/${task_id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("data", data);
      await createLog(
        adminId,
        `Task attachment added`,
        "put",
        JSON.stringify(oldValue),
        JSON.stringify(file),
        task_id,
        "task"
      );
      fetchData();
    }
  };

  const allDropDownData = async () => {
    const data = await getProject();
    setProjectData(data?.data?.data);
  };

  const getTaskLogs = async () => {
    let data = await sendRequest(
      "get",
      `api/getTaskLog?taskId=${task_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data.data.data);
    setTaskLogData(data.data.data);
  };

  useEffect(() => {
    allDropDownData();
    getTaskLogs();
  }, []);

  const fetchData = async () => {
    try {
      if (task_id) {
        const data = await sendRequest(
          "get",
          `api/getTask?task_id=${task_id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newData = data.data.data[0];
        setOldValue(newData);
        if (data.status == 1) {
          const userList = await sendRequest(
            "get",
            `api/getallocatedProjectUserassingee?projectId=${newData.project_id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserListData(userList?.data?.data);
          setTask((prev) => ({
            ...prev,
            summary: newData?.summary,
            assignee: newData?.assigned_to,
            priority: newData?.priority,
            reporter: newData?.reporter,
            description: newData?.description,
            project_id: newData?.project_id,
            due_date: newData?.due_date.split("T")[0],
            mainProject: newData?.mainProject,
            subProject: newData?.subProject,
            task_status: newData?.task_status,
            issue_type: newData?.issue_type,
          }));
          setAttachmentData(data?.data?.attachmentData);
        }
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [task_id]);

  const handleFileRemove = async (attachmentId) => {
    const adminId = localStorage.getItem("admin_id");
    const data = await sendRequest(
      "put",
      `api/deleteAttachment/${attachmentId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.status == 1) {
      setSuccessMsg("File deleted");
      await createLog(
        adminId,
        `Task attachment deleted`,
        "put",
        JSON.stringify(oldValue),
        JSON.stringify(file),
        task_id,
        "task"
      );
      await fetchData();
    }
  };

  function renderFile(fileData) {
    if (typeof fileData === "string" && isValidURL(fileData)) {
      if (fileData.endsWith(".png") || fileData.endsWith(".jpg")) {
        return (
          <Image
            className="flex"
            src={fileData}
            alt="file"
            width={200}
            height={200}
          />
        );
      } else if (fileData.endsWith(".pdf")) {
        return (
          <div>
            <FaRegFilePdf />
          </div>
        );
      } else if (fileData.endsWith(".csv") || fileData.endsWith(".xlsx")) {
        return (
          <p>
            <GrDocumentCsv />
          </p>
        );
      }
    }
    return <p>Unsupported file</p>;
  }

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

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

          <section className="mx-auto w-full max-w-7xl">
            <BreadCrum
              breadcumr1={"Manage Tasks"}
              breadcumr1_link={"/admin/tasks/add-tasks"}
              breadcumr2={task.mainProject}
              breadcumr3={task.subProject}
              // button_name={"Tasks List"}
              // button_link={"/admin/tasks/list-tasks"}
            />

            <div className="p-4 bg-white rounded shadow text-sm">
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
              <h1 className="text-2xl font-semibold mb-4">
                {task.mainProject} - {task.subProject}
              </h1>

              <div className="grid grid-cols-8 gap-4 text-sm">
                <div className="col-span-5">
                  <div className="mb-2 ">
                    <label htmlFor="label" className="label-text">
                      Summary
                    </label>
                    <input
                      type="text"
                      id="summary"
                      name="summary"
                      disabled={!summaryChanged}
                      value={task.summary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <MdEdit
                      className="ml-2 text-gray-500 cursor-pointer"
                      onClick={() => {
                        setSummaryChanged(!summaryChanged);
                        // setInputValueChanged(true);
                        // setInputChanged(index);
                      }}
                    />
                    {summaryChanged ? (
                      <>
                        <button
                          className="ml-2 bg-blue-200 text-lg"
                          onClick={async () => {
                            editTask(
                              { summary: task.summary },
                              `Task summary changed from ${oldValue.summary} to ${task.summary}`
                            );
                          }}
                        >
                          <IoCheckmark />
                        </button>
                        <button
                          className="ml-2 bg-red-200 text-lg"
                          onClick={() => setSummaryChanged(!summaryChanged)}
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="mb-2">
                    <label htmlFor="label" className="label-text">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      name="description"
                      disabled={!descriptionChanged}
                      value={task.description}
                      onChange={handleChange}
                    ></textarea>
                    <MdEdit
                      className="ml-2 text-gray-500 cursor-pointer"
                      onClick={() => {
                        setDescriptionChanged(!descriptionChanged);
                      }}
                    />
                    {descriptionChanged ? (
                      <>
                        <button
                          className="ml-2 bg-blue-200 text-lg"
                          onClick={async () => {
                            editTask(
                              { description: task.description },
                              `Task description changed from ${oldValue.description} to ${task.description}`
                            );
                          }}
                        >
                          <IoCheckmark />
                        </button>
                        <button
                          className="ml-2 bg-red-200 text-lg"
                          onClick={() =>
                            setDescriptionChanged(!descriptionChanged)
                          }
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  <h2>Attachments</h2>
                  <div className="grid grid-cols-5">
                    {attchmentData?.map((fileData, index) => (
                      <div
                        className="w-24 px-2 cursor-pointer justify-center items-center text-6xl"
                        key={index}
                      >
                        <a
                          href={fileData.files}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {renderFile(fileData.files)}
                        </a>
                        <button
                          className="text-sm btn "
                          onClick={() => handleFileRemove(fileData.id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2 mt-2">
                    <input
                      accept="image/*"
                      className="form-control"
                      id="attachment"
                      name="attachment"
                      type="file"
                      multiple
                      onChange={uploadAttachment}
                    />
                  </div>
                </div>

                <div className="col-span-3 mt-4">
                  <div className="grid grid-cols-2">
                    <div className="mb-2 items-center w-36">
                      <select
                        id="task_status"
                        name="task_status"
                        value={task.task_status}
                        onChange={(e) => {
                          handleChange(e);
                          editTask(
                            { task_status: e.target.value },
                            `Task status changed from ${oldValue.task_status} to ${e.target.value}`
                          );
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="Open">Open</option>
                        <option value="InReview">Review</option>
                        <option value="InProgress">In Progress</option>
                      </select>
                    </div>

                    <div className="drawer-content btn btn-xs btn-secondary ">
                      <label htmlFor="my-drawer-4" className="drawer-button ">
                        Open Activity Logs
                      </label>
                    </div>
                  </div>

                  <details className="collapse collapse-arrow border" open>
                    <summary className="collapse-title text-xl font-medium border mb-4">
                      Details
                    </summary>
                    <div className="collapse-content">
                      <div className="mb-2 flex items-center">
                        <label
                          htmlFor="assignee"
                          className="label-text mr-4 w-24 text-xs font-bold"
                        >
                          Assignee
                        </label>
                        <select
                          id="assignee"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          name="assignee"
                          value={task.assignee}
                          onChange={(e) => {
                            handleChange(e);
                            editTask(
                              { assigned_to: e.target.value },
                              `Task assignee changed from ${oldValue.assigned_to} to ${e.target.value}`
                            );
                          }}
                        >
                          <option value="">Select Assignee</option>
                          {userListData?.map((res, index) => (
                            <option key={index} value={res.userId}>
                              {res.name + "-" + res.companyName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-2 flex items-center">
                        <label
                          htmlFor="reporter"
                          className="label-text mr-4 w-24 text-xs font-bold"
                        >
                          Reporter
                        </label>
                        <select
                          id="reporter"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          name="reporter"
                          value={task.reporter}
                          onChange={(e) => {
                            handleChange(e);
                            editTask(
                              { reporter: e.target.value },
                              `Task reporter changed from ${oldValue.reporter} to ${e.target.value}`
                            );
                          }}
                        >
                          <option value="">Select Reporter</option>
                          {userListData?.map((res, index) => (
                            <option key={index} value={res.userId}>
                              {res.name + "-" + res.companyName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-2 flex items-center">
                        <label
                          htmlFor="due_date"
                          className="label-text mr-4 w-24 text-xs font-bold"
                        >
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="due_date"
                          name="due_date"
                          value={task.due_date}
                          onChange={(e) => {
                            handleChange(e);
                            editTask(
                              { due_date: e.target.value },
                              `Task dueDate changed from ${oldValue.due_date} to ${e.target.value}`
                            );
                          }}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-2 flex items-center">
                        <label
                          htmlFor="priority"
                          className="label-text mr-4 w-24 text-xs font-bold"
                        >
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={task.priority}
                          onChange={(e) => {
                            handleChange(e);
                            editTask(
                              { priority: e.target.value },
                              `Task priority changed from ${oldValue.priority} to ${e.target.value}`
                            );
                          }}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="mb-2 flex items-center">
                        <label
                          htmlFor="issue_type"
                          className="label-text mr-4 w-24 text-xs font-bold"
                        >
                          Issue Type
                        </label>
                        <select
                          id="issue_type"
                          name="issue_type"
                          value={task.issue_type}
                          onChange={(e) => {
                            handleChange(e);
                            editTask(
                              { issue_type: e.target.value },
                              `Task issue type changed from ${oldValue.issue_type} to ${e.target.value}`
                            );
                          }}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        >
                          <option value="Bug">Bug</option>
                          <option value="Improvement">Improvement</option>
                          <option value="NewFeature">New Feature</option>
                        </select>
                      </div>
                    </div>
                  </details>
                  {/* <details className="collapse collapse-arrow border" open>
                    <summary className="collapse-title text-xl font-medium border mb-4">
                      Task Logs
                    </summary>
                    <div className="collapse-content overflow-scroll h-56">
                      {taskLogsData.map((res, index) => (
                        <>
                          <p className="font-bold">
                            {res.adminName != null ? res.adminName : ""}{" "}
                          </p>
                          <p className="font-bold">
                            {res.userName != null ? res.userName : ""}
                          </p>
                          <p className="pb-4">{res?.message}</p>
                          <hr />
                        </>
                      ))}
                    </div>
                  </details> */}
                </div>
              </div>
              <div className="drawer drawer-end">
                <input
                  id="my-drawer-4"
                  type="checkbox"
                  className="drawer-toggle"
                />
                {/* <div className="drawer-content">
                  <label
                    htmlFor="my-drawer-4"
                    className="drawer-button btn btn-primary"
                  >
                    Open drawer
                  </label>
                </div> */}
                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer-4"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* <li> */}
                    <li className="font-bold">Activity</li>
                    <hr />
                    {/* <a>Sidebar Item 1</a> */}
                    {taskLogsData.map((res, index) => (
                      <>
                        <p className="font-bold">
                          {res.adminName != null ? res.adminName : ""}{" "}
                        </p>
                        <p className="font-bold">
                          {res.userName != null ? res.userName : ""}
                        </p>
                        <p className="pb-4">{res?.message}</p>
                        <hr className="pb-2 bg-gray-200" />
                      </>
                    ))}
                    {/* </li> */}
                  </ul>
                </div>
              </div>
              {/* <button
                type="submit"
                className="btn web-btn text-white sm:mt-0 md:mt-4"
                onClick={() => handleSubmit("")}
              >
                Save
              </button> */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
