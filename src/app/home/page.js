/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import {
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  CalendarMonthOutlined as CalendarMonthIcon,
} from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import LoginIcon from "@mui/icons-material/Login";
import "./home.css";
import { useRouter } from "next/navigation";
import { DailyLog } from "@/api_calls/user/attendance/daily-log";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import moment from "moment";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { BreakIn } from "@/api_calls/user/attendance/break-in";
import { BreakOut } from "@/api_calls/user/attendance/break-out";
import { BreakUpdate } from "@/api_calls/user/attendance/breakUpdate";

import Link from "next/link";

const HomePage = () => {
  const router = useRouter();
  const [checkin, setCheckin] = useState(false);
  const [attendanceStep, setAttendanceStep] = useState(0);
  const [logButtonText, setLogButtonText] = useState("Clock In");
  const [checkinDetails, setcheckinDetails] = useState(null);
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loader, setLoader] = useState(true);

  const [breakRemark, setBreakRemark] = useState("");
  const [breakIn, setBreakIn] = useState(0);
  const [breakData, setBreakData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getCurrentLocation();
    checkDailyLog();
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    setUserDetails(details);
  };

  const checkDailyLog = async () => {
    const data = await GetUserDetails();
    // console.log("data: ", data);
    if (data.status == true) {
      setLoader(false);
    }
    const details = data.data.data[0];

    const obj = {
      company_id: details?.company_id,
      user_id: details?.id,
      attendance_date: moment().format("YYYY-MM-DD"),
    };

    const response = await DailyLog(obj);
    // console.log("response: ", response);
    if (response.status == true) {
      setLoader(false);
    }

    if (response.status == true) {
      setcheckinDetails(response.data.data);
      // getBreakTime(response.data.data);
      if (response.data.data && response.data.data.break_check == 1) {
        setBreakIn(1);
      }

      if (response.data.data && response.data.data.checkin == 1) {
        setCheckin(true);
        setLogButtonText("Clock Out");
        setAttendanceStep(1);
        if (
          response.data.data.checkin == 1 &&
          response.data.data.checkout == 1
        ) {
          setAttendanceStep(2);
          setLogButtonText("Attendance Punched");
        }
      } else {
        setCheckin(false);
        setLogButtonText("Clock In");
      }
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      // setLocation("Loading.....");
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );

            const data = await response.json();
            const formattedAddress =
              data.display_name || "Location information not available";
            setLatitude(latitude);
            setLongitude(longitude);
            setLocation(formattedAddress);
            resolve();
          },
          (error) => {
            console.error("Error getting location:", error.message);
            // alert("REload Page")
            // router.push("/home?fetchlocation");
            // window.location.href = "/home?fetchlocation";
            reject(error);
          }
        );
      } else {
        const error = new Error(
          "Geolocation is not supported in this browser."
        );
        console.error(error.message);
        reject(error);
      }
      // router.push("/home?fetchlocation");
    });
  };

  const goClockInPage = async () => {
    try {
      await getCurrentLocation();
      if (location.length > 5 && latitude > 0 && longitude > 0) {
        router.push(
          "/home/clock-in?location=" +
            encodeURIComponent(location) +
            `&latitude=${latitude}&longitude=${longitude}`
        );
      }
    } catch (error) {
      // Handle errors if any
      console.error("Error:", error.message);
    }
  };

  const goClockOutPage = async () => {
    const url =
      "/home/clock-out?location=" +
      location +
      `&latitude=${latitude}&longitude=${longitude}`;

    router.push(url);
  };

  const dateTime = new Date();
  const formattedDateTime = dateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const wordCount = inputText.trim().split(/\s+/).length;

    if (inputText.length > 60) {
      // setErrorMessage("Maximum 60 words allowed.");
    } else {
      setBreakRemark(inputText);
      setErrorMessage("");
    }
  };

  const submitBreakIn = async () => {
    if (breakRemark != "") {
      const obj = {
        company_id: checkinDetails.company_id,
        user_id: checkinDetails.user_id,
        attendance_date: moment(checkinDetails.checkin_time).format(
          "YYYY-MM-DD"
        ),
        break_startTime: moment(formattedDateTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        remark: breakRemark,
      };
      if (obj.remark.length > 60) {
        setErrorMessage("Maximum 60 words allowed.");
        return;
      } else {
        const response = await BreakIn(obj);
        const breakUpdateObj = {
          id: checkinDetails.id,
          breakId: "1",
          company_id: checkinDetails.company_id,
          user_id: checkinDetails.user_id,
          attendance_date: checkinDetails.checkin_time,
        };
        const break_update = await BreakUpdate(breakUpdateObj);
        setBreakIn(1);
        if (response.status == true && response.data.data.affectedRows == 1) {
          setBreakData(response);
          setBreakRemark("");
          router.push("/home");
        } else {
          console.log(response.data.message);
        }
      }
    } else {
      setErrorMessage("Enter Reason for break");
    }
  };

  const submitBreakOut = async () => {
    const obj = {
      company_id: checkinDetails.company_id,
      user_id: checkinDetails.user_id,
      attendance_date: checkinDetails.checkin_time.substring(0, 10),
      break_endTime: moment(formattedDateTime).format("YYYY-MM-DD HH:mm:ss"),
    };

    const breakUpdateObj = {
      id: checkinDetails.id,
      breakId: "0",
      company_id: checkinDetails.company_id,
      user_id: checkinDetails.user_id,
      attendance_date: checkinDetails.checkin_time,
    };
    const response = await BreakOut(obj);
    const break_update = await BreakUpdate(breakUpdateObj);
    if (response.status == true && response.data.data.affectedRows == 1) {
      setBreakIn(0);
      router.push("/home");
    } else {
      console.log(response.data.message);
    }
  };
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      setCompanyName(localStorage.getItem("user_company_name"));
    };

    if (typeof window !== "undefined") {
      setCompanyName(localStorage.getItem("user_company_name"));
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data">
      <Header page_name={"home"} />
      {loader == true ? (
        <div className="bg-white p-2 shadow-md">
          <div className="skeleton w-full h-[21px]"></div>
        </div>
      ) : (
        <div className="bg-white p-2 shadow-md">
          <p className="font-bold">{companyName}</p>
        </div>
      )}

      {userDetails && userDetails?.name && userDetails.designation ? (
        <div
          id="parent-1"
          className="rounded-md bg-white p-4 shadow-md mt-3 mx-4"
        >
          <div id="one" className="flex items-center">
            <Avatar
              alt="User Profile"
              src={
                userDetails && userDetails?.profile_image != null
                  ? `${userDetails?.profile_image}`
                  : "/img/user.png"
              }
              className="w-20 h-20"
            />
            <div className="ml-5">
              <p className="font-bold text-2xl">
                {userDetails && userDetails?.name}
              </p>
              <p className="mt-2 font-500">
                {userDetails && userDetails.designation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="parent-1"
          className="rounded-md bg-white p-4 shadow-md mt-3 mx-4"
        >
          <div className="skeleton w-full p-4 h-[93px]"></div>
        </div>
      )}

      {loader == true ? (
        <div
          id="parent-1"
          className="rounded-md bg-white p-4 shadow-md mt-3 mx-4"
        >
          <div className="skeleton w-full p-4 h-[92px]"></div>
        </div>
      ) : (
        <div className=" rounded-md bg-white shadow-md mt-4 mx-4">
          <div className="h-1/4 flex items-center justify-between px-3 py-1 mt-2">
            <div className="flex items-center">
              <img
                src="/img/attendance.png"
                className="w-6 h-6"
                alt="User Profile"
              />
              <p className="ml-2 font-bold">Attendance</p>
            </div>
          </div>
          <hr className="border-gray-300 m-0 mt-2" />
          {breakIn == 0 ? (
            <div className="text-center px-3 py-3">
              {attendanceStep === 0 ? (
                <button
                  type="button"
                  className="web-btn rounded-md px-5 py-2 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-3 focus-visible:outline-green-600"
                  onClick={goClockInPage}
                >
                  {logButtonText} <LoginIcon />
                </button>
              ) : attendanceStep === 1 ? (
                <button
                  type="button"
                  className="web-btn rounded-md px-5 py-2 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-3 focus-visible:outline-green-600"
                  onClick={goClockOutPage}
                >
                  {logButtonText} <LoginIcon />
                </button>
              ) : (
                <button className="web-btn rounded-md px-5 py-2 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-3 focus-visible:outline-green-600">
                  {logButtonText} <CheckBoxIcon />
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      )}

      {attendanceStep == 1 ? (
        <div className=" rounded-md bg-white shadow-md mt-4 mx-4">
          <div className="h-1/4 flex items-center justify-between px-3 py-1 mt-2">
            <div className="flex items-center">
              <img
                src="/img/attendance.png"
                className="w-6 h-6"
                alt="User Profile"
              />
              <p className="ml-2 font-bold">Break Time</p>
            </div>
          </div>
          <hr className="border-gray-300 m-0 mt-2" />
          <div className="text-center px-3 py-3">
            {breakIn == 0 ? (
              <div className="mb-4">
                <label htmlFor="reason" className="block font-bold mb-1">
                  Reason<span className="text-red-500">*</span>:
                </label>
                <input
                  id="reason"
                  type="text"
                  className="border border-black px-2 py-1 w-full"
                  value={breakRemark}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
            ) : (
              ""
            )}

            {breakIn == 0 ? (
              <button
                className="web-btn rounded-md px-5 py-2 text-sm text-white bg-green-500 shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:border-green-600"
                onClick={() => submitBreakIn()}
              >
                Break In <CheckBoxIcon />
              </button>
            ) : (
              ""
            )}
            {breakIn == 1 ? (
              <button
                className="web-btn rounded-md px-5 py-2 text-sm text-white bg-green-500 shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:border-green-600"
                onClick={() => submitBreakOut()}
              >
                Break Out <CheckBoxIcon />
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {/* <div className="rounded-md bg-white shadow-md mt-4 mx-4">
        <div className="flex items-center">
          <p className="ml-2 font-bold">Punch In</p>
        </div>
        <hr className="border-gray-300 m-0 mt-2" />
        <div className="h-3/4 text-center px-2 py-3">
          <button
            type="button"
            className="web-btn rounded-md px-5 py-3 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            // onClick={getCurrentLocation}
            // onClick={() => router.push("/get-current-location")}
          >
            Punch In
          </button>
        </div>
      </div> */}

      {location != null ? (
        <div id="parent-2" className="rounded-md bg-white shadow-md mt-4 mx-4">
          <div className="h-1/4 flex items-center justify-between px-3 py-1 mt-2">
            <div className="flex items-center">
              <img alt="User Profile" src="/img/map.png" className="w-6 h-6" />
              <p className="ml-2 font-bold">Your Location</p>
            </div>
          </div>

          <hr className="border-gray-300 m-0 mt-2" />

          <div className="h-3/4 text-center px-2 py-3">
            <p
              id="current-location"
              className="mt-2 mb-2 text-sm font-semibold px-3"
            >
              {/* {location != null ? location : "Loading....."} */}
              {/* {location != null ? (
              location
            ) : (
              <span className="loading loading-spinner loading-lg"></span>
            )} */}
              {location}
            </p>
            <p className="text-sm mb-4">(Accurate up to 50 Meters)</p>

            <button
              type="button"
              className="web-btn rounded-md px-5 py-3 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              // onClick={getCurrentLocation}
              onClick={() => router.push("/get-current-location")}
            >
              Refresh Location
            </button>
          </div>
        </div>
      ) : (
        <div id="parent-2" className="rounded-md bg-white shadow-md mt-4 mx-4">
          <div className="skeleton w-full h-[190px]"></div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
