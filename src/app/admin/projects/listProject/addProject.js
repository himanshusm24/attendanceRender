"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createLog } from "@/api_calls/taskLogs/createTaskLog";

const AddProject = ({ closeModal }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const params = useSearchParams();
  const router = useRouter();
  const [btn, setBtn] = useState("Create Project");
  // const [isOpen, setIsopen] = useState(props.isopen);

  const [task, setTask] = useState({
    project_name: "",
    description: "",
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
    if (!task.project_name) {
      return;
    }
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("admin_id");
    let sendData = {
      project_name: task.project_name,
    };

    let data = await sendRequest("post", "api/addProject", sendData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await createLog(adminId, `new project ${sendData.project_name}`, "post");

    setSuccessMsg(data.data.message);
    setTask({
      project_name: "",
      description: "",
    });
    if (data.status == 1) {
      setSuccessMsg("Project Created");
      //alert("close")
      closeModal();
      // setIsopen(false);
      //props.closeModal("close");
      // router.push("/admin/projects/listProject");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  return (
    <>
      {/* {showModal && ( */}
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

              <h1 className="text-2xl font-semibold mb-4">Create Project</h1>
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
                <div className="mb-2">
                  <label htmlFor="label" className="label-text">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div>
                  {/* <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button> */}
                  <button
                    type="submit"
                    className="btn web-btn text-white sm:mt-0 md:mt-4"
                  >
                    {btn}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      {/* )} */}
    </>
  );
};

export default AddProject;
