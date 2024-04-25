"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const AddTask = ({ closeModal, taskid }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const params = useSearchParams();
  const router = useRouter();
  const [btn, setBtn] = useState("Create");

  // const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    project_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.project_name && taskid == null) {
      return;
    }
    const token = localStorage.getItem("token");
    let sendData = {
      project_name: task.project_name,
      parent_project_id: taskid,
    };

    let data = await sendRequest("post", "api/addSubProject", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuccessMsg(data.data.message);
    setTask({
      project_name: "",
    });
    console.log("data: ", data);
    if (data.status == 1) {
      // closeModal(data);
      // router.push("/admin/projects/listProject");
    }
  };

  const getProjectDetails = async () => {
    const project_id = params.get("project_id");
    const token = localStorage.getItem("token");
    if (project_id > 0) {
      const data = await sendRequest(
        "get",
        `api/getProject?project_id=${project_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log("data: ", data);
      const projectData = data?.data?.data[0];
      // setBtn("Update Project");
      setTask({
        project_name: projectData.project_name,
        description: projectData.description,
      });
    }
  };

  // useEffect(() => {
  //   getProjectDetails();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  return (
    <>
      <div className="main-wrapper">
        <section className="mx-auto w-full max-w-7xl">
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

            <h1 className="text-2xl font-semibold mb-4">Create Sub Project</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="label" className="label-text">
                  Project *
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={task.project_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="btn web-btn text-white sm:mt-0 md:mt-4"
              >
                {btn}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddTask;
