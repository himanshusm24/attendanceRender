/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import CompanyHeader from "@/components/admin/companyHeader/page";
import Sidebar from "@/components/admin/sidebar/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
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

  return (
    <>
      <div className="main-wrapper">
        <CompanySidebar
          sidemenu={`${
            isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"
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
              breadcumr1={"Manage Company"}
              breadcumr1_link={"/admin/manage-company"}
              breadcumr2={""}
              button_name={"Add Company"}
              button_link={"manage-company/add-company"}
            />
            <div className="mt-3">
              <div className="card">
                <div className="card-header bg-white p-3 pb-4 border">
                  <h3 className="font-bold">Company List</h3>
                </div>
                <div className="card-body p-0">
                  {companyList && companyList.length > 0 ? (
                    <table className="w-full divide-y divide-gray-200 p-2">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 "
                          >
                            <span>Name</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 "
                          >
                            <span>Contact</span>
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700 text-center"
                          >
                            Address
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700 "
                          >
                            Check In Time
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700 "
                          >
                            Check Out Time
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 "
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-right text-sm font-normal text-gray-700 "
                          >
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {companyList.map((person, index) => (
                          <tr key={person.id}>
                            <td className="whitespace-nowrap px-4 py-4  ">
                              {person.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  ">
                              +91 {person.contact} <br />
                              {person.email}
                            </td>
                            <td
                              className="px-4 py-4  text-center  "
                              style={{ wordBreak: "break-word" }}
                            >
                              {person.address}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  text-center  ">
                              {person.checkin_time}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  text-center">
                              {person.checkout_time}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  text-center">
                              <span className="inline-flex rounded-md bg-green-200 px-2 py-1 text-xs font-semibold leading-5 text-green-800">
                                {person.status == 1 ? "Active" : "Disabled"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
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
