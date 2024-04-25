/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import CompanyHeader from "@/components/admin/companyHeader/page";
import Sidebar from "@/components/admin/sidebar/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import moment from "moment/moment";
// import { HolidayList } from "@/api_calls/admin/holiday/get-holiday";
import { HolidayList } from "@/api_calls/branch/holiday/get-holiday";
import { DeleteHoliday } from "@/api_calls/admin/holiday/delete-holiday";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ManageCompany = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [holidayList, setHolidayList] = useState([]);
  const [deleteHolidayId, setDeleteHolidayId] = useState("");
  const [holidayTitle, setholidayTitle] = useState("");

  useEffect(() => {
    getholidayList();
  }, [deleteHolidayId]);

  const getholidayList = async () => {
    const data = await HolidayList();
    const details = data.data.data;
    setHolidayList(details);
  };

  const deleteHoliday = async (id) => {
    await DeleteHoliday(id);
    setDeleteHolidayId(id);
  };

  const deletConfirmation = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: (e) => {
            deleteHoliday(id);
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ],
    });
  };

  const searchForm = async () => {
    let companyAdmin_id = localStorage.getItem("companyAdmin_id")
    const data = await HolidayList(0, 0, companyAdmin_id, holidayTitle);
    const details = data.data.data;
    setHolidayList(details);
  };

  const resetValues = async () => {
    setholidayTitle("");
    searchForm();
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
              breadcumr1={"Manage Holiday"}
              breadcumr1_link={"/admin/manage-company"}
              breadcumr2={""}
              button_name={"Add Holiday"}
              button_link={"manage-holiday/add-holiday"}
            />
            <div className="mt-3">
              <div className="card">
                <div className="card-header bg-white p-3 pb-4 border">
                  <h3 className="font-bold">Holiday List</h3>
                </div>

                <div className="bg-white p-3">
                  <form action={searchForm} method="GET">
                    <div className="flex justify-end">
                      <input
                        type="text"
                        className="input input-bordered w-full h-15 mx-3"
                        name="userDetails"
                        value={holidayTitle}
                        onChange={(e) => setholidayTitle(e.target.value)}
                        placeholder="Enter Holiday title For Search"
                      />
                      <button
                        type="submit"
                        className="ml-4 btn bg-blue-500 text-white px-8 btn-md"
                      >
                        Search
                      </button>
                      <a
                        href="javascript:void(0);"
                        onClick={() => {
                          resetValues()
                        }}
                        className="ml-4 btn bg-gray-500 text-white px-8 btn-md"
                      >
                        Reset
                      </a>
                    </div>
                  </form>
                </div>
                <div className="card-body p-0">
                  {holidayList && holidayList.length > 0 ? (
                    <table className="w-full divide-y divide-gray-200 p-2">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Holiday Title</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Holiday Date</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Branch</span>
                          </th>

                          {/* <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            Status
                          </th> */}
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-right text-sm font-normal text-gray-700"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {holidayList.map((res, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-4 py-4">
                              {res.holiday_title}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {moment(res.holiday_date).format("DD MMM,YYYY")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {res.company_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                              <Link
                                href={
                                  "manage-holiday/add-holiday?holiday_id=" +
                                  res.id
                                }
                                className="btn btn-sm btn-warning"
                              >
                                Edit
                              </Link>
                              <button
                                className="btn btn-sm btn-error ml-2"
                                onClick={(e) => { deletConfirmation(res.id); }}
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

export default ManageCompany;
