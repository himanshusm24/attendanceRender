/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import { UserLists } from "@/api_calls/admin/user/user-list";
import moment from "moment/moment";
import { useSearchParams } from "next/navigation";
import { CompanyLists } from "@/api_calls/admin/company/company-list";

const ManageUsers = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchCompany, setSearchCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0)

  const userListPerPage = 20;
  const searchParams = useSearchParams();
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  const [dataVisible, setDataVisible] = useState(false);
  const [userDetails, setUserDetails] = useState("");

  useEffect(() => {
    getUserCount();
    getCompanyList();
  }, []);

  useEffect(() => {
    getUserList();
  }, [page]);

  const getUserCount = async () => {
    const data = await UserLists();
    const details = data.data.data;

    const totalPages = Math.ceil(details?.length / userListPerPage);
    setTotalPages(totalPages);

    getUserList();
  };

  const getUserList = async () => {
    let pageNumber = searchParams.get("page_number");
    let skip_count = 0;
    skip_count =
      pageNumber == null ? page * userListPerPage : page * userListPerPage;
    const data = await UserLists(userListPerPage, skip_count);
    const data1 = await UserLists();
    setTotalUsers(data1.data.data)
    const details = data.data.data;
    setUserList(details);
    setDataVisible(true);
  };

  const searchForm = async () => {
    let skip_count = 0;
    let company_id;
    if (searchCompany) {
      company_id = searchCompany;
    }
    console.log("company_id: ", company_id);
    const data = await UserLists(
      userListPerPage,
      skip_count,
      userDetails,
      company_id
    );
    const details = data.data.data;
    setUserList(details);
  };

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data?.data?.data ?? [];
    setCompanyList([...companyList, ...list]);
  };

  console.log("searchCompany: ", searchCompany);
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
          <section className="mx-auto w-full">
            <BreadCrum
              breadcumr1={"Manage Employee"}
              breadcumr1_link={"/admin/manage-users"}
              breadcumr2={""}
              button_name={"Add Employee"}
              button_link={"manage-users/add-users"}
            />
            <div className="mt-3">
              {dataVisible ? (
                <div className="card">
                  <div className="card-header bg-white p-3 pb-4 border">
                    <div className="flex justify-between">
                      <h3 className="font-bold">Employee List</h3>
                      <button className="btn btn-neutral text-white">
                        Total Employees: {totalUsers?.length}
                      </button>
                      <Link
                        href={"/admin/manage-users/upload-csv"}
                        className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        Upload CSV
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white p-3">
                    <form action={searchForm} method="GET">
                      <div className="flex justify-end">
                        <input
                          type="text"
                          className="input input-bordered w-full h-15 mx-3"
                          name="userDetails"
                          onChange={(e) => setUserDetails(e.target.value)}
                          placeholder="Enter Username, Email Or Contact For Search"
                        />

                        <div className="w-full">
                          <select
                            className="input input-bordered select select-bordered w-full"
                            name="company"
                            value={searchCompany}
                            // required={true}
                            onChange={(e) => {
                              setSearchCompany(e.target.value);
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

                        <button
                          type="submit"
                          className="ml-4 btn bg-blue-500 text-white px-8 btn-md"
                        >
                          Search
                        </button>
                        <a
                          href="javascript:void(0);"
                          onClick={() => {
                            searchForm();
                            setUserDetails("");
                            setSearchCompany("");
                          }}
                          className="ml-4 btn bg-gray-500 text-white px-8 btn-md"
                        >
                          Reset
                        </a>
                      </div>
                    </form>
                  </div>
                  {userList && userList.length > 0 ? (
                    <>
                      <div className="card-body p-0">
                        <table className="w-full divide-y divide-gray-200 p-2">
                          <thead className="bg-gray-100">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                <span>Name</span>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                <span>Branch Name</span>
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                <span>Contact</span>
                              </th>
                              <th
                                scope="col"
                                className="px-12 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                Designation
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                Gender
                              </th>
                              {/* <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                Dob
                              </th> */}
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                              >
                                Edit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {userList.map((person, index) => (
                              <tr key={person.id}>
                                <td className="w-22 text-center px-4 py-4">
                                  {person.name}
                                </td>
                                <td className="w-22 text-center px-4 py-4">
                                  {person.company_name}
                                </td>
                                <td className="w-22 text-center px-4 py-4">
                                  +91 {person.contact} <br />
                                  {person.email}
                                </td>
                                <td className="w-22 text-center px-4 py-4">
                                  {person.designation}
                                </td>
                                <td className="w-22 text-center px-4 py-4">
                                  {person.gender}
                                </td>
                                {/* <td className="whitespace-nowrap  px-4 py-4">
                                  {moment(person.dob).format("DD MMM, YYYY")}
                                </td> */}
                                <td className="whitespace-nowrap text-center px-4 py-4">
                                  <span className="inline-flex rounded-sm bg-green-200 px-2 py-1 text-xs font-semibold leading-5 text-green-800">
                                    {person.status == 1 ? "Active" : "Disabled"}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap text-center pr-2 py-4 text-right text-sm font-medium">
                                  <Link
                                    href={
                                      "manage-users/add-users?user_id=" +
                                      btoa(person.id)
                                    }
                                    className="btn btn-sm btn-warning rounded-sm"
                                  >
                                    Edit
                                  </Link>
                                  <Link
                                    href={
                                      "manage-attendance/monthly-report?user_id=" +
                                      btoa(person.id)
                                    }
                                    onClick={() => console.log(person.id)}
                                    className="btn btn-sm btn-info text-white ml-2 rounded-sm"
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer text-center bg-blue-100 bordered py-3">
                        <div className="join">
                          {pageNumbers.map((pageNumber, index) => (
                            <Link
                              className={
                                pageNumber === page + 1
                                  ? "join-item btn btn-square text-white  bg-blue-700"
                                  : "join-item btn btn-square text-white bg-gray-300"
                              }
                              key={pageNumber}
                              href={`/admin/manage-users?page_number=` + index}
                              onClick={(e) => setPage(index)}
                            >
                              <label style={{ textDecoration: "none" }}>
                                {pageNumber === page ? (
                                  <strong>{pageNumber}</strong>
                                ) : (
                                  pageNumber
                                )}
                              </label>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="divide-y divide-gray-200 bg-white text-center p-4">
                      <h1>List is Empty</h1>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card text-center">
                  <div className="card-body bg-white py-8">
                    <h1 className="text-3xl">Data Loading...</h1>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
