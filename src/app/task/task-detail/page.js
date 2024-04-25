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
import SearchFilter from "@/components/searchFilter/page";

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

const TaskDetail = () => {
  const [taskDetail, setTaskDetail] = useState([]);
  const [summary, setSummary] = useState("");
  const [task_status, setTaskStatus] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [reporter, setReporter] = useState("");
  const [priority, setPriority] = useState("");

  const [searchFilterOpen, setSearchFilterOpen] = useState(false);

  const params = useSearchParams();
  const taskId = params.get("taskId");

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
      `api/getTask?task_id=${taskId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("data: ", data.data.data[0]);
    setTaskDetail(data?.data?.data[0]);
    const newData = data?.data?.data[0];
    setSummary(newData.summary);
    setTaskStatus(newData.task_status);
    setDescription(newData.description);
    setIssueType(newData.issue_type);
    setAssignee(newData.assigned_to_name);
    setReporter(newData.reporter_name);
    setPriority(newData.priority);
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
        {[
          "Reopen issue > Open",
          "open-in-review > In Review",
          "Direct Done > Done",
        ].map((text, index) => (
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
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data ">
      <TaskHeader page_name={"home"} />
      <div className="px-2">
        {/* first box */}
        <div className="pt-2">
          <p>SI-8</p>
          <div className="grid grid-cols-5">
            <div className="mb-2 col-span-4">
              <input
                type="text"
                id="summary"
                name="summary"
                placeholder="Summary"
                value={summary}
                //   onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3">
            {/* <select
              id="task_status"
              name="task_status"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={task_status}
              // onClick={() => setSearchFilterOpen(true)}
            >
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
            </select> */}
            <label className=" w-full border rounded-md focus:outline-none focus:border-blue-500">
              {/* <input
                type="text"
                placeholder="Search"
                className=" w-full font-normal"
                // value={subject}
                // onChange={(e) => setSubject(e.target.value)}
              /> */}
              {["bottom"].map((anchor) => (
                <React.Fragment key={anchor}>
                  <Button onClick={toggleDrawer(anchor, true)}>
                    {
                      <input
                        type="text"
                        placeholder="Status"
                        className=" w-full font-normal p-2"
                        // value={subject}
                        // onChange={(e) => setSubject(e.target.value)}
                      />
                    }
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

          <div className="mb-2 text-xs mt-4">
            <label htmlFor="label" className="label-text">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              name="description"
              //   disabled={!descriptionChanged}
              value={description}
              //   onChange={handleChange}
              placeholder="Add a description"
            ></textarea>
          </div>
        </div>

        {/* Second box */}
        <div>
          <div className="p-2">
            <label htmlFor="label" className="label-text text-xs">
              Issue Type
            </label>
            <p>
              <FaArrowUp className="text-green-500" /> {issueType}
            </p>
          </div>
          <div className="p-2">
            <label htmlFor="label" className=" text-xs">
              Assignee
            </label>
            <p>{assignee}</p>
          </div>
          <div className="p-2">
            <label htmlFor="label" className=" text-xs">
              Reporter
            </label>
            <p>{reporter}</p>
          </div>
          <div className="p-2">
            <label htmlFor="label" className=" text-xs">
              Priority
            </label>
            <p>{priority}</p>
          </div>
          <div className="p-2">
            <label htmlFor="label" className=" text-xs">
              Due Date
            </label>
            <p>{moment(taskDetail.due_date).format("DD/MM/YYYY")}</p>
          </div>
          <div className="p-2">
            <label htmlFor="label" className=" text-xs">
              Created
            </label>
            <p>{moment(taskDetail.created_at).format("DD/MM/YYYY")}</p>
          </div>
        </div>
      </div>

      {/* {searchFilterOpen == true ? <SearchFilter /> : ""} */}
    </div>
  );
};

export default TaskDetail;
