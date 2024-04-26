"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/page";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import moment from "moment/moment";
import { UpdateUser } from "@/api_calls/admin/user/update-user";

const PersonalDetails = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    contact: "",
    email: "",
    dob: "",
    gender: "",
    designation: "",
    aadhar_no: "",
    pan_no: "",
  });
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    setUserDetails(details);
  };

  const updateUserProfile = async (event) => {
    event.preventDefault();

    if (
      userDetails.gender != "" &&
      userDetails.aadhar_no != "" &&
      userDetails.pan_no != ""
    ) {
      const obj = {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
        designation: userDetails.designation,
        dob: moment(userDetails.dob).format("YYYY-MM-DD"),
        gender: userDetails.gender,
        aadhar_no: userDetails.aadhar_no,
        pan_no: userDetails.pan_no,
      };

      const user_id = localStorage.getItem("user_id");

      const reponse = await UpdateUser(obj, user_id);

      if (reponse.status == true && reponse.data.data.affectedRows == 1) {
        setErrorMsg("");
        setSuccessMsg("User Updated Successfully");
      } else {
        setErrorMsg(reponse.message);
      }
    } else {
      setErrorMsg("Please Enter All Details");
    }
  };

  return (
    <>
      <Header page_name="personal-details" />
      {successMsg != "" && successMsg != null ? (
        <div className="mt-2">
          <div
            className="bg-green-100 border border-green-400 px-4 py-3 rounded relative mb-3"
            role="alert"
          >
            <span className="block sm:inline">{successMsg}</span>
          </div>
        </div>
      ) : (
        ""
      )}
      {errorMsg != "" && errorMsg != null ? (
        <div className="mt-2">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
            role="alert"
          >
            <span className="block sm:inline">{errorMsg}</span>
          </div>
        </div>
      ) : (
        ""
      )}
      <form onSubmit={updateUserProfile} method="POST">
        <div className="bg-gray-100 min-h-screen flex flex-col relative">
          <div className="p-4">
            <p className="text-sm text-gray-400 text-left">Name</p>
            <input
              className="bg-gray-100 mt-2 border border-gray-300 p-2 w-full relative"
              type="text"
              value={userDetails.name}
              readOnly
            />
          </div>

          <div className="px-4">
            <p className="text-sm text-gray-400 text-left">Mobile Number</p>
            <div className="relative">
              <input
                className="bg-gray-100 mt-2 border border-gray-300 p-2 w-full"
                type="number"
                value={userDetails.contact}
                readOnly
              />
            </div>
          </div>

          <div className="px-4 mt-4">
            <p className="text-sm text-gray-400 text-left">Email Address</p>
            <div className="relative">
              <input
                className="mt-2 bg-gray-100 border border-gray-300 p-2 w-full"
                type="email"
                value={userDetails.email}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    email: e.target.value,
                  }));
                }}
                readOnly
              />
            </div>
          </div>

          <div className="px-4 mt-4">
            <p className="text-sm text-gray-400 text-left">Date of Birth</p>
            <div className="relative">
              {}
              <input
                className="bg-white mt-2 border border-gray-300 p-2 w-full"
                type="date"
                placeholder="DD/MM/YY"
                min={moment().subtract(80, "years").format("YYYY-MM-DD")}
                max={moment().subtract(10, "years").format("YYYY-MM-DD")}
                value={moment(userDetails.dob).format("YYYY-MM-DD")}
                defaultValue={moment(userDetails.dob).format("YYYY-MM-DD")}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    dob: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="px-4 mt-4">
            <p className="text-sm text-gray-400 text-left">Gender</p>
            <div className="relative">
              <select
                className="bg-white border border-gray-300 p-2 w-full mt-2"
                name="gender"
                value={userDetails.gender}
                required={true}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    gender: e.target.value,
                  }));
                }}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="px-4 mt-4">
            <p className="text-sm text-gray-400 text-left">Designation</p>
            <div className="relative">
              <input
                className="mt-2 border border-gray-300 p-2 w-full"
                type="text"
                value={userDetails.designation}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    designation: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="px-4 mt-4">
            <p className="text-sm text-gray-400 text-left">Aadhar Number</p>
            <div className="relative">
              <input
                className="mt-2 border border-gray-300 p-2 w-full"
                type="number"
                value={userDetails.aadhar_no}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    aadhar_no: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="px-4 mt-4 mb-3">
            <p className="text-sm text-gray-400 text-left">Pan Number</p>
            <div className="relative">
              <input
                className="mt-2 border border-gray-300 p-2 w-full"
                type="text"
                value={userDetails.pan_no}
                onChange={(e) => {
                  setUserDetails((details) => ({
                    ...details,
                    pan_no: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="mt-4 bg-white h-14">
            <div className="bg-white p-2 fixed bottom-0 w-full flex justify-center">
              <button
                type="submit"
                className="web-btn text-white text-xl font-lg h-12 w-full"
              >
                Update User Details
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PersonalDetails;
