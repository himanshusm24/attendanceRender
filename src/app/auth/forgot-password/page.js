/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./forgot-password.css";
import LockIcon from "@mui/icons-material/Lock";
import { ForgotPasswordAPI } from "@/api_calls/user/forgot-password/forgot-password";
import { useSearchParams } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [userData, setuserData] = useState("");
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    contact: "",
    gender: "",
    dob: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const params = useSearchParams();
  const userType = params.get("userType");

  // useEffect(() => {
  //   if (userType === "admin") {
  //     setuserData("admin@admin.com");
  //   }
  // }, [userType]);

  const send_otp = async (event) => {
    event.preventDefault();
    let response;
    if (userData) {
      response = await ForgotPasswordAPI(userData, userType);
    }
    else{
      setErrorMsg("Enter Email")
    }
    console.log("response: ", response);
    const details = response.data.data;
    if (response.status == true) {
      localStorage.setItem("user_details", JSON.stringify(details));
      setUserDetails(details);
      router.push(`/auth/verify-otp?userType=${userType}`);
    } else {
      
      setErrorMsg(response.message);
    }
  };

  const user_login = async (event) => {
    event.preventDefault();
    if (userType == "admin") {
      router.push("/admin");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <section className="min-h-screen rounded-md bg-[#188389] p-2 forgot-password">
      <div className="block items-center justify-center h-full bg-white px-8 pt-10 sm:px-12 sm:py-16 lg:px-8">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
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
            Forgot Password
          </h2>

          <form method="POST" className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    value={userData}
                    onChange={(e) => setuserData(e.target.value)}
                  ></input>
                </div>
              </div>
              {/* <div className="flex items-center ml-1 mr-1">
                <hr className="flex-grow border-t border-gray-400" />
                <span className="mx-4 text-gray-400">or</span>
                <hr className="flex-grow border-t border-gray-400" />
              </div> */}
              {/* <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Mobile Number
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="number"
                    placeholder="Mobile Number"
                    onChange={e => setuserData(e.target.value)}
                  ></input>
                </div>
              </div> */}
              <div className="w-full">
                <button
                  onClick={send_otp}
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Send OTP <LockIcon className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>

          <div className="text-center">
            <p className="mt-5 text-sm text-gray-600 ">
              User already exist..!
              <a
                onClick={user_login}
                title=""
                className="font-semibold text-black transition-all duration-200 hover:underline text-[#188389]"
              >
                {" "}
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
