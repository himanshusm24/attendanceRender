/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./verify-otp.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { ChangePasswordAPI } from "@/api_calls/user/forgot-password/change-password";
import { useSearchParams } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ChangePassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [userData, setUserData] = useState("");
  const [userPassword, setuserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (event) => {
    event.preventDefault();
    setConfirmShowPassword(!confirmShowPassword);
  };

  const changePaswordEvent = async (event) => {
    event.preventDefault();

    let userType = params.get("userType");

    const response = await ChangePasswordAPI(
      userId,
      userData,
      userPassword,
      userConfirmPassword,
      userType
    );

    const details = response.data.data;

    if (response.status == true) {
      localStorage.removeItem("user_details");

      if (userType == "branch") {
        router.push("/branch");
      } 
      else if(userType == "admin"){
        router.push("/admin")
      }
      else {
        router.push("/");
      }
    } else {
      setErrorMsg(response.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    let userData = localStorage.getItem("user_details");
    let data = JSON.parse(userData);
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
          <div className="mb-4 flex items-center justify-center">
            {/* <img src="/img/logo.webp" width={180} alt="Image" /> */}
            <img src="/img/7oclockIcon.png" width={120} alt="Image" />
          </div>
          <h2 className="text-2xl font-bold text-center leading-tight text-[#188389]">
            Password
          </h2>
          <form method="POST" className="mt-4">
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
                    Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    // type="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={userPassword}
                    onChange={(e) => setuserPassword(e.target.value)}
                  ></input>
                  <button
                    className="password-toggle-btn absolute inset-y-0 right-0 mt-2 mr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-6 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    // type="password"
                    type={confirmShowPassword ? "text" : "password"}
                    value={userConfirmPassword}
                    placeholder="Enter Confirm Password"
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                  ></input>
                   <button
                    className="password-toggle-btn absolute inset-y-0 right-0 mt-2 mr-3"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmShowPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={changePaswordEvent}
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 mt-3"
                >
                  Change Password <LockOpenIcon className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
          {/* <div className="mt-6 text-center">
                        <a onClick={user_login}
                            className="font-semibold text-black transition-all duration-200 hover:underline text-[#188389]">Back to Login...!
                        </a>
                    </div> */}
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
