/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import CompanyHeader from "@/components/admin/companyHeader/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { CompanyLists } from "@/api_calls/admin/company/company-list";

import { AddDepartment } from "@/api_calls/admin/department/add-department";
import { getDepartment } from "@/api_calls/branch/department/get-department";
import { updateDepartment } from "@/api_calls/admin/department/update-department";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { deleteDepartment } from "@/api_calls/admin/department/delete-department";

const ManageDepartment = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Department");
  const [departmentName, setDepartmentName] = useState("");
  const [company, setCompany] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [editRoleId, setEditRoleId] = useState(0);
  const [render, setRerender] = useState("");
  const [showData, setShowData] = useState(true);

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data.data.data;
    setCompanyList([...companyList, ...list]);
  };

  const getDepartmentData = async () => {
    const data = await getDepartment();
    setDepartmentList(data?.data?.data);
  };

  useEffect(() => {
    getCompanyList();
    getDepartmentData();
  }, [render]);

  const getRolesById = async (editRoleId) => {
    setShowData(false);
    setEditRoleId(editRoleId);
    const data = await getDepartment(editRoleId);
    const editData = data.data.data[0];
    if (editData) {
      setDepartmentName(editData.name);
      setCompany(editData.company_id);
      setBtnName("Update Role");
    }
  };

  const addRoles = async (event) => {
    event.preventDefault();
    if (departmentName != "") {
      const obj = {
        company_id: localStorage.getItem('companyAdmin_id'),
        name: departmentName,
      };
      const response =
        editRoleId > 0
          ? await updateDepartment(obj, editRoleId)
          : await AddDepartment(obj);

      if (response.status == true && response.data.data.affectedRows == 1) {
        setSuccessMsg(response.data.message);
        setCompany("");
        setDepartmentName("");
        setRerender("id");
        setBtnName("Add Roles");
      } else {
        setErrorMsg(response.data.message);
      }
      setShowData(true);
    } else {
      setErrorMsg("Please Enter All Details");
    }
  };

  const resetInputs = async () => {
    setCompany("");
    setDepartmentName("");
  };


  const deleteDepartmentHandale = async (id) => {
    await deleteDepartment(id);
    getDepartmentData();
  };


  const deletConfirmation = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: (e) => {
            deleteDepartmentHandale(id);
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ],
    });
  };

  return (
    <>
      <div className="main-wrapper">
        <CompanySidebar
          sidemenu={`${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"
            }`}
        />
        <div className="rightside">
          <CompanyHeader
            clickEvent={() => {
              setSidebarVisible(!isSidebarVisible);
            }}
            sidebarVisible={isSidebarVisible}
          />
          <section className="mx-auto w-full max-w-7xl">
            <BreadCrum
              breadcumr1={"Manage Department"}
              breadcumr1_link={"/branch/manage-department"}
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
                    <div className="gap-2 grid md:grid-cols-2 md:space-y-0 my-3">
                      {/* <div className="w-full">
                        <div className="label">
                          <span className="label-text">Company</span>
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
                            Select company
                          </option>
                          {companyList?.map((res, index) => (
                            <option key={index} value={res.id}>
                              {res.name}
                            </option>
                          ))}
                        </select>
                      </div> */}

                      <div className="w-full">
                        <input
                          type="text"
                          placeholder="Department Name"
                          className="input input-bordered w-full"
                          name="name"
                          maxLength={15}
                          required={true}
                          onChange={(e) => {
                            setDepartmentName(e.target.value);
                          }}
                          value={departmentName}
                        />
                      </div>

                      <div className="w-full">
                        <button
                          type="submit"
                          className="btn web-btn text-white"
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

                {
                  (showData) ?
                    <div className="card-body p-0 pt-4">
                      {departmentList && departmentList.length > 0 ? (
                        <table className="w-full divide-y divide-gray-400 p-2">
                          <thead className="bg-gray-200">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                              >
                                <span>Branch</span>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                              >
                                <span>Department</span>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-right text-sm font-normal text-gray-700"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {departmentList.map((res, index) => (
                              <tr key={index}>
                                <td className="whitespace-nowrap px-4 py-4">
                                  {res.company_name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  {res.name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={(e) => getRolesById(res.id)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error ml-2"
                                    onClick={(e) => { deletConfirmation(res.id) }}
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
                    : ""
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManageDepartment;
