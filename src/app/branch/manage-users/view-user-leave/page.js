/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import CompanyHeader from "@/components/admin/companyHeader/page";
import Sidebar from "@/components/admin/sidebar/page";
import CompanySidebar from "@/components/admin/companySidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { UserLeaveList } from "@/api_calls/user/user-leave/leaveList";
import { UserApproveLeave } from "@/api_calls/admin/user-leave/ApproveLeave";

const ViewUserLeave = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userviewid = params.get("id");
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [btnName, setBtnName] = useState("View-Leave");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userLeave, setUserLeave] = useState("");

  const handleLeaveList = async () => {
    const data = await UserLeaveList({ id: userviewid });
    console.log('data: ', moment(data.data.data[0].to_date).format("DD") - moment(data.data.data[0].from_date).format("DD") );
    setUserLeave(data.data.data[0]);
  };

  useEffect(() => {
    handleLeaveList();
  }, []);

  const handleApproveLeave = async () => {
    const userLeaveCount = moment(userLeave.to_date).format("DD") - moment(userLeave.from_date).format("DD")
    const data = await UserApproveLeave({
      id: userviewid,
      leave_status: "approved",
      user_id: userLeave.user_id,
      leave_count: userLeaveCount
    });
    console.log("data: ", data);
    // if(data.data.data)
    if (data.data.data.affectedRows == 1) {
      setSuccessMsg("Leave Approved");
    }
  };

  const handleRejectLeave = async () => {
    const data = await UserApproveLeave({
      id: userviewid,
      leave_status: "rejected",
    });
    console.log("data: ", data);
    if (data.data.data.affectedRows == 1) {
      setErrorMsg("Leave Rejected");
    }
  };

  useEffect(() => {
    const clearErrorMessage = () => {
      setErrorMsg("");
    };

    if (errorMsg !== "") {
      const timerId = setTimeout(clearErrorMessage, 2000);
      return () => clearTimeout(timerId);
    }
  }, [errorMsg]);

  useEffect(() => {
    const clearSuccessMessage = () => {
      setSuccessMsg("");
    };

    if (successMsg !== "") {
      const timerId = setTimeout(clearSuccessMessage, 2000);
      return () => clearTimeout(timerId);
    }
  }, [successMsg]);

  return (
    <div className="main-wrapper">
      <CompanySidebar
        sidemenu={`${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}
      />
      <div className="rightside">
        <CompanyHeader
          clickEvent={() => {
            setSidebarVisible(!isSidebarVisible);
          }}
          sidebarVisible={isSidebarVisible}
        />
        <section className="mx-auto w-full">
          <BreadCrum
            breadcumr1={"Manage Employee"}
            breadcumr1_link={"/admin/manage-users"}
            breadcumr2={btnName}
          />

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
          {successMsg != "" && successMsg != null ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
              role="alert"
            >
              <span className="block sm:inline">{successMsg}</span>
            </div>
          ) : (
            ""
          )}

          <div className="bg-white p-4 rounded-md shadow-md mt-4">
            {userLeave.leave_status === "rejected" ? (
              <div className="">
                <button
                  className="btn btn-m btn-success text-white rounded-m"
                  onClick={() => handleApproveLeave()}
                >
                  Approve
                </button>
              </div>
            ) : userLeave.leave_status === "pending" ? (
              <div className="">
                <button
                  className="btn btn-m btn-success text-white rounded-m"
                  onClick={() => handleApproveLeave()}
                >
                  Approve
                </button>
                <button
                  className="btn btn-m btn-error text-white ml-2"
                  onClick={() => handleRejectLeave()}
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="">
                <button
                  className="btn btn-m btn-error text-white rounded-m"
                  onClick={() => handleRejectLeave()}
                >
                  Reject
                </button>
              </div>
            )}

            <div className="flex flex-col pt-4">
              <span className="font-bold">Status:</span>
              <span>{userLeave?.leave_status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex flex-col">
                <span className="font-bold">From Date:</span>
                <span>{moment(userLeave?.from_date).format("DD MM YYYY")}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">To Date:</span>
                <span>{moment(userLeave?.to_date).format("DD MM YYYY")}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">To Email:</span>
                <a
                  href={`mailto:${userLeave.to_email}`}
                  className="hover:underline"
                >
                  {userLeave.to_email}
                </a>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Subject:</span>
                <span>{userLeave?.subject}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-bold">Body:</span>
              <p>{userLeave?.message}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewUserLeave;
