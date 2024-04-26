/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { DailyLog } from "@/api_calls/user/attendance/daily-log";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import moment from "moment";
import "moment-timezone";
import "./attendance-log.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { BreakTime } from "@/api_calls/user/attendance/breakTime";
import { UserBreakTime } from "@/api_calls/admin/attendance/userBreak-time";

const ViewLog = () => {
  const router = useRouter();
  const [logDetails, setLogDetails] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [userBreak, setUserBreak] = useState("");

  moment.tz.setDefault("UTC");

  useEffect(() => {
    checkDailyLog();
  }, []);

  const checkDailyLog = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    setUserData(details);
    const obj = {
      company_id: details.company_id,
      user_id: details.id,
      attendance_date: moment().format("YYYY-MM-DD"),
    };
    // const userBreakDetails = await UserBreakTime(obj);
    // setUserBreak(userBreakDetails.data.data[0].totalBreakTimeData);
    // const response = await DailyLog(obj);
    // console.log("response: ", response);
    // if (response.status == true) {
    //   setDataLoading(true);
    //   setLogDetails(response.data.data);
    // }

    await fetchUserBreakTime(obj);
    await fetchDailyLog(obj);
  };

  const fetchUserBreakTime = async (obj) => {
    const userBreakDetails = await UserBreakTime(obj);
    setUserBreak(userBreakDetails.data.data[0].totalBreakTimeData);
  };

  const fetchDailyLog = async (obj) => {
    const response = await DailyLog(obj);
    if (response.status == true) {
      setDataLoading(true);
      setLogDetails(response.data.data);
    }
  };

  // console.log(logDetails);

  return (
    <div className="bg-white min-h-screen flex flex-col relative attendance-log">
      <Header page_name={"view-log"} />
      <div className="">
        {dataLoading ? (
          logDetails && logDetails.absent_status == 0 ? (
            <>
              {logDetails && logDetails.checkin == 1 ? (
                <div className="my-2 mx-2 min-h-24">
                  <div className="card card-side bg-base-40 shadow-xl">
                    <div className="card-body">
                      <p className="text-xl font-bold">Company Timings</p>

                      <small className="text-sm">
                        From{" "}
                        {userData && userData.company_checkin_time
                          ? userData.company_checkin_time
                          : ""}{" "}
                        To{" "}
                        {userData && userData.company_checkout_time
                          ? userData.company_checkout_time
                          : ""}
                      </small>
                    </div>
                  </div>

                  <div className="card card-side bg-base-100 shadow-xl mt-2">
                    <figure className="w-36 p-2">
                      <img
                        src={
                          logDetails && logDetails.checkin_img
                            ? `${logDetails.checkin_img}`
                            : ""
                        }
                        className="rounded-3xl"
                        alt="img"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="font-bold text-lg">Clock In</h2>
                      <p className="text-xs">
                        {logDetails && logDetails.checkin_address
                          ? logDetails.checkin_address
                          : ""}
                      </p>
                      <small>
                        Clock In Time:{" "}
                        {logDetails && logDetails.checkin_time
                          ? moment(logDetails.checkin_time).format("HH:mm")
                          : ""}
                      </small>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {logDetails && logDetails.checkout == 1 ? (
                <div className="my-5 mx-2">
                  <div className="card card-side bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="font-bold text-lg">Clock Out</h2>
                      <p className="text-xs">
                        {logDetails && logDetails.checkout_address
                          ? logDetails.checkout_address
                          : ""}
                      </p>
                      <small>
                        Clock Out Time:{" "}
                        {logDetails && logDetails.checkout_time
                          ? moment(logDetails.checkout_time).format("HH:mm")
                          : ""}
                      </small>
                    </div>
                    <figure className="w-36 p-2">
                      <img
                        src={
                          logDetails && logDetails.checkout_img
                            ? logDetails.checkout_img
                            : ""
                        }
                        className="rounded-3xl"
                        alt="Movie"
                      />
                    </figure>
                  </div>
                </div>
              ) : (
                ""
              )}

              {userBreak?.map((res, index) => (
                <div className="my-2 mx-2" key={index}>
                  <div className="bg-white rounded-lg shadow-md p-2">
                    <h2 className="text-lg font-semibold mb-2">
                      Break {index + 1}
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm font-semibold">Start Time:</p>
                        <p className="text-sm">
                          {moment(res.break_startTime).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">End Time:</p>
                        <p className="text-sm">
                          {moment(res.break_endTime).format("DD/MM/YYYY HH:mm")}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-sm font-semibold">Remark:</p>
                        <p
                          className="text-sm"
                          style={{ wordBreak: "break-word" }}
                        >
                          {res?.remark}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="no-content">
                <img src="/img/no-attendance.svg" alt="Attendace Not Punched" />
                <Link
                  href={"/home"}
                  className="web-btn rounded-md px-8 py-4 text-white font-700 back-to-home"
                >
                  Back To Punch
                </Link>
              </div>
            </>
          )
        ) : (
          <div className="page-loader">
            {/* <div className="card text-center py-8"> */}
            {/* <div className="card-body bg-white py-8"> */}
            <span className="loading loading-dots loading-lg"></span>
            {/* </div> */}
            {/* </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLog;
