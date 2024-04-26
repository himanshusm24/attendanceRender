/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./verify-otp.css";
import DoneIcon from "@mui/icons-material/Done";
import { OTPVerificationAPI } from "@/api_calls/user/forgot-password/verify-otp";

const VerifyOtp = () => {
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const params = useSearchParams();

  const userType = params.get("userType");
  console.log("userType: ", userType);

  const verify_otp = async (event) => {
    event.preventDefault();

    const response = await OTPVerificationAPI(userData, userOtp, userType);

    const details = response.data.data;

    if (response.status == true) {
      router.push(`/auth/change-password?userType=${userType}`);
    } else {
      setErrorMsg(response.message);
    }
  };

  const user_login = async (event) => {
    event.preventDefault();
    router.push("/auth/login");
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    let userData = localStorage.getItem("user_details");
    let data = JSON.parse(userData);
    console.log("data: ", data);
    setUserData(data.email);
    setUserId(data.id);
  };

  return (
    <section className="min-h-screen rounded-md bg-[#188389] p-2 verify-otp-page">
      <div className="block items-center justify-center h-full bg-white px-8 pt-10 sm:px-12 sm:py-16 lg:px-8">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          {" "}
          {errorMsg != "" ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
              role="alert"
            >
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          ) : (
            ""
          )}
          <div className="mb-8 flex items-center justify-center">
            {/* <img src="/img/logo.webp" width={180} alt="Image" /> */}
            <img src="/img/7oclockIcon.png" width={120} alt="Image" />
          </div>
          <h2 className="text-2xl font-bold text-center leading-tight text-[#188389]">
            Otp Verification
          </h2>
          <form method="POST" className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="Email Address"
                    readOnly
                    value={userData}
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    OTP
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="number"
                    placeholder="Enter OTP"
                    onChange={(e) => setUserOtp(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={verify_otp}
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 mt-3"
                >
                  Verify Otp <DoneIcon className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a
              onClick={user_login}
              className="font-semibold text-black transition-all duration-200 hover:underline text-[#188389]"
            >
              Back to Login...!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;
