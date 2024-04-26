/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { sendRequest } from "@/api_calls/sendRequest";
import moment from "moment";

const Projects = () => {
  const [allocatedProjects, setAllocatedProjects] = useState([]);

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    handleUserList();
  }, []);

  const handleUserList = async () => {
    const userId = localStorage.getItem("user_id");
    const data = await sendRequest(
      "get",
      `api/getallocatedProjectUser?userId=${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAllocatedProjects(data?.data?.data);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data px-1">
      <Header page_name={"home"} />
      <div className="bg-white p-2 shadow-md">
        <p className="font-bold">Projects</p>
      </div>

      <div className="card w-full bg-base-100 shadow-xl mt-2">
        <div className="card-body">
          {allocatedProjects.map((res, index) => (
            <span key={index} className="">
              <p className="font-bold">
                {index + 1 + ". "} {res?.project_name}
              </p>
              <br />
              Start Date -{moment(res?.startDate).format("DD/MM/YYYY") + ", "}
              <br /> End Date - {moment(res?.endDate).format("DD/MM/YYYY")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
