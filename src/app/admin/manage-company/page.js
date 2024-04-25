/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import moment from "moment/moment";

const ManageCompany = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    getcompanyList();
  }, []);

  const getcompanyList = async () => {
    const data = await CompanyLists();
    const details = data.data.data;
    setCompanyList(details);
  };

  let totalEmployees = 0;
  const totalEmployeeCount = async () => {
    companyList.forEach((company) => {
      totalEmployees += company.user_count;
    });
  };
  totalEmployeeCount();
  // console.log("totalEmployees: ", totalEmployees);

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
              breadcumr1={"Manage Branch"}
              breadcumr1_link={"/admin/manage-company"}
              breadcumr2={""}
              button_name={"Add Branch"}
              button_link={"manage-company/add-company"}
            />
            <div className="mt-3">
              <div className="card">
                <div className="card-header bg-white p-3 pb-4 border">
                  <div className="grid grid-cols-5 gap-8 justify-between">
                    <h3 className="font-bold">Branch List</h3>
                    <button className="btn btn-neutral text-white">
                      Total Branch: {companyList?.length}
                    </button>
                    <button className="btn btn-neutral text-white">
                      Total Employees: {totalEmployees}
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  {companyList && companyList.length > 0 ? (
                    <table className="w-full divide-y divide-gray-200 p-2">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-2 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            <span>Name</span>
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            <span>Employees</span>
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            <span>Contact</span>
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-2 text-center text-sm font-normal text-gray-700"
                          >
                            Address
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            Clock-in
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            Check-out
                          </th>
                          {/* <th
                            scope="col"
                            className="px-2 py-2 text-center text-sm font-normal text-gray-700 "
                          >
                            Status
                          </th> */}
                          <th
                            scope="col"
                            className="px-2 py-2 text-right text-sm font-normal text-gray-700 "
                          >
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {companyList.map((person, index) => (
                          <tr key={person.id}>
                            <td className=" px-2 py-4 text-center">
                              {person.name}
                            </td>
                            <td className="px-2 py-4 text-center">
                              {person.user_count}
                            </td>
                            <td className=" px-2 py-4 text-center">
                              {person.email} <br />
                              +91 {person.contact}
                            </td>
                            <td
                              className="px-2 py-4 text-center w-56"
                              style={{ wordBreak: "break-word" }}
                            >
                              <label className="text-sm ">
                                {person.address}
                              </label>
                            </td>
                            <td className="px-2 py-4 text-center">
                              {moment(person.checkin_time, "HH:mm:ss").format(
                                "H:mm"
                              )}
                            </td>
                            <td className="px-2 py-4 text-center">
                              {moment(person.checkout_time, "HH:mm:ss").format(
                                "H:mm"
                              )}
                            </td>
                            {/* <td className=" px-2 py-4  text-center">
                              <span className="inline-flex rounded-md bg-green-200 px-2 py-1 text-xs font-semibold leading-5 text-green-800">
                                {person.status == 1 ? "Active" : "Disabled"}
                              </span>
                            </td> */}
                            <td className=" px-2 py-4 text-center text-sm font-medium">
                              <Link
                                href={
                                  "manage-company/add-company?company_id=" +
                                  btoa(person.id)
                                }
                                className="btn btn-sm btn-warning"
                              >
                                Edit
                              </Link>
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

export default ManageCompany;
