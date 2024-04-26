/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Header from "@/components/header/page";
import AddIcon from "@mui/icons-material/Add";
import { sendRequest } from "@/api_calls/sendRequest";
import { GetUserDetails } from "@/api_calls/user/get-user-details";

const Page = () => {
  const router = useRouter();
  const [allVisits, setAllVisits] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const currentDate = moment().format("YYYY-MM-DD");
  const [searchDate, setSearchDate] = useState(currentDate);
  const [clockoutfeedback, setClockOutFeedback] = useState("");
  const [clockoutfeedbackId, setClockOutFeedbackId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const todayDate = moment(new Date()).format("YYYY-MM-DD");

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

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
            // console.log("data: ", data);
            const formattedAddress =
              data.display_name || "Location information not available";
            setLatitude(latitude);
            setLongitude(longitude);
            setLocation(formattedAddress);
            resolve();
          },
          (error) => {
            console.error("Error getting location:", error.message);
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
    });
  };

  const handleClockout = async () => {
    await getCurrentLocation();
    if (location && longitude && latitude) {
      router.push(
        `/visits/visit-clockout?clockoutId=${clockoutfeedbackId}&location=${encodeURIComponent(
          location
        )}&latitude=${latitude}&longitude=${longitude}&feedback=${clockoutfeedback}`
      );
    }
  };

  const getAllVisits = async ({ user_id, company_id }) => {
    const data = await sendRequest(
      "get",
      `api/allVisits?user_id=${user_id}&company_id=${company_id}&attendance_date=${searchDate}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (data.status == 1) {
      setAllVisits(data.data.data);
    }
  };

  const getUserDetails = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    if (data.status == true) {
      setUserDetails(details);
      await getAllVisits({
        user_id: details.id,
        company_id: details.company_id,
      });
    }
  };

  useEffect(() => {
    getUserDetails();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userDetails.id != undefined && userDetails.company_id != undefined) {
      getAllVisits({
        user_id: userDetails.id,
        company_id: userDetails.company_id,
      });
    }
  }, [searchDate]);

  let lastVisitCheckout;
  if (allVisits && allVisits.length > 0) {
    lastVisitCheckout = allVisits[allVisits.length - 1]?.checkout;
    if (lastVisitCheckout !== undefined) {
    } else {
      // console.log("Last visit checkout not available.");
    }
  } else {
    // console.log("No visits available.");
  }

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setErrorMessage(null);
    }, 2000);

    return () => {
      clearTimeout(errorTimer);
    };
  }, [errorMessage]);

  return (
    <div className="bg-white min-h-screen flex flex-col relative home-page-data">
      <Header page_name={"visit"} />
      <label className=" input input-bordered flex items-center font-bold mt-2">
        <input
          type="date"
          placeholder=""
          className=" bg-white p-2 ml-2 w-full "
          value={searchDate ? searchDate : currentDate}
          onChange={(e) => {
            // console.log(e.target.value);
            setSearchDate(e.target.value);
          }}
        />
      </label>
      <hr className="border-gray-300 m-0 mt-2" />

      <div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-xs visit-table table-bordered">
            <thead>
              <tr>
                <th className="text-start">Client</th>
                <th>Visit In</th>
                <th>Visit Out</th>
              </tr>
            </thead>
            <tbody>
              {allVisits.map((res, index) => (
                <tr key={index}>
                  <td>
                    <p className="title">{res.reason ? res.reason : ""}</p>
                    <p className="location-text">
                      <b>Visit In:</b> {res.checkin_address}
                    </p>
                    <p className="title mt-2">
                      {res?.checkout_feedback ? res?.checkout_feedback : ""}
                    </p>
                    <p className="location-text">
                      <b>Visit Out:</b> {res?.checkout_address || "Not punched"}{" "}
                    </p>
                    {res.checkout == null ? (
                      <>
                        {currentDate == todayDate && searchDate == todayDate ? (
                          <button
                            className="web-btn p-2 mt-1 rounded-lg"
                            // onClick={() => handleClockout()}
                            onClick={() => {
                              document.getElementById("my_modal_2").showModal();
                              setClockOutFeedbackId(res.id);
                            }}
                          >
                            Punch Out
                          </button>
                        ) : (
                          ""
                        )}
                        {/* Pop up component */}
                        <dialog id="my_modal_2" className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg text-center">
                              Visit Feedback
                            </h3>
                            <p className="py-2 mt-2">
                              <input
                                type="text"
                                placeholder="Visit Feedback (Optional)"
                                className="input input-bordered input-md w-full max-w-xs"
                                onChange={(e) =>
                                  setClockOutFeedback(e.target.value)
                                }
                              />
                              {errorMessage && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errorMessage}
                                </p>
                              )}
                            </p>
                            <button
                              className="web-btn p-2"
                              onClick={() =>
                                document.getElementById("my_modal_2").close()
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="web-btn ml-2 p-2"
                              onClick={() => {
                                handleClockout();
                              }}
                            >
                              Punch
                            </button>
                          </div>
                          <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                        </dialog>
                      </>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <figure className="text-center">
                      <p className="mb-2">
                        {res.checkin_time.substring(11, 19)}
                      </p>
                      <img
                        src={res.checkin_img ? res.checkin_img : ""}
                        alt="checkin image"
                      />
                    </figure>
                  </td>
                  <td>
                    <figure className="text-center">
                      <p className="mb-2">
                        {res.checkout_time
                          ? res.checkout_time.substring(11, 19)
                          : ""}
                      </p>
                      {res.checkout_img ? (
                        <img
                          src={res.checkout_img ? res.checkout_img : ""}
                          alt="checkout image"
                        />
                      ) : (
                        "NA"
                      )}
                    </figure>
                  </td>
                </tr>
              ))}

              <hr className="font-bold text-black" />
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center px-3 py-3">
        {/* {lastVisitCheckout == null ? (
          <div
            className="dropdown dropdown-top dropdown-end rounded-3xl px-3 py-2"
          >
            <div
              tabIndex={0}
              role="button"
              className="web-btn m-1 rounded-3xl px-3 py-2"
            >
              Punch
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                >
                  Punch Out
                </button>
              </li>
              <li>
                <a href="/visits/visit-punch">Punch In</a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="web-btn rounded-3xl px-3 py-2 text-sm text-white shadow-sm hover:bg-orange-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-3 focus-visible:outline-orange-600"
            onClick={() => router.push("/visits/visit-punch")}
          >
            New Punch
          </button>
        )} */}
        {currentDate == todayDate && searchDate == todayDate ? (
          <button
            // style={{ backgroundColor: "orange !important" }}
            className="web-btn rounded-3xl px-3 py-2 text-sm text-white shadow-sm hover:bg-orange-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-3 focus-visible:outline-orange-600 visit-punch-button"
            onClick={() => router.push("/visits/visit-punch")}
          >
            New Punch
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Page;
