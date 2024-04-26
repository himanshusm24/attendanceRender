/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import { getDepartment } from "@/api_calls/admin/department/get-department";
import { AddDefaultMail } from "@/api_calls/admin/defaultMail/adddefaultMail";
import { getDefaultMail } from "@/api_calls/admin/defaultMail/getdefaultMail";
import { deletedefaultMail } from "@/api_calls/admin/defaultMail/deleteDefaultMail";
import { updateDefaultMail } from "@/api_calls/admin/defaultMail/updateDefaultMail";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ManageDefaultMails = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Email");
  const [email, setEmail] = useState("");
  const [defaultMailList, setDefaultMailList] = useState([]);
  const [editemailId, setEditMailId] = useState(0);
  const [render, setRerender] = useState("");

  // const [department, setDepartment] = useState("");
  // const [departmentList, setDepartmentList] = useState([]);

  const getDefaultMails = async () => {
    const data = await getDefaultMail();
    setDefaultMailList(data?.data?.data);
  };

  // const getDepartmentData = async () => {
  //   const data = await getDepartment();
  //   setDepartmentList(data?.data?.data);
  // };

  useEffect(() => {
    // getDepartmentData();
    getDefaultMails();
  }, [render]);

  const getDefaultMailsById = async (editemailId) => {
    // if (editRoleId > 0) {
    setEditMailId(editemailId);
    const data = await getDefaultMail(editemailId);
    const editData = data.data.data[0];
    if (editData) {
      setEmail(editData.email);
      // setDepartment(editData.department);
      setBtnName("Update Email");
    }
    // }
  };

  const adddefaultMails = async (event) => {
    event.preventDefault();
    if (email != "") {
      const obj = {
        email: email,
      };
      const response =
        editemailId > 0
          ? await updateDefaultMail(obj, editemailId)
          : await AddDefaultMail(obj);

      if (response.status == true && response.data.data.affectedRows == 1) {
        setSuccessMsg(response.data.message);
        setEmail("");
        setRerender("id");
        setBtnName("Add Roles");
      } else {
        setErrorMsg(response.data.message);
      }
    } else {
      setErrorMsg("Please Enter All Details");
    }
  };

  const deleteDefaultMail = async (id) => {
    const data = await deletedefaultMail(id);
    // console.log("data: ", data);
    setRerender(id);
  };

  const resetInputs = async () => {
    setEmail("");
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            deleteDefaultMail(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
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
              breadcumr1={"Manage Default Mail"}
              breadcumr1_link={"/admin/manage-default-mails"}
              breadcumr2={""}
              //   button_name={"Add Holiday"}
              //   button_link={"manage-holiday/add-holiday"}
            />
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

            <div className="mt-3">
              <div className="card">
                <div className="card-body bg-white py-2">
                  <form
                    onSubmit={adddefaultMails}
                    method="post"
                    autoComplete="off"
                  >
                    <div className="gap-2 grid md:grid-cols-1 md:space-y-0">
                      {/* <div className="w-full">
                        <div className="label">
                          <span className="label-text">Department</span>
                        </div>
                        <select
                          className="input input-bordered select select-bordered w-full"
                          name="department"
                          value={department}
                          required={true}
                          onChange={(e) => {
                            setDepartment(e.target.value);
                          }}
                        >
                          <option value="" disabled>
                            Select Department
                          </option>
                          {departmentList?.map((res, index) => (
                            <option key={index} value={res.id}>
                              {res.name}
                            </option>
                          ))}
                        </select>
                      </div> */}
                      <div className="w-full">
                        <div className="label">
                          <span className="label-text">Emails</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter Emails"
                          className="input input-bordered w-full"
                          name="name"
                          required={true}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          value={email}
                        />
                      </div>

                      <div className="w-full">
                        <button
                          type="submit"
                          className="btn web-btn text-white sm:mt-0 md:mt-4"
                        >
                          {btnName}
                        </button>
                        <button
                          type="reset"
                          className="btn btn-warning mx-5 px-8"
                          onClick={() => resetInputs()}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="card-body p-0 pt-4">
                  {defaultMailList && defaultMailList.length > 0 ? (
                    <table className="w-full divide-y divide-gray-400 p-2">
                      <thead className="bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                          >
                            <span>Emails</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {defaultMailList.map((res, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap text-center px-4 py-4">
                              {res.email}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={(e) => getDefaultMailsById(res.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error ml-2"
                                onClick={(e) => {
                                  deletConfirmation(res.id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="divide-y divide-gray-200 bg-white text-center p-4">
                      <h1>List is Empty</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManageDefaultMails;
