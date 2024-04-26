"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { sendRequest } from "@/api_calls/sendRequest";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const AddProject = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const params = useSearchParams();
  const router = useRouter();
  const [btn, setBtn] = useState("Create Project");

  // const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    branch: "",
    department: "",
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
    const token = localStorage.getItem("token");
    let sendData = {
      project_name: task.project_name,
      description: task.description,
      branch: task.branch,
      department: task.department,
    };
    const project_id = params.get("project_id");
    let data;
    if (project_id > 0) {
      data = await sendRequest("put", `api/editProject/${project_id}`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      data = await sendRequest("post", "api/addProject", sendData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    console.log("data: ", data);
    setSuccessMsg(data.data.message);
    setTask({
      branch: "",
      department: "",
      project_name: "",
      description: "",
    });
    if (data.status == 1) {
      router.push("/admin/projects/listProject");
    }
  };

  const allDropDownData = async () => {
    const token = localStorage.getItem("token");
    const departmentList = await sendRequest(
      "get",
      "api/department",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const companyList = await sendRequest(
      "get",
      "api/company",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDepartmentData(departmentList?.data?.data);
    setCompanyData(companyList?.data?.data);
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
      setBtn("Update Project");
      setTask({
        branch: projectData.branchId,
        department: projectData.departmentId,
        project_name: projectData.project_name,
        description: projectData.description,
      });
    }
  };

  useEffect(() => {
    allDropDownData();
    getProjectDetails();
  }, []);

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
              breadcumr1={"Manage Project"}
              breadcumr1_link={"/admin/projects/addProject"}
              breadcumr2={"Add"}
              button_name={"Project List"}
              button_link={"/admin/projects/listProject"}
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

              <h1 className="text-2xl font-semibold mb-4">Create Project</h1>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="mb-2">
                    <label htmlFor="label" className="label-text">
                      Branch
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      name="branch"
                      value={task.branch}
                      onChange={handleChange}
                    >
                      <option value="">Select Company</option>
                      {companyData?.map((res, index) => (
                        <option key={index} value={res.id}>
                          {res.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="label" className="label-text">
                      Department
                    </label>

                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      name="department"
                      value={task.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departmentData?.map((res, index) => (
                        <option key={index} value={res.id}>
                          {res.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="label" className="label-text">
                    Project
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
      </div>
    </>
  );
};

export default AddProject;
