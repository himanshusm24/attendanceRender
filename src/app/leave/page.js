"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { MonthlyLog } from "@/api_calls/user/attendance/monthly-log";
import { HolidayList } from "@/api_calls/admin/holiday/get-holiday";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import moment from "moment";
import { useRouter } from "next/navigation";
import { UserLeaveList } from "@/api_calls/user/user-leave/leaveList";
import Link from "next/link";

const Leave = () => {
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [events, setEvents] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [halfDay, setHalfDay] = useState(0);
  const [userData, setUserData] = useState("");
  const router = useRouter();
  const [leaveList, setLeaveList] = useState([]);

  useEffect(() => {
    checkMonthlyLog();
  }, []);

  const checkMonthlyLog = async () => {
    const data = await GetUserDetails();

    const details = data.data.data[0];
    console.log("details: ", details);

    setUserData(details);
    // handleLeaveList({ user_id: details.id });
    const userLeaveData = await UserLeaveList({ user_id: details?.id });
    setLeaveList(userLeaveData.data.data);
    const obj = {
      company_id: details?.company_id,
      user_id: details?.id,
      attendance_date: moment().format("YYYY-MM"),
    };

    const response = await MonthlyLog(obj);
    if (response.status == true) {
      setAttendanceDetails(response.data.data);

      setPresent(response.data.present_count);

      setHalfDay(response.data.half_count);

      let absentCount = moment().format("DD");

      let totalabsent =
        absentCount - response.data.present_count - response.data.half_count;

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

  // const handleLeaveList = async () => {
  //   const data = await UserLeaveList({ user_id: userData.id });
  //   setLeaveList(data.data.data);
  // };

  const handleviewLeave = async (id) => {
    console.log("id: ", id);
    // router.push("/leave/view-leave")
  };

  const applyLeave = async () => {
    router.push("/leave/apply-leave");
  };

  return (
    <div>
      <Header page_name={"view-log"} />

      <div className="my-5">
        <div className="my-5 mx-2">
          <div className="card card-side bg-base-100 shadow-l mt-4">
            <div className="card-body p-4">
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>P L</p>

              <small style={{ fontSize: "18px" }}>
                <p> PL Available: {userData?.paid_leave_available || "0"} </p>
                <p> PL Taken: {userData?.paid_leave_taken  || "0" }  </p>
                <p> PL Balance: {userData?.paid_leave || ")"} </p>
              </small>
            </div>
            <div className="card-body p-4">
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>U L</p>

              <small style={{ fontSize: "18px" }}>
                <p> UL Available: ∞ </p>
                <p> UL Taken: {userData?.unpaid_leave || "0"} </p>
                <p> UL Balance: ∞ </p>
              </small>
            </div>
          </div>
          <div className="h-3/4 text-center px-2 pt-3">
            <button
              type="button"
              className="web-btn rounded-md px-5 py-3 w-full text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              onClick={applyLeave}
            >
              Apply Leave
            </button>
          </div>

          <div className="card card-side bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderBottom: "2px solid black",
                  textAlign: "center",
                }}
              >
                Applied Leave List
              </p>

              {leaveList?.map((res, index) => (
                <div
                  className="leave-entry flex justify-between items-center pt-4"
                  key={index}
                >
                  <div>
                    <p className="text-lg font-semibold">
                      Date: {moment(res.from_date).format("DD MM YYYY")}
                    </p>
                    <p className="text-gray-600">Status: {res.leave_status}</p>
                  </div>
                  {/* <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => handleviewLeave(res?.id)}
                  >
                    View
                  </button> */}

                  <Link
                    href={"/leave/view-leave?id=" + res?.id}
                    className="btn btn-sm btn-info text-white"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
