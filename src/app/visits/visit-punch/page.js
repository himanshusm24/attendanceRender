"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import LoginIcon from "@mui/icons-material/Login";
import Header from "@/components/header/page";

const VisitIn = () => {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      setLocation("Loading.....");
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
      if (reason == "") {
        setErrorMessage("Enter reason first");
        return console.log("Please enter reason first");
      }

      // await getCurrentLocation();
      router.push(
        "/visits/visit-clockIn?location=" +
          encodeURIComponent(location) +
          `&latitude=${latitude}&longitude=${longitude}&reason=${reason}`
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setErrorMessage(null);
    }, 2000);

    return () => {
      clearTimeout(errorTimer);
    };
  }, [errorMessage]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative home-page-data">
      <Header page_name={"visit"} />
      <div className=" rounded-md bg-white shadow-md mt-4">
        <div className="text-left px-3 py-3">
          <div className="mb-4">
            <label htmlFor="reason" className="block font-bold mb-1">
              Reason<span className="text-red-500">*</span>:
            </label>
            <input
              id="reason"
              type="text"
              className="border border-black px-2 py-1 w-full"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoComplete="off"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300 m-0 mt-2" />

      <div className="text-center px-3">
        <button
          type="button"
          className="web-btn rounded-md px-5 py-2 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={goClockInPage}
        >
          Visit In
        </button>
      </div>

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
            {location != null ? location : "Loading....."}
          </p>
          <p className="text-sm mb-4">(Accurate up to 50 Meters)</p>

          <button
            type="button"
            className="web-btn rounded-md px-5 py-3 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => getCurrentLocation()}
          >
            Refresh Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitIn;
