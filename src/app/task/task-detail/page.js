/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdDensityMedium } from "react-icons/md";
import TaskHeader from "@/components/taskHeader/page";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import Image

import DynamicOffCanvas from "@/components/searchFilter/page";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TaskDetail = () => {
  const [taskDetail, setTaskDetail] = useState([]);
  const [summary, setSummary] = useState("");
  const [task_status, setTaskStatus] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [priority, setPriority] = useState("");
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [projectStatusDetail, setProjectStatusDetail] = useState([]);

  const [searchFilterOpen, setSearchFilterOpen] = useState(false);
  const [summaryChanged, setSummaryChanged] = useState(false);
  const [descriptionChanged, setDescriptionChanged] = useState(false);
  const [allocatedUserDataAssignee, setAllocatedUserDataAssignee] = useState(
    []
  );
  const [allocatedUserDataReporter, setAllocatedUserDataReporter] = useState(
    []
  );
  const [attchmentData, setAttachmentData] = useState([]);

  const params = useSearchParams();
  const taskId = params.get("taskId");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleTaskList();
    allStatus();
  }, []);

  const handleTaskList = async () => {
    const data = await sendRequest(
      "get",
      `api/getTask?task_id=${taskId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTaskDetail(data?.data?.data[0]);
    const newData = data?.data?.data[0];
    setSummary(newData.summary);
    setTaskStatus(newData.task_status);
    setDescription(newData.description);
    setIssueType(newData.issue_type);
    setAssignee(newData.assigned_to_name);
    setReporter(newData.reporter_name);
    setPriority(newData.priority);
    setAttachmentData(data?.data?.attchmentData);
    await allocatedUser(newData.project_id);
  };

  const allStatus = async () => {
    const data = await sendRequest(
      "get",
      "api/getProjectStatus",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setProjectStatusData(data.data.data);
    const formattedData = data.data.data.map(({ id, project_status }) => ({
      id,
      name: project_status,
      type: "project_status",
    }));
    setProjectStatusDetail(formattedData);
  };

  const [isOpenOffCanvasIssue, setIsOpenOffCanvasIssue] = useState(false);
  const [isOpenOffCanvasStatus, setIsOpenOffCanvasStatus] = useState(false);
  const [isOpenOffCanvasAssignee, setIsOpenOffCanvasAssignee] = useState(false);
  const [isOpenOffCanvasReporter, setIsOpenOffCanvasReporter] = useState(false);
  const [isOpenOffCanvasPriority, setIsOpenOffCanvasPriority] = useState(false);

  const handleToggleIssue = () => {
    setIsOpenOffCanvasIssue(!isOpenOffCanvasIssue);
  };
  const handleToggleStatus = () => {
    setIsOpenOffCanvasStatus(!isOpenOffCanvasStatus);
  };
  const handleToggleAssignee = () => {
    setIsOpenOffCanvasAssignee(!isOpenOffCanvasAssignee);
  };
  const handleToggleReporter = () => {
    setIsOpenOffCanvasReporter(!isOpenOffCanvasReporter);
  };
  const handleTogglePriority = () => {
    setIsOpenOffCanvasPriority(!isOpenOffCanvasPriority);
  };

  const handleCloseIssue = () => {
    setIsOpenOffCanvasIssue(false);
  };
  const handleCloseStatus = () => {
    setIsOpenOffCanvasStatus(false);
  };
  const handleCloseAssignee = () => {
    setIsOpenOffCanvasAssignee(false);
  };
  const handleCloseReporter = () => {
    setIsOpenOffCanvasReporter(false);
  };
  const handleClosePriority = () => {
    setIsOpenOffCanvasPriority(false);
  };

  const handleProjectStatus = async (data) => {
    console.log("data: ", data);
    await editTask(data);
  };

  const IssueData = [
    {
      id: 1,
      type: "Issue",
      name: "Bug",
    },
    {
      id: 2,
      type: "Issue",
      name: "Improvement",
    },
    {
      id: 3,
      type: "Issue",
      name: "New Feature",
    },
  ];
  const PriorityData = [
    {
      id: 1,
      type: "priority",
      name: "High",
    },
    {
      id: 2,
      type: "priority",
      name: "Medium",
    },
    {
      id: 3,
      type: "priority",
      name: "Low",
    },
  ];

  const editTask = async (data) => {
    // console.log("data: ", data);
    let obj = {};
    if (data.type == "project_status") {
      obj = { task_status: data.name };
    }
    if (data.type == "Issue") {
      obj = { issue_type: data.name };
    }
    if (data.type == "priority") {
      obj = { priority: data.name };
    }
    if (data.type == "description") {
      obj = { description: description };
    }
    if (data.type == "summary") {
      obj = { summary: summary };
    }
    if (data.type == "allocatedUser") {
      obj = { assigned_to: data.id };
    }
    if (data.type == "reporter") {
      obj = { reporter: data.id };
    }
    // console.log("obj: ", obj);
    let apiCall = await sendRequest("put", `api/edittask/${taskId}`, obj, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("apiCall: ", apiCall);
    if (apiCall.status == 1) {
      setSummaryChanged(false);
      setDescriptionChanged(false);
      await handleTaskList();
    }
  };

  const allocatedUser = async (project_id) => {
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUserassingee?projectId=${project_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("allocatedUser: ", data);
    const assigneeData = data.data.data.map(({ userId, name, project_id }) => ({
      id: userId,
      name: name,
      type: "allocatedUser",
      project_id: project_id,
    }));
    const reporterData = data.data.data.map(({ userId, name, project_id }) => ({
      id: userId,
      name: name,
      type: "reporter",
      project_id: project_id,
    }));
    setAllocatedUserDataAssignee(assigneeData);
    setAllocatedUserDataReporter(reporterData);
  };

  const autoSize = (element) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const uploadAttachment = async (event) => {
    if (taskId) {
      const file = event.target.files[0];
      let formData = new FormData();
      formData.append("attachment", file);
      console.log("formData: ", formData);
      const data = await sendRequest(
        "post",
        `api/uploadAttachment/${taskId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("data", data);
      // await createLog(
      //   adminId,
      //   `Task attachment added`,
      //   "put",
      //   JSON.stringify(oldValue),
      //   JSON.stringify(file),
      //   task_id,
      //   "task"
      // );
      // fetchData();
    }
  };

  // function renderFile(fileData) {
  //   if (typeof fileData === "string" && isValidURL(fileData)) {
  //     if (fileData.endsWith(".png") || fileData.endsWith(".jpg")) {
  //       return (
  //         <Image
  //           className="flex"
  //           src={fileData}
  //           alt="file"
  //           width={200}
  //           height={200}
  //         />
  //       );
  //     } else if (fileData.endsWith(".pdf")) {
  //       return (
  //         <div>
  //           <FaRegFilePdf />
  //         </div>
  //       );
  //     } else if (fileData.endsWith(".csv") || fileData.endsWith(".xlsx")) {
  //       return (
  //         <p>
  //           <GrDocumentCsv />
  //         </p>
  //       );
  //     }
  //   }
  //   return <p>Unsupported file</p>;
  // }

  // function isValidURL(string) {
  //   try {
  //     new URL(string);
  //     return true;
  //   } catch (_) {
  //     return false;
  //   }
  // }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data ">
      <TaskHeader page_name={"home"} />
      <div className="px-2">
        {/* first box */}
        <div className="pt-2">
          <p className="text-xs ml-2">SI-{taskDetail.task_id}</p>
          <div className="grid grid-cols-5 ml-2">
            <div className="mb-2 col-span-4">
              <textarea
                type="text"
                id="summary"
                name="summary"
                placeholder="Summary"
                disabled={!summaryChanged}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  autoSize(e.target);
                }}
                ref={(textarea) => {
                  if (textarea) autoSize(textarea);
                }}
                className="w-full px-3 border rounded-md focus:outline-none focus:border-blue-500 taskTextArea"
              />
              <MdEdit
                className="ml-2 text-gray-500 cursor-pointer"
                onClick={() => {
                  setSummaryChanged(!summaryChanged);
                }}
              />
              {summaryChanged ? (
                <>
                  <button
                    className="ml-2 bg-blue-200 text-lg"
                    onClick={async () => {
                      editTask({ summary: summary, type: "summary" });
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
          </div>
          <div className="grid grid-cols-3">
            <label className=" w-full border rounded-md focus:outline-none focus:border-blue-500">
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleStatus}
              >
                {task_status}
              </button>
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasStatus}
                onClose={handleCloseStatus}
                menuItems={projectStatusDetail}
                sendData={handleProjectStatus}
              />
            </label>
          </div>

          <div className=" text-xs p-2">
            <label htmlFor="label" className="label-text text-xs">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 taskTextArea"
              name="description"
              disabled={!descriptionChanged}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                autoSize(e.target);
              }}
              ref={(textarea) => {
                if (textarea) autoSize(textarea);
              }}
              placeholder="Add a description"
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
                    editTask({ type: "description", description: description });
                  }}
                >
                  <IoCheckmark />
                </button>
                <button
                  className="ml-2 bg-red-200 text-lg"
                  onClick={() => setDescriptionChanged(!descriptionChanged)}
                >
                  <RxCross2 />
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label htmlFor="label" className="label-text text-xs">
            Attachment
          </label>
          <br />
          <div className="grid grid-cols-5">
            {/* {attchmentData?.map((fileData, index) => (
              <div
                className="w-24 px-2 cursor-pointer justify-center items-center text-6xl"
                key={index}
              >
                {index + 1}
                <a
                  href={fileData.files}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {renderFile(fileData.files)}
                </a>
              </div>
            ))} */}
          </div>
          <br />
          {/* <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button> */}
          <input
            accept="image/*"
            type="file"
            className="file-input file-input-ghost w-full max-w-xs"
            onChange={uploadAttachment}
          />
        </div>

        {/* Second box */}
        <div>
          <div className="grid grid-cols-2">
            <div className="p-2">
              <label htmlFor="label" className="label-text text-xs">
                Issue Type
              </label>
              <br />
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasIssue}
                onClose={handleCloseIssue}
                menuItems={IssueData}
                sendData={handleProjectStatus}
              />
              <button onClick={handleToggleIssue}>{issueType}</button>
            </div>

            <div className="p-2">
              <label htmlFor="label" className=" text-xs">
                Priority
              </label>
              <br />
              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasPriority}
                onClose={handleClosePriority}
                menuItems={PriorityData}
                sendData={handleProjectStatus}
              />
              <button onClick={handleTogglePriority}>{priority}</button>
              {/* <p>{priority}</p> */}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-2">
              <label htmlFor="label" className=" text-xs">
                Assignee
              </label>
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleAssignee}
              >
                {assignee}
              </button>

              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasAssignee}
                onClose={handleCloseAssignee}
                menuItems={allocatedUserDataAssignee}
                sendData={handleProjectStatus}
              />
            </div>
            <div className="p-2">
              <label htmlFor="label" className=" text-xs">
                Reporter
              </label>
              <button
                className=" w-full p-2 bg-gray-500 border rounded-xl text-white"
                onClick={handleToggleReporter}
              >
                {reporter}
              </button>

              <DynamicOffCanvas
                anchor="bottom"
                isOpen={isOpenOffCanvasReporter}
                onClose={handleCloseReporter}
                menuItems={allocatedUserDataReporter}
                sendData={handleProjectStatus}
              />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="p-2">
              <label htmlFor="label" className=" text-xs">
                Due Date
              </label>
              <p>{moment(taskDetail?.due_date).format("DD/MM/YYYY")}</p>
            </div>
            <div className="p-2">
              <label htmlFor="label" className=" text-xs">
                Created
              </label>
              <p>{moment(taskDetail?.created_at).format("DD/MM/YYYY")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
