/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import CompanyHeader from "@/components/admin/companyHeader/page";
import Sidebar from "@/components/admin/sidebar/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import Link from "next/link";
import { AttedanceList } from "@/api_calls/branch/attendance/attendance-list";
// import moment from 'moment/moment';
import { AttedanceCount } from "@/api_calls/branch/attendance/attendance-count";
import Pagination from "@/components/admin/pagination/page";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import "moment-timezone";
// import { UserBreakTime } from "@/api_calls/admin/attendance/userBreak-time";
import { TotalBreakTime } from "@/api_calls/admin/attendance/totalBreakTime";
import { CompanyLists } from "@/api_calls/branch/company/company-list";
import RefreshIcon from "@mui/icons-material/Refresh";

const ManageAttendance = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  // const [filterDate, setFilterDate] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const attendanceListPerPage = 20;
  const [dataVisible, setDataVisible] = useState(false);
  const searchParams = useSearchParams();
  const [userDetails, setUserDetails] = useState("");
  const [checkBreakData, setCheckbreakData] = useState([]);

  const [searchCompany, setSearchCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  moment.tz.setDefault("UTC");

  useEffect(() => {
    getAttedanceCount();
    getCompanyList();
  }, []);

  useEffect(() => {
    getUserList();
  }, [page]);

  const getAttedanceCount = async () => {
    const data = await AttedanceCount();
    const details = data.data.data;
    setTotalAttendance(details?.total_attendance);
    const totalPages = Math.ceil(
      details?.total_attendance / attendanceListPerPage
    );
    setTotalPages(totalPages);
    getUserList();
  };

  const getUserList = async () => {
    let pageNumber = searchParams.get("page_number");
    let skip_count = 0;

    skip_count =
      pageNumber == null
        ? page * attendanceListPerPage
        : page * attendanceListPerPage;

    const data = await AttedanceList(
      attendanceListPerPage,
      skip_count,
      filterDate
    );
    const details = data.data.data;
    // console.log('details: ', JSON.parse(details[0].break_startTime_array));
    // const timestampArray = timestamps.split(',');
    // console.log(timestampArray.length)

    setCheckbreakData(details);
    setUserList(details);
    setDataVisible(true);
  };

  const searchForm = async () => {
    let company_id;
    if (searchCompany) {
      company_id = searchCompany;
    }

    const data = await AttedanceList(
      attendanceListPerPage,
      0,
      filterDate,
      userDetails,
      company_id
    );
    const details = data.data.data;
    setUserList(details);
  };

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data?.data?.data ?? [];
    console.log("list: ", list);
    setCompanyList([...companyList, ...list]);
  };

  //   const allBreakTime = async () => {
  //     const data = await TotalBreakTime();
  //   };

  //   useEffect(() => {
  //     CalculateBreakTime();
  //   }, []);

  //   const CalculateBreakTime = async () => {
  //     console.log("checkBreakData: ", checkBreakData);

  //       checkBreakData.map((res, index) => {
  //         console.log(res.break_startTime_array);
  //         const startTimeArray = JSON.parse(res.break_startTime_array);
  //         const endTimeArray = JSON.parse(res.break_endTime_array);
  //         const differences = [];
  //         for (let i = 0; i < startTimeArray.length; i++) {
  //         //   const startTime = new Date(startTimeArray[i]);
  //         //   const endTime = new Date(endTimeArray[i]);
  //         //   const differenceMs = endTime - startTime;
  //         //   const differenceSec = differenceMs / 1000;
  //         //   differences.push(differenceSec);
  //         differences.push(startTimeArray)
  //         }
  //         console.log(differences);
  //       });
  //   };

  let presentCount = 0;
  let absentCount = 0;

  const countAll = async () => {
    userList.forEach((user) => {
      if (user.checkin_time !== null) {
        presentCount++;
      } else if (user.absent_status === 1) {
        absentCount++;
      }
    });
  };
  countAll();

  //  console.log("Present Count:", presentCount);
  // console.log("Absent Count:", absentCount);

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
              breadcumr1={"Manage Attendance"}
              breadcumr1_link={"/admin/manage-attendance"}
              breadcumr2={""}
              button_name={""}
              button_link={""}
            />
            <div className="mt-3">
              {dataVisible ? (
                <div className="card">
                  <div className="card-header bg-white p-3 md:pb-1 border">
                    <div className="grid grid-cols-5 gap-8 justify-between">
                      <h3 className="font-bold">Attendance List</h3>
                      <button className="btn btn-neutral text-white">
                        Total Employees: {userList.length}
                      </button>
                      <button className="btn bg-green-500 text-white">
                        Total Present: {presentCount}
                      </button>
                      <button className="btn bg-red-500 text-white">
                        Total Absent: {absentCount}
                      </button>
                      <button
                        onClick={() => getUserList()}
                        // disabled={loading}
                        className={"bg-gray-400 rounded-xl text-white w-8"}
                      >
                        <RefreshIcon />
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
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

                          <input
                            type="date"
                            className="input input-bordered w-full h-15"
                            name="filterDate"
                            onChange={(e) => setFilterDate(e.target.value)}
                            max={moment().format("YYYY-MM-DD")}
                          />

                          {/* <div className="w-full ml-2">
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
                          </div> */}

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
                              setFilterDate("");
                            }}
                            className="ml-4 btn bg-gray-500 text-white px-8 btn-md"
                          >
                            Reset
                          </a>
                        </div>
                      </form>
                    </div>

                    {userList && userList.length > 0 ? (
                      <table className="w-full divide-y divide-gray-200 p-2">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              <span>Name</span>
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              <span>Branch Name</span>
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              <span>Contact</span>
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              Clock In
                            </th>
                            {/* <th
                              scope="col"
                              className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              In Address
                            </th> */}
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              Total Breaks
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              Clock Out
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-right text-sm font-normal text-gray-700"
                            >
                              View
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {userList.map((person, index) => (
                            <tr key={person.id}>
                              <td className="whitespace-nowrap px-4 py-4">
                                {person.user_name}
                              </td>
                              <td
                                className="whitespace-nowrap px-4 py-4"
                                style={{ wordBreak: "break-word" }}
                              >
                                {person.company_name}
                              </td>
                              <td
                                className="whitespace-nowrap px-4 py-4"
                                style={{ wordBreak: "break-word" }}
                              >
                                +91 {person.user_contact} <br />
                                {person.user_email}
                              </td>
                              <td
                                className="whitespace-nowrap px-4 py-4"
                                style={{ wordBreak: "break-word" }}
                              >
                                {person.checkin_time &&
                                person.checkin_time != "" &&
                                person.checkin_time != null ? (
                                  <>
                                    {moment(person.checkin_time).format(
                                      "DD MMM, YYYY"
                                    )}
                                    <br />
                                    {moment(person.checkin_time).format(
                                      "h:mm A"
                                    )}
                                  </>
                                ) : (
                                  "Not found"
                                )}
                              </td>
                              {/* <td>{person.checkin_address}</td> */}
                              <td className="whitespace-nowrap px-4 py-4">
                                {person.break_startTime_array == "[null]"
                                  ? 0
                                  : JSON.parse(
                                      person.break_startTime_array.split(",")
                                        .length
                                    )}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4">
                                {person.checkout_time &&
                                person.checkout_time != "" &&
                                person.checkout_time != null ? (
                                  <>
                                    {moment(person.checkout_time).format(
                                      "DD MMM, YYYY"
                                    )}
                                    <br />
                                    {moment(person.checkout_time).format(
                                      "h:mm A"
                                    )}
                                  </>
                                ) : (
                                  "Not Found"
                                )}
                              </td>

                              <td className="whitespace-nowrap px-4 py-4 text-left text-sm font-medium">
                                <span
                                  className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold leading-5 text-white ${
                                    person.absent_status === 1
                                      ? "bg-red-500"
                                      : "bg-green-500"
                                  }`}
                                >
                                  {person.absent_status === 1
                                    ? "Absent"
                                    : "Present"}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                                <Link
                                  href={`/branch/manage-attendance/user-attendance?id=${
                                    person?.user_id
                                  }&&date=${person?.checkin_time?.substring(
                                    0,
                                    10
                                  )}`}
                                  className="btn btn-sm btn-secondary text-white ml-2 rounded-md"
                                >
                                  View
                                </Link>

                                {/* {person.checkin_img != null ? (
                                  <Link
                                    href={person.checkin_img}
                                    target="_blank"
                                    className="btn btn-sm btn-info text-white ml-2 rounded-md"
                                  >
                                    In
                                  </Link>
                                ) : (
                                  ""
                                )}
                                {person.checkout_img != null ? (
                                  <Link
                                    href={person.checkout_img}
                                    target="_blank"
                                    className="btn btn-sm btn-success text-white ml-2 rounded-md"
                                  >
                                    Out
                                  </Link>
                                ) : (
                                  ""
                                )} */}
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
                          href={
                            `/branch/manage-attendance?page_number=` + index
                          }
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
                      {/* <Pagination currentPage={page + 1} totalPages={totalPages} clickEventFun={page} /> */}
                    </div>
                  </div>
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

export default ManageAttendance;
