"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { getTask } from "@/api_calls/admin/tasks/getTask";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trash2, Eye, Save } from "lucide-react";
import { sendRequest } from "@/api_calls/sendRequest";
import Select from "react-select";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { MdEdit, MdDensityMedium } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import { getAllStatus } from "@/api_calls/admin/taskManage/getAllStatus";

const TaskList = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [TaskData, setTaskData] = useState([]);
  const params = useSearchParams();
  const project_id = params.get("project");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userListData, setUserListData] = useState([]);
  const [selectedAssigneeValues, setSelectedAssignValues] = useState("");
  const [selectedReproterValues, setSelectedReporterValues] = useState("");
  let [optionsData, setOptionsData] = useState([]);
  const [editData, setEditData] = useState("");
  const [userData, setUserData] = useState({});
  const [inputValueChanged, setInputValueChanged] = useState(false);
  const [editableRows, setEditableRows] = useState([]);

  const [oldData, setOldData] = useState([]);
  const [allStatusData, getAllStatusData] = useState([]);

  // console.log('TaskData: ', TaskData);

  const [newTask, setNewTask] = useState({
    summary: "",
    due_date: "",
    assigned_to: "",
    reporter: "",
    project_id: "",
    issue_type: "",
    priority: "",
    attachement: "",
    task_status: "",
  });

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const getTaskData = async () => {
    let data;
    if (project_id) {
      data = await getTask(project_id);
      setTaskData(data?.data?.data);
      setOldData(data?.data?.data);
    } else {
      data = await getTask();
    }
  };

  useEffect(() => {
    getTaskData();
  }, [project_id]);

  useEffect(() => {
    const successTimer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);

    const errorTimer = setTimeout(() => {
      setErrorMsg(null);
    }, 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [successMsg, errorMsg]);

  const addEmptyRow = () => {
    if (TaskData.length === 0 || !isRowEmpty(TaskData[0])) {
      const newTaskData = [newTask, ...TaskData];
      console.log("newTaskData: ", newTaskData);
      setTaskData(newTaskData);
    }
    setNewTask({
      summary: "",
      due_date: "",
      assigned_to: "",
      reporter: "",
      project_id: "",
      issue_type: "",
      priority: "",
      attachment: "",
      task_status: "",
    });
  };

  const isRowEmpty = (row) => {
    if (Object.values(row).every((value) => value === "") == true) {
      // alert("Enter all fields. ");
      setErrorMsg("Save this field first");
    }
    return Object.values(row).every((value) => value === "");
  };

  // const addEmptyRow = () => {
  //   const newTaskData = [newTask, ...TaskData];
  //   setTaskData(newTaskData);
  //   setNewTask({
  //     summary: "",
  //     due_date: "",
  //     assigned_to: "",
  //     reporter: "",
  //     project_id: "",
  //     issue_type: "",
  //     priority: "",
  //     attachement: "",
  //   });
  // };

  const allDropDownData = async () => {
    const userList = await sendRequest(
      "get",
      `api/getallocatedProjectUserassingee?projectId=${project_id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserListData(userList?.data?.data);
    setOptionsData(
      userList?.data?.data?.map((item) => ({
        value: item.userId,
        label: item.name,
      }))
    );
  };

  const handleSubmit = async (task) => {
    console.log("task: ", task);
    console.log("selectedAssigneeValues: ", selectedAssigneeValues);

    if (task.summary.length <= 0) {
      return setErrorMsg("Enter task summary");
    }
    if (!selectedAssigneeValues.value) {
      return setErrorMsg("Select assignee");
    }
    if (!selectedReproterValues.value) {
      return setErrorMsg("Select reporter");
    }
    if (!task.due_date) {
      return setErrorMsg("Select due date");
    }
    if (!task.task_status) {
      return setErrorMsg("Select status");
    }
    let sendData = {
      project_id: project_id * 1,
      issue_type: task.issue_type,
      summary: task.summary,
      assigned_to: selectedAssigneeValues.value * 1,
      reporter: selectedReproterValues.value * 1,
      task_status: task.task_status,
      priority: task.priority,
      due_date: task.due_date,
      task_name: "",
    };
    console.log("sendData: ", sendData);

    if (task.assigned_to) {
      sendData.assigned_to = task.assigned_to;
    }
    if (task.reporter) {
      sendData.reporter = task.reporter;
    }
    // let data;
    // if (editData && editData > 0) {
    //   data = await sendRequest("put", `api/edittask/${editData}`, sendData, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    // } else {
    let data = await sendRequest("post", "api/addtask", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // }
    if (data.status == 1) {
      // {
      //   editData && editData > 0
      //     ? async () => {
      //         setSuccessMsg("Task edited successfully");
      //         await createLog(userData.adminId, `Task Updated from `);
      //       }
      //     :
      //     setSuccessMsg("Task added successfully");
      //   }
      setSuccessMsg("Task added successfully");
      await allDropDownData();
      await getTaskData();
    }
  };

  const editTask = async (data) => {
    console.log("data: ", data);
    const adminId = localStorage.getItem("admin_id");
    if (editData && editData > 0) {
      let apiCall = await sendRequest("put", `api/edittask/${editData}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (apiCall.status == 1) {
        await getTaskData();
        setEditableRows([]);
        setSuccessMsg("Task edited");
      }
    }
  };

  useEffect(() => {
    allDropDownData();
    const userType = localStorage.getItem("user_type");
    const adminId = localStorage.getItem("admin_id");
    if (userType && adminId) {
      setUserData({ userType: userType, adminId: adminId });
    }
    allStatus();
  }, []);

  const handleSelectChangeAssignee = async (selectedOption) => {
    console.log("selectedOptionAssignee: ", selectedOption);
    setSelectedAssignValues({
      value: selectedOption.value,
      label: selectedOption.label,
    });
  };

  const handleSelectChangeReporter = async (selectedOption) => {
    console.log("selectedOptionReporte: ", selectedOption);
    setSelectedReporterValues({
      value: selectedOption.value,
      label: selectedOption.label,
    });
  };

  const deleteTask = async (id) => {
    const data = await sendRequest(
      "put",
      `api/deletetask/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("data: ", data);
    setSuccessMsg("Task deleted");
    await getTaskData();
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            deleteTask(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  // console.log("oldData: ", oldData);

  const setInputChanged = (index) => {
    const newEditableRows = [...editableRows];
    newEditableRows[index] = true;
    setEditableRows(newEditableRows);
  };

  const allStatus = async () => {
    const data = await getAllStatus();
    getAllStatusData(data.data.data);
  };

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
              breadcumr1_link={"#"}
              // breadcumr2={"List"}
              // button_name={"Add Tasks"}
              // button_link={"/admin/tasks/add-tasks"}
            />

            <div className="max-w-full text-sm">
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

              <button
                className="btn btn-sm btn-secondary mt-2"
                onClick={addEmptyRow}
              >
                Add New Task
              </button>

              <table className="min-w-full bg-white mt-2 text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Key</th>
                    <th className="px-4 py-2 text-left">Summary</th>
                    <th className="px-4 py-2 text-left">Assignee</th>
                    <th className="px-4 py-2 text-left">Reporter</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    {/* <th className="px-4 py-2 text-left">Issue Type</th> */}
                    <th className="px-4 py-2 text-left">P</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    {/* <th className="px-4 py-2 text-left">Updated</th> */}
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {TaskData?.map((task, index) => {
                    return (
                      <tr
                        key={task.task_id}
                        className="border-b"
                        onClick={() => setEditData(task.task_id)}
                      >
                        <td className="px-4 py-2 text-left w-1">{index + 1}</td>
                        {task.task_id ? (
                          <td className="px-4 py-2 text-left w-2/6">
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={task.summary}
                                disabled={!editableRows[index]}
                                onChange={(e) => {
                                  const newData = [...TaskData];
                                  newData[index].summary = e.target.value;
                                  setTaskData(newData);
                                }}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${
                                  editableRows[index] ? "bg-gray-100" : ""
                                }`}
                              />
                              <MdEdit
                                className="ml-2 text-gray-500 cursor-pointer"
                                onClick={() => {
                                  setInputValueChanged(true);
                                  setInputChanged(index);
                                }}
                              />
                              {editableRows[index] ? (
                                <>
                                  <button
                                    className="text-green-500 ml-2 focus:outline-none"
                                    onClick={() => {
                                      // console.log()
                                      editTask(
                                        { summary: task.summary }
                                        // `Task summary changed from ${oldValue.summary} to ${task.summary}`
                                      );
                                    }}
                                  >
                                    <IoCheckmark />
                                  </button>
                                  <button
                                    className="text-red-500 ml-2 focus:outline-none"
                                    onClick={() => {
                                      setInputValueChanged(!inputValueChanged);
                                      setEditableRows([]);
                                    }}
                                  >
                                    <RxCross2 />
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        ) : (
                          <td className="px-4 py-2 text-left w-2/6">
                            <input
                              type="text"
                              value={task.summary}
                              onChange={(e) => {
                                const newData = [...TaskData];
                                newData[index].summary = e.target.value;
                                setTaskData(newData);
                              }}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            />
                          </td>
                        )}

                        <td className="px-4 py-2 text-left w-44">
                          <Select
                            options={optionsData}
                            onChange={handleSelectChangeAssignee}
                            isSearchable
                            value={
                              // selectedAssigneeValues
                              task.assigned_to
                                ? {
                                    value: task.assigned_to,
                                    label: task.assigned_to_name,
                                  }
                                : selectedAssigneeValues
                            }
                          />
                        </td>
                        <td className="px-4 py-2 text-left w-44">
                          {/* {task.reporter_name || "NA"} */}
                          <Select
                            options={optionsData}
                            onChange={handleSelectChangeReporter}
                            isSearchable
                            value={
                              task.reporter
                                ? {
                                    value: task.reporter,
                                    label: task.reporter_name,
                                  }
                                : {
                                    value: selectedReproterValues.value * 1,
                                    label: selectedReproterValues.label,
                                  }
                            }
                          />
                        </td>
                        <td className="px-1 py-2 text-left w-28">
                          <select
                            id="task_status"
                            name="task_status"
                            value={task.task_status}
                            onChange={(e) => {
                              const newData = [...TaskData];
                              newData[index].task_status = e.target.value;
                              setTaskData(newData);
                              editTask({ task_status: e.target.value });
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          >
                            {allStatusData?.map((resp, index) => (
                              <>
                                <option key={index} value={resp.project_status}>
                                  {" "}
                                  {resp.project_status}{" "}
                                </option>
                              </>
                            ))}
                            {/* <option value="Open">Open</option>
                            <option value="InReview">Review</option>
                            <option value="InProgress">In Progress</option> */}
                          </select>
                        </td>
                        {/* <td className="px-1 py-2 text-left w-28">
                          <select
                            id="priority"
                            name="priority"
                            value={task.priority}
                            onChange={(e) => {
                              const newData = [...TaskData];
                              newData[index].priority = e.target.value;
                              setTaskData(newData);
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          >
                            <option value="High">&#x1F534; High</option>
                            <option value="Medium">&#x1F7E1; Medium</option>
                            <option value="Lowest">&#x1F7E3; Lowest</option>
                          </select>
                        </td> */}
                        <td className="px-1 py-2 text-center">
                          <div className="p-2">
                            {task.priority === "High" ? (
                              <FaArrowUp className="text-green-500" />
                            ) : task.priority === "Medium" ? (
                              <MdDensityMedium className="text-orange-500" />
                            ) : task.priority === "low" ? (
                              <FaArrowDown className="text-red-500" />
                            ) : null}
                          </div>
                        </td>

                        <td className="px-4 py-2 text-left w-20">
                          <input
                            type="date"
                            className="border"
                            value={task.due_date.split("T")[0]}
                            disabled={task.due_date ? true : false}
                            onChange={(e) => {
                              const newData = [...TaskData];
                              newData[index].due_date = e.target.value;
                              setTaskData(newData);
                            }}
                          />
                        </td>
                        <td className="whitespace-nowrap px-1 py-1 text-left text-xs w-36">
                          {!task.task_id ? (
                            <button
                              className="btn btn-xs btn-warning "
                              onClick={(e) => handleSubmit(task)}
                            >
                              <Save />
                            </button>
                          ) : (
                            ""
                          )}

                          {task.task_id ? (
                            <>
                              <Link
                                href={`/admin/tasks/add-tasks?id=${task.task_id}`}
                                className="btn btn-xs btn-secondary ml-2"
                              >
                                <Eye />
                              </Link>
                              <button
                                className="btn btn-xs btn-error ml-2"
                                onClick={(e) => {
                                  deletConfirmation(task.task_id);
                                }}
                              >
                                <Trash2 />
                              </button>
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default TaskList;
