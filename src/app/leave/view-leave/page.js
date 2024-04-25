"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { useSearchParams } from "next/navigation";
import { UserLeaveList } from "@/api_calls/user/user-leave/leaveList";
import moment from "moment";

const Leave = () => {
  const params = useSearchParams();
  const userviewid = params.get("id");
  const [userLeave, setUserLeave] = useState("");

  const handleLeaveList = async () => {
    const data = await UserLeaveList({ id: userviewid });
    // console.log("data: ", data);
    setUserLeave(data.data.data[0]);
  };

  useEffect(() => {
    handleLeaveList();
  }, []);

  return (
    <div>
      <Header page_name={"view-log"} />

      <div className=" bg-white w-full p-4">
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "2px solid black",
            textAlign: "center",
          }}
        >
          View
        </p>
        <div className="grid md:grid-cols-1 mt-6">
          <div className="mx-2 w-full">
            <table className="table-fixed w-full">
              <tbody>
                <tr>
                  <td className="text-l font-bold w-1/3">From Date:</td>
                  <td> {moment(userLeave?.from_date).format("DD MM YYYY")} </td>
                </tr>
                <tr>
                  <td className="text-l font-bold w-1/3">To Date:</td>
                  <td> {moment(userLeave?.to_date).format("DD MM YYYY")} </td>
                </tr>
                <tr>
                  <td className="text-l font-bold w-1/3">To email:</td>
                  <td style={{ wordBreak: "break-word" }}>
                    {" "}
                    {userLeave.to_email}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="text-l font-bold w-1/3">Subject:</td>
                  <td style={{ wordBreak: "break-word" }}>
                    {" "}
                    {userLeave?.subject}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="text-l font-bold w-1/3">Status:</td>
                  <td> {userLeave?.leave_status} </td>
                </tr>
                {/* <tr>
                  <td className="text-l font-bold w-1/3">Body:</td>
                  <td style={{ wordBreak: "break-word" }}>
                    {userLeave?.message}
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div>
            <h1 className="font-bold text-center pt-2">Body</h1>
            <div
              style={{ wordBreak: "break-word" }}
              className="p-4"
              dangerouslySetInnerHTML={{ __html: userLeave?.message }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
