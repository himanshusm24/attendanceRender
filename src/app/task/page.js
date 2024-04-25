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

const Task = () => {
  const [allocatedTasks, setAllocatedTasks] = useState([]);
  const router = useRouter();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleTaskList();
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
            <input
              type="text"
              placeholder="Search..."
              className="p-2 col-span-4 w-full mt-2"
            ></input>
          </div>
          <div className="col-span-1">
            <label className=" items-center font-bold my-1 ">
              {["bottom"].map((anchor) => (
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
              ))}
            </label>
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
                <p className="text-sm font-semibold">{res?.summary}</p>
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
