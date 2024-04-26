/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
// import Calendar from "react-calendar";
import { useRouter } from "next/navigation";
// import { MonthlyLog } from "@/api_calls/user/attendance/monthly-log";
import moment from "moment";
import "moment-timezone";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import { useSearchParams } from "next/navigation";
// import { UserLists } from "@/api_calls/admin/user/user-list";
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { UserBreakTime } from "@/api_calls/admin/attendance/userBreak-time";
import { DailyLog } from "@/api_calls/user/attendance/daily-log";
import { sendRequest } from "@/api_calls/sendRequest";

const UserAttendance = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [userBreakTime, setUserBreakTime] = useState("");
  const [allUserBreakTime, setAllUserBreakTime] = useState([]);
  const [userDailyLog, setUserDailyLog] = useState("");
  // const [finalbreakTime, setFinalBreakTime] = useState("")
  moment.tz.setDefault("UTC");
  const [allVisits, setAllVisits] = useState([]);

  const user_id = params.get("id");
  const attendaceDate = params.get("date");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const UserData = async () => {
    const data = await UserListss(user_id);
    setUserDetails(data?.data?.data[0]);
    // console.log("data?.data?.data[0]: ", data?.data?.data[0]);
  };

  useEffect(() => {
    UserData();
  }, []);

  const companyId = JSON.stringify(userDetails.company_id);

  const CheckBreakTime = async () => {
    if (companyId) {
      const data = await UserBreakTime({
        user_id,
        attendance_date: attendaceDate,
        company_id: companyId,
      });
      setUserBreakTime(data?.data?.data[1]?.breakTime);
      setAllUserBreakTime(data?.data?.data[0]?.totalBreakTimeData);
      //   console.log(data.data.data[1].totalBreakTimeData)
    }
  };

  const checkDailyLog = async () => {
    if (companyId) {
      const obj = {
        company_id: companyId,
        user_id: user_id,
        attendance_date: attendaceDate,
      };
      const response = await DailyLog(obj);
      setUserDailyLog(response.data.data);
      const data = response.data.data;
      // console.log(
      //   "checkintime",
      //   moment(data.checkin_time).format("DD/MM/YYYY - HH:MM:SS")
      // );
      // console.log(
      //   "checkouttime",
      //   moment(data.checkout_time).format("DD/MM/YYYY - HH:MM:SS")
      // );
      // console.log(
      //   "workhour",
      //   moment(data.checkout_time).format("HH:MM:SS") -
      //     moment(data.checkin_time).format("HH:MM:SS")
      // );

      let startTime = moment(data.checkin_time).format("HH:MM:SS");
      let endTime = moment(data.checkin_time).format("HH:MM:SS");

      let startDate = new Date("2000-01-01 " + startTime);
      let endDate = new Date("2000-01-01 " + endTime);

      let timeDiff = endDate.getTime() - startDate.getTime();

      let hoursDiff = timeDiff / (1000 * 3600);
      // console.log("hoursDiff: ", hoursDiff);
    }
  };

  function calculateWorkHours(
    checkinTime,
    checkoutTime,
    companyCheckinTime,
    companyCheckoutTime
  ) {
    const format = "YYYY-MM-DD HH:mm:ss";
    const checkin = moment(checkinTime, format);
    const checkout = checkoutTime ? moment(checkoutTime, format) : null;
    const companyCheckin = moment(companyCheckinTime, "HH:mm:ss");
    const companyCheckout = moment(companyCheckoutTime, "HH:mm:ss");

    if (checkout !== null) {
      // return checkout.diff(checkin, "hours", true);
      let checkinNew = moment(checkinTime).format("HH:mm:ss");
      const difference = checkout.diff(
        moment(checkinNew, "HH:mm:ss"),
        "seconds"
      );
      const hours = Math.floor(difference / 3600);
      const minutes = Math.floor((difference % 3600) / 60);
      const seconds = difference % 60;
      return hours + ":" + minutes;
    } else {
      let checkinNew = moment(checkinTime).format("HH:mm:ss");
      let endOfDay;

      if (companyCheckout.hour() < moment().hour()) {
        endOfDay = moment(companyCheckoutTime, "HH:mm:ss");
      } else {
        endOfDay = moment();
      }
      const difference = endOfDay.diff(
        moment(checkinNew, "HH:mm:ss"),
        "seconds"
      );
      const hours = Math.floor(difference / 3600);
      const minutes = Math.floor((difference % 3600) / 60);
      const seconds = difference % 60;
      return hours + ":" + minutes;
      // return endOfDay.diff(checkinNew, "HH:mm:ss", true);
    }
  }

  const workHours = calculateWorkHours(
    userDailyLog?.checkin_time,
    userDailyLog?.checkout_time,
    userDetails?.company_checkin_time,
    userDetails?.company_checkout_time
  );

  // console.log("workHours: ", workHours);

  function formatDuration(duration) {
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const totalTime = hours + ":" + minutes;
    breakTimeDifference(totalTime);
    return totalTime;
  }

  function calculateUserTotalBreakTime(breakTimes) {
    let totalBreakDuration = moment.duration(0);
    breakTimes.forEach((breakPeriod) => {
      const breakStartTime = moment(breakPeriod.break_startTime);
      const breakEndTime = moment(breakPeriod.break_endTime);
      const breakDuration = moment.duration(breakEndTime.diff(breakStartTime));

      totalBreakDuration.add(breakDuration);
    });
    return formatDuration(totalBreakDuration);
  }
  const totalUserBreakTime = calculateUserTotalBreakTime(allUserBreakTime);

  var finalbreakTime;

  function breakTimeDifference(totalTime) {
    const momentTime1 = moment(workHours, "HH:mm:ss");
    const momentTime2 = moment(totalTime, "HH:mm:ss");
    const differenceInSeconds = momentTime1.diff(momentTime2, "seconds");
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;
    finalbreakTime = hours + ":" + minutes;
  }

  const getAllVisits = async () => {
    const data = await sendRequest(
      "get",
      `api/allVisits?user_id=${user_id}&company_id=${companyId}&attendance_date=${attendaceDate}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      setAllVisits(data.data.data);
    }
  };

  useEffect(() => {
    CheckBreakTime();
    checkDailyLog();

    if (companyId) {
      getAllVisits();
    }
  }, [companyId]);

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
              breadcumr1={"Manage Attendance"}
              breadcumr1_link={"/admin/manage-attendance"}
              breadcumr2={""}
              button_name={""}
              button_link={""}
            />

            <div className="mt-3 flex">
              <div className="user-details bg-white w-full p-4">
                <p className="text-lg font-semibold mb-4">User Details</p>

                <div className="grid md:grid-cols-1 mt-12">
                  <div className="mx-2 w-full">
                    <table className="table-fixed w-full">
                      <tbody>
                        <tr>
                          <td className="text-l font-bold w-1/3">Name:</td>
                          <td> {userDetails?.name} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">Contact:</td>
                          <td> {userDetails?.contact} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">Email:</td>
                          <td> {userDetails?.email} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">
                            Designation:
                          </td>
                          <td> {userDetails?.designation} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">Gender:</td>
                          <td> {userDetails?.gender} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">DOB:</td>
                          <td>
                            {" "}
                            {userDetails &&
                              moment(userDetails?.dob).format(
                                "DD MMMM, YYYY"
                              )}{" "}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">Aadhar No:</td>
                          <td> {userDetails?.aadhar_no} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">Pan no:</td>
                          <td> {userDetails?.pan_no} </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">
                            Total Break Time:
                          </td>
                          <td> {totalUserBreakTime} Hr </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">
                            Todays Working Hours:
                          </td>
                          <td> {workHours} Hr </td>
                        </tr>
                        <tr>
                          <td className="text-l font-bold w-1/3">
                            Total Hours After Break:
                          </td>
                          <td>{finalbreakTime} Hr</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-white ml-3 flex w-full">
                <div className="w-full ml-4 mt-4">
                  {userDailyLog?.checkin_img ? (
                    <img
                      src={userDailyLog?.checkin_img || ""}
                      alt="Check In Image"
                      style={{ width: "140px", maxHeight: "200px" }}
                    />
                  ) : (
                    <img
                      src="/img/noImage.jpg"
                      alt="Image"
                      style={{ width: "140px", maxHeight: "200px" }}
                    />
                  )}
                  <p className="text-md mt-2">
                    Check In Time: <br />
                    {userDailyLog?.checkin_time != null
                      ? moment(userDailyLog?.checkin_time).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : "Not Clocked in yet"}
                  </p>
                  <p className="text-md mt-2">
                    Check In Address:
                    <br />
                    {userDailyLog?.checkin_address}
                  </p>
                </div>
                <div className="w-full mt-4">
                  {userDailyLog?.checkout_img ? (
                    <img
                      src={userDailyLog?.checkout_img || ""}
                      style={{ width: "140px", maxHeight: "200px" }}
                    />
                  ) : (
                    <img
                      src="/img/noImage.jpg"
                      alt="Image"
                      style={{ width: "140px", maxHeight: "200px" }}
                    />
                  )}

                  <p className="text-md mt-2">
                    Check Out Time:
                    <br />
                    {userDailyLog?.checkout_time == null
                      ? "Not checked out yet"
                      : moment(userDailyLog.checkout_time).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                  </p>
                  <p className="text-md mt-2">
                    Check Out Address:
                    <br />
                    {userDailyLog?.checkout_address === null
                      ? "Not checked out yet"
                      : userDailyLog?.checkout_address}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div>
            <table className="w-full divide-y divide-gray-200 p-2">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>S.No.</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Break Start Time</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Break End Time</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Remark</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Total Break Time</span>
                  </th>
                </tr>
              </thead>
              {allUserBreakTime.length > 0 ? (
                <>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {allUserBreakTime?.map((item, index) => {
                      const startTime = new Date(item.break_startTime);
                      const endTime = new Date(item.break_endTime);
                      const timeDifference = endTime - startTime;
                      const secondsDifference = Math.floor(
                        timeDifference / 1000
                      );
                      const hours = Math.floor(secondsDifference / 3600);
                      const remainingSeconds = secondsDifference % 3600;
                      const minutes = Math.floor(remainingSeconds / 60);
                      const remainingSecondsAfterMinutes =
                        remainingSeconds % 60;

                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-4 py-4">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            {moment(item.break_startTime).format("H:mm:ss")}
                          </td>
                          <td className=" px-4 py-4">
                            {moment(item.break_endTime).format("H:mm:ss")}
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            {item.remark}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            {hours} hours {minutes} minutes{" "}
                            {remainingSecondsAfterMinutes} seconds
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                "No Break Taken"
              )}
            </table>
            <div className="mt-2 font-bold" style={{ marginLeft: "690px" }}>
              {/* Total Break Time: {calculateTotalBreakTime(allUserBreakTime)} */}
            </div>
          </div>

          <div>
            <table className="w-full divide-y divide-gray-200 p-2">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>S.No.</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Visit Checkin</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Checkin Image</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Reason</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Visit Checkout</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span>Checkout Image</span>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                  >
                    <span> Remark</span>
                  </th>
                </tr>
              </thead>
              {allVisits.length > 0 ? (
                <>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {allVisits?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-4 py-4">
                            {index + 1}
                          </td>
                          <td
                            className="px-4 py-4"
                            style={{ wordBreak: "break-word" }}
                          >
                            <p className="w-56">{item?.checkin_address}</p>
                          </td>
                          <td
                            className="px-4 py-4"
                            style={{ wordBreak: "break-word" }}
                          >
                            {/* <p className="w-56">{item?.checkin_img}</p> */}
                            <img src={item?.checkin_img}></img>
                          </td>
                          <td style={{ wordBreak: "break-word" }}>
                            {item?.reason}
                          </td>
                          <td
                            className=" px-4 py-4"
                            style={{ wordBreak: "break-word" }}
                          >
                            <p className="w-56">{item?.checkout_address}</p>
                          </td>
                          <td
                            className="px-4 py-4"
                            style={{ wordBreak: "break-word" }}
                          >
                            {/* <p className="w-56">{item?.checkin_img}</p> */}
                            <img src={item?.checkout_img}></img>
                          </td>
                          <td
                            className="px-4 py-4"
                            style={{ wordBreak: "break-word" }}
                          >
                            <p className="w-36">{item?.remark}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                "No Visits Taken"
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAttendance;
