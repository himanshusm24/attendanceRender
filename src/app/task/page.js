/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdDensityMedium } from "react-icons/md";
import { useRouter } from "next/navigation";
import TaskHeader from "@/components/taskHeader/page";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FilterListIcon from "@mui/icons-material/FilterList";
import DynamicOffCanvas from "@/components/searchFilter/page";

const Task = () => {
  const [allocatedTasks, setAllocatedTasks] = useState([]);
  const router = useRouter();
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [isOpenOffCanvasStatus, setIsOpenOffCanvasProject] = useState(false);
  // const [isOpenOffCanvas]

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleTaskList();
    handleprojectDropdownData();
  }, []);

  const handleTaskList = async () => {
    const userId = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/getTask?user_id=${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedTasks(data?.data?.data);
  };

  const filterTaskList = async (project_id) => {
    const userId = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/getTask?user_id=${userId}&project_id=${project_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedTasks(data?.data?.data);
  };

  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["All task", "Open task", "In progress"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => console.log("working")}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  const handleprojectDropdownData = async () => {
    const data = await sendRequest(
      "get",
      "api/getProject",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("handleprojectDropdownData: ", data.data.data);
    const dropdownData = data.data.data.map(
      ({ project_id, project_name, description }) => ({
        id: project_id,
        name: project_name,
        description: description,
        type: "projectDropdown",
      })
    );
    setProjectDropdownData(dropdownData);
  };

  const handleCloseProject = () => {
    setIsOpenOffCanvasProject(false);
  };
  const handleToggleProject = () => {
    setIsOpenOffCanvasProject(!isOpenOffCanvasStatus);
  };
  const handleProjectData = async (data) => {
    console.log("data: ", data);
    await filterTaskList(data.id);
  };

  const handleToggleStatus = () => {

  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data">
        <TaskHeader page_name={"home"} />
        <div className="task-searchbar">
          <input
            type="text"
            placeholder="Search tasks"
            className=" w-full font-normal"
            // value={subject}
            // onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="bg-white p-2 shadow-md">
          <p className="font-bold">Tasks</p>
        </div>

        {/* search filter */}
        <div className="grid grid-cols-5">
          <div className=" col-span-4">
            {/* <input
              type="text"
              placeholder="Search..."
              className="p-2 col-span-4 w-full mt-2"
            ></input> */}
            <button
              className="web-btn w-full p-2"
              onClick={() => handleToggleProject()}
            >
              Select Project
            </button>
            <DynamicOffCanvas
              anchor="bottom"
              isOpen={isOpenOffCanvasStatus}
              onClose={handleCloseProject}
              menuItems={projectDropdownData}
              sendData={handleProjectData}
            />
          </div>
          <div className="col-span-1">
            <label className=" items-center font-bold my-1 ">
              {/* {["bottom"].map((anchor) => (
                <React.Fragment key={anchor}>
                  <Button onClick={toggleDrawer(anchor, true)}>
                    {<FilterListIcon />}
                  </Button>
                  <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                  >
                    {list(anchor)}
                  </Drawer>
                </React.Fragment>
              ))} */}
            </label>
            <button className=" p-2" 
            // onClick={() => handleToggleProject()}
            >
              <FilterListIcon />
            </button>
          </div>
        </div>

        {allocatedTasks.map((res, index) => (
          <div
            key={index}
            className="pt-2"
            onClick={() =>
              router.push(`/task/task-detail?taskId=${res.task_id}`)
            }
          >
            <div className="bg-white rounded-lg shadow-md grid grid-cols-5">
              <div className="ml-4 col-span-1 mt-4">
                {res.priority === "High" ? (
                  <FaArrowUp className="text-green-500" />
                ) : res.priority === "Medium" ? (
                  <MdDensityMedium className="text-orange-500" />
                ) : res.priority === "low" ? (
                  <FaArrowDown className="text-red-500" />
                ) : null}
              </div>
              <div className="py-2 px-2 col-span-4">
                <p className="text-sm font-semibold break-words">
                  {res?.summary}
                </p>
                <p className="text-sm">SI-{res.task_id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Task;
