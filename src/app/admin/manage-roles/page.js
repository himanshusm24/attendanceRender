/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { AddRole } from "@/api_calls/admin/roles/add-roles";
import { getRole } from "@/api_calls/admin/roles/get-roles";
import { updateRoles } from "@/api_calls/admin/roles/update-roles";
import { deleteRoles } from "@/api_calls/admin/roles/delete-roles";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ManageRoles = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Roles");
  const [roleName, setRoleName] = useState("");
  const [company, setCompany] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [editRoleId, setEditRoleId] = useState(0);
  const [render, setRerender] = useState("");

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data?.data?.data ?? [];
    setCompanyList([...companyList, ...list]);
  };

  const getRoles = async () => {
    const data = await getRole();
    setRolesList(data?.data?.data);
  };

  useEffect(() => {
    getCompanyList();
    getRoles();
  }, [render]);

  const getRolesById = async (editRoleId) => {
    // if (editRoleId > 0) {
    setEditRoleId(editRoleId);
    const data = await getRole(editRoleId);
    const editData = data.data.data[0];
    if (editData) {
      setRoleName(editData.name);
      setCompany(editData.company_id);
      setBtnName("Update Role");
    }
    // }
  };

  const addRoles = async (event) => {
    event.preventDefault();
    if (company != "" && roleName != "") {
      const obj = {
        company_id: company,
        name: roleName,
      };
      const response =
        editRoleId > 0
          ? await updateRoles(obj, editRoleId)
          : await AddRole(obj);

      if (response.status == true && response.data.data.affectedRows == 1) {
        setSuccessMsg(response.data.message);
        setCompany("");
        setRoleName("");
        setRerender("id");
        setBtnName("Add Roles");
      } else {
        setErrorMsg(response.data.message);
      }
    } else {
      setErrorMsg("Please Enter All Details");
    }
  };

  const deleteRolesHandle = async (deleteRoleId) => {
    const obj = {};
    const data = await deleteRoles(obj, deleteRoleId);
    console.log("data: ", data);
    setRerender(deleteRoleId);
  };

  const resetInputs = async () => {
    setCompany("");
    setRoleName("");
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: (e) => {
            deleteRolesHandle(id);
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
              breadcumr1={"Manage Roles"}
              breadcumr1_link={"/admin/manage-roles"}
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
                  <form onSubmit={addRoles} method="post" autoComplete="off">
                    <div className="gap-2 grid md:grid-cols-2 md:space-y-0">
                      <div className="w-full">
                        <div className="label">
                          <span className="label-text">Branch</span>
                        </div>
                        <select
                          className="input input-bordered select select-bordered w-full"
                          name="company"
                          value={company}
                          required={true}
                          onChange={(e) => {
                            setCompany(e.target.value);
                          }}
                        >
                          <option value="" disabled>
                            Select Branch
                          </option>
                          {companyList?.map((res, index) => (
                            <option key={index} value={res.id}>
                              {res.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full">
                        <div className="label">
                          <span className="label-text">Role</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Role Name"
                          className="input input-bordered w-full"
                          name="name"
                          //   minLength={5}
                          maxLength={15}
                          required={true}
                          onChange={(e) => {
                            setRoleName(e.target.value);
                          }}
                          value={roleName}
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
                  {rolesList && rolesList.length > 0 ? (
                    <table className="w-full divide-y divide-gray-400 p-2">
                      <thead className="bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                          >
                            <span>Branch</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                          >
                            <span>Role</span>
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
                        {rolesList.map((res, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap text-center px-4 py-4">
                              {res.company_name}
                            </td>
                            <td className="whitespace-nowrap text-center px-4 py-4">
                              {res.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={(e) => getRolesById(res.id)}
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

export default ManageRoles;
