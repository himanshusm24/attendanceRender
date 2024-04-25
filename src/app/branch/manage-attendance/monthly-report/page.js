"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import CompanyHeader from "@/components/admin/companyHeader/page";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { useRouter } from "next/navigation";
import { MonthlyLog } from "@/api_calls/user/attendance/monthly-log";
import moment from "moment";
import Sidebar from "@/components/admin/sidebar/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { useSearchParams } from "next/navigation";
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { UserLeaveList } from "@/api_calls/user/user-leave/leaveList";
import { HolidayList } from "@/api_calls/admin/holiday/get-holiday";
import Link from "next/link";

const MonthlyReport = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [halfDay, setHalfDay] = useState(0);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [dataVisible, setDataVisible] = useState(false);
  const [reportMonth, setReportMonth] = useState(moment().format("YYYY-MM"));
  const [userDetails, setUserDetails] = useState([]);
  const [userLeaveDetails, setUserLeaveDetails] = useState([]);
  const [weeklyOff, setWeeklyOff] = useState(0);
  const [missed, setMissed] = useState(0);
  const [holidays, setHolidays] = useState(0);
  const [holidayMonthDetails, setHolidayMonthDetails] = useState([]);

  const calculateSundays = () => {
    const today = moment();
    const checkMonth = today.format("MM");
    const checkYear = today.format("YYYY");
    let sundays = 0;
    for (let day = 1; day <= today.date(); day++) {
      if (moment({ year: checkYear, month: checkMonth - 1, day }).day() === 0) {
        sundays++;
      }
    }
    setWeeklyOff(sundays);
    return sundays;
  };

  const checkMonthlyLog = async () => {
    const user_id = atob(params.get("user_id"));
    const data = await UserListss(user_id);
    setUserDetails(data.data.data[0]);
    const company_id = data.data.data[0].company_id;
    const obj = {
      company_id: company_id,
      user_id: user_id,
      attendance_date: reportMonth,
    };
    const response = await MonthlyLog(obj);
    if (response.status == true) {
      setDate(new Date(reportMonth));
      setDataVisible(true);
      setAttendanceDetails(response.data.data);

      setPresent(response.data.present_count);

      setHalfDay(response.data.half_count);

      // let absentCount = "";

      // if (moment().format("YYYY-MM") != reportMonth) {
      //   absentCount = moment(reportMonth).endOf("month").format("DD");
      // } else {
      //   absentCount = moment().format("DD");
      // }

      // let totalabsent =
      //   absentCount - response.data.present_count - response.data.half_count;

      // setAbsent(totalabsent);
      let absentCount = Number(moment().format("DD"));
      const sundayData = Number(calculateSundays());

      const presentCount = Number(response.data.present_count) || 0;
      const halfCount = Number(response.data.half_count) || 0;

      let totalabsent = absentCount - presentCount - halfCount - sundayData;
      totalabsent = Math.max(totalabsent, 0);

      setAbsent(totalabsent);

      let details = response.data.data;

      let final_list = details.map((attendance, index) => {
        const date = moment(attendance["attendance_date"]).format(
          "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
        );
        let att_title = "";

        if (attendance.checkin == 1 && attendance.checkout == 0) {
          att_title = "Half-day";
        } else if (attendance.checkin == 1 && attendance.checkout == 1) {
          att_title = "Full-day";
        } else {
          att_title = "Absent";
        }
        return { date: date, title: att_title };
      });
      setEvents([...final_list]);
    }
  };

  useEffect(() => {
    const fetchHolidayMonthDetails = async (newDate) => {
      const monthNames = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      const currentMonth = newDate.getMonth();
      const selectedMonth = monthNames[currentMonth];
      const holidayMonthData = await HolidayList(0, selectedMonth);
      // console.log("holidayMonthData: ", holidayMonthData.data.data.length);
      setHolidays(holidayMonthData?.data?.data?.length);
      setHolidayMonthDetails(holidayMonthData?.data?.data);
    };

    // const calculateSundays = () => {
    //   const today = moment();
    //   const checkMonth = today.format("MM");
    //   const checkYear = today.format("YYYY");
    //   let sundays = 0;
    //   for (let day = 1; day <= today.date(); day++) {
    //     if (
    //       moment({ year: checkYear, month: checkMonth - 1, day }).day() === 0
    //     ) {
    //       sundays++;
    //     }
    //   }
    //   setWeeklyOff(sundays);
    // };

    // calculateSundays();
    fetchHolidayMonthDetails(date);
    checkMonthlyLog(date);
  }, []);

  const onChangeFunction = (selectedDate) => {
    setDate(selectedDate);
  };

  // const tileClassName = ({ date }) => {
  //   const eventForDay = events.find((event) => {
  //     return moment(event.date)
  //       .startOf("day")
  //       .isSame(moment(date).startOf("day"));
  //   });

  //   const classes = [];

  //   if (eventForDay) {
  //     if (eventForDay.title == "Full-day") {
  //       classes.push("full-day-attendance");
  //     } else if (eventForDay.title == "Half-day") {
  //       classes.push("half-day-attendance");
  //     } else {
  //       classes.push("abset-attendance");
  //     }
  //   }

  //   return classes.join(" ");
  // };

  const tileClassName = ({ date }) => {
    const currentDate = moment(date).startOf("day");
    const currentMonth = currentDate.month();
    if (currentDate.month() !== currentMonth) {
      return "";
    }
    if (currentDate.isAfter(moment().startOf("day"))) {
      return "";
    }
    const eventForDay = events.find((event) =>
      moment(event.date).startOf("day").isSame(moment(date).startOf("day"))
    );
    const isHoliday = holidayMonthDetails.some((holiday) =>
      moment(holiday.holiday_date).isSame(date, "day")
    );
    const absentDates = [];
    for (let i = 1; i <= moment().date(); i++) {
      const day = moment(date).date(i).startOf("day");
      const isAbsent =
        attendanceDetails.filter((log) =>
          moment(log.attendance_date).isSame(day, "day")
        ).length === 0;
      if (isAbsent && !isHoliday) {
        absentDates.push(day.format("YYYY-MM-DD"));
      }
    }
    // console.log("absentDates: ", absentDates);
    const classes = [];
    if (eventForDay) {
      if (eventForDay.title === "Full-day") {
        classes.push("full-day-attendance");
      } else if (eventForDay.title === "Half-day") {
        classes.push("half-day-attendance");
      } else {
        classes.push("absent-attendance");
      }
    }
    if (isHoliday) {
      classes.push("holiday");
    }
    if (date.getDay() === 0) {
      classes.push("sunday");
    }
    if (
      !isHoliday &&
      absentDates.length > 0 &&
      currentDate.isSameOrBefore(moment().startOf("day"))
    ) {
      classes.push("absent");
    }
    return classes.join(" ");
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    return date > today;
  };

  const tileDisabled = ({ activeStartDate, date, view }) => {
    return moment(date).month() !== moment(activeStartDate).month();
  };

  const handleUserLeaveRequest = async () => {
    const user_id = atob(params.get("user_id"));
    const data = await UserLeaveList({ user_id: user_id });
    // console.log("data: ", data);
    setUserLeaveDetails(data?.data?.data);
  };

  useEffect(() => {
    checkMonthlyLog();
    handleUserLeaveRequest();
  }, []);

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
              breadcumr1={"Manage Employee"}
              breadcumr1_link={"/admin/manage-users"}
              breadcumr2={"Monthly Report"}
              button_name={""}
              button_link={""}
            />
            <div className="mt-3">
              {dataVisible ? (
                <div className="bg-white min-h-screen flex flex-col relative">
                  <div className="bg-white p-3">
                    <form action={checkMonthlyLog} method="GET">
                      <div className="flex justify-end">
                        <input
                          type="month"
                          className="input input-bordered w-full h-15"
                          name="filterDate"
                          onChange={(e) => setReportMonth(e.target.value)}
                          max={moment().format("YYYY-MM")}
                          value={reportMonth}
                        />
                        <button
                          type="submit"
                          className="ml-4 btn bg-blue-500 text-white px-8 btn-md"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                  <hr className="w-full mt-4 text-gray-400" />
                  <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                    <div className="flex flex-col mt-4">
                      <div className="bg-white flex flex-row relative">
                        <div
                          className="mx-2  flex flex-col relative flex-1 w-16 h-16 border-l-2 border-green-500"
                          style={{ backgroundColor: "#19838a" }}
                        >
                          <p className="text-sm text-white mt-2 mx-2">
                            Present
                          </p>
                          <h2 className="font-semibold text-xl mt-1 mx-2 text-white">
                            {present || 0}
                          </h2>
                        </div>

                        <div className="mx-2 bg-red-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-red-500">
                          <p className="text-sm text-gray-700 mt-2 mx-2">
                            Absent
                          </p>
                          <h2 className="font-semibold text-xl mt-1 mx-2">
                            {absent || 0}
                          </h2>
                        </div>

                        <div
                          className="mx-2 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-yellow-500"
                          style={{ backgroundColor: "rgb(255, 174, 0)" }}
                        >
                          <p className="text-sm text-white mt-2 mx-1">Missed</p>
                          <h2 className="font-semibold text-white text-xl mt-1 mx-2">
                            {halfDay || 0}
                          </h2>
                        </div>

                        {/* <div className="mx-2 bg-violet-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-violet-500">
                          <p className="text-sm text-gray-700 mt-2 mx-1">PL</p>
                          <h2 className="font-semibold text-xl mt-1 mx-2">
                            {userDetails.paid_leave}
                          </h2>
                        </div>
                        <div className="mx-2 bg-gray-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-gray-500">
                          <p className="text-sm text-gray-700 mt-2 mx-1">UL</p>
                          <h2 className="font-semibold text-xl mt-1 mx-2">
                            {userDetails.unpaid_leave}
                          </h2>
                        </div> */}

                        <div className="mx-2 bg-gray-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-gray-500">
                          <p className="text-sm text-gray-700 mt-2 mx-1">
                            Weekly
                          </p>
                          <h2 className="font-semibold text-xl mt-1 mx-2">
                            {weeklyOff || 0}
                          </h2>
                        </div>
                        <div className="mx-2 bg-gray-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-gray-500">
                          <p className="text-sm text-gray-700 mt-2 mx-1">
                            Holiday
                          </p>
                          <h2 className="font-semibold text-xl mt-1 mx-2">
                            {holidays || 0}
                          </h2>
                        </div>
                      </div>
                      {/* <div className="grid md:grid-cols-1 mt-12">
                        <div className="mx-2 w-full">
                          <p className="text-2xl">
                            Name: {userDetails && userDetails.name}
                          </p>
                          <p className="text-md mt-2">
                            Contact: {userDetails && userDetails.contact}
                          </p>
                          <p className="text-md mt-2">
                            Email: {userDetails && userDetails.email}
                          </p>
                          <p className="text-md mt-2">
                            Designation:{" "}
                            {userDetails && userDetails.designation}
                          </p>
                          <p className="text-md mt-2">
                            Gender: {userDetails && userDetails.gender}
                          </p>
                          <p className="text-md mt-2">
                            Date Of Birth:{" "}
                            {userDetails &&
                              moment(userDetails.dob).format("DD MMMM, YYYY")}
                          </p>
                          <p className="text-md mt-2">
                            Aadhar No: {userDetails && userDetails.aadhar_no}
                          </p>
                          <p className="text-md mt-2">
                            Pan No: {userDetails && userDetails.pan_no}
                          </p>
                        </div>
                      </div> */}

                      <div className="grid md:grid-cols-1 mt-12">
                        <div className="mx-2 w-full">
                          <table className="table-fixed w-full">
                            <tbody>
                              <tr>
                                <td className="text-lg font-bold w-1/3">
                                  Name:
                                </td>
                                <td>{userDetails && userDetails.name}</td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Contact:
                                </td>
                                <td>{userDetails && userDetails.contact}</td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Email:
                                </td>
                                <td>{userDetails && userDetails.email}</td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Designation:
                                </td>
                                <td>
                                  {userDetails && userDetails.designation}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Gender:
                                </td>
                                <td>{userDetails && userDetails.gender}</td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Date Of Birth:
                                </td>
                                <td>
                                  {userDetails &&
                                    moment(userDetails.dob).format(
                                      "DD MMMM, YYYY"
                                    )}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Aadhar No:
                                </td>
                                <td>{userDetails && userDetails.aadhar_no}</td>
                              </tr>
                              <tr>
                                <td className="text-md mt-2 font-bold">
                                  Pan No:
                                </td>
                                <td>{userDetails && userDetails.pan_no}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Calendar
                        onChange={onChangeFunction}
                        value={date}
                        tileClassName={tileClassName}
                        // tileDisabled={({ date }) => isDateDisabled(date)}
                        tileDisabled={tileDisabled}
                      />
                    </div>
                  </div>

                  <div className="card-body p-0">
                    <div className=" text-center p-4 font-bold bg-gray-100 w-full">
                      <h2 className="">Leave Taken</h2>
                    </div>
                    <table className="w-full divide-y divide-gray-200 p-2">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>From Date</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>To Date</span>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Status</span>
                          </th>
                          {/* <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Leave Status</span>
                          </th> */}
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                          >
                            <span>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {userLeaveDetails?.map((res, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-4 py-4">
                              {moment(res?.from_date).format("DD MM YYYY")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {moment(res?.to_date).format("DD MM YYYY")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4">
                              {res?.leave_status}
                            </td>

                            {/* <td className="whitespace-nowrap px-4 py-4">
                              <select
                                value={res?.leave_status}
                                onChange={(e) =>
                                  handleLeaveStatusChange(e, index)
                                }
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td> */}
                            <td className="whitespace-nowrap px-4 py-4">
                              <Link
                                href={`/admin/manage-users/view-user-leave?id=${res?.id}`}
                                className="btn btn-sm btn-info text-white ml-2 rounded-md"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default MonthlyReport;
