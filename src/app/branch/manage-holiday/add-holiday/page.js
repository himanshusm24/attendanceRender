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
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { CreateUser } from "@/api_calls/admin/user/create-user";
import { useSearchParams } from "next/navigation";
import { UserLists } from "@/api_calls/admin/user/user-list";
import { UpdateUser } from "@/api_calls/admin/user/update-user";
import { CreateHoliday } from "@/api_calls/admin/holiday/add-holiday";
import { HolidayList } from "@/api_calls/admin/holiday/get-holiday";
import { UpdateHoliday } from "@/api_calls/admin/holiday/update-holiday";

const AddHoliday = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Holiday");
  const [company, setCompany] = useState("");
  const [holiday_title, setHolidayTitle] = useState("");
  const [holiday_date, setHolidayDate] = useState("");
  const [holidayId, setHolidayId] = useState("");

  useEffect(() => {
    getCompanyList();
    getHolidayDetails();
  }, []);

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data.data.data;
    setCompanyList([...companyList, ...list]);
  };

  const addHoliday = async (event) => {
    event.preventDefault();

    if (holiday_date != "" && holiday_title != "") {
      const obj = {
        company_id: localStorage.getItem("companyAdmin_id"),
        holiday_date: holiday_date,
        holiday_title: holiday_title,
      };

      const holiday_id = params.get("holiday_id");

      const response =
        holiday_id > 0
          ? await UpdateHoliday(obj, holiday_id)
          : await CreateHoliday(obj);

      //   const response = await CreateHoliday(obj);
      if (response.status == true && response.data.data.affectedRows == 1) {
        router.push("/branch/manage-holiday");
      } else {
        setErrorMsg(response.message);
      }
    } else {
      setErrorMsg("Please Enter All Details");
    }
  };

  // const getHolidayDetails = async () => {
  //   const holiday_id = params.get("holiday_id");
  //   console.log("holiday_id", holiday_id);

  //   if (holiday_id > 0) {
  //     setHolidayId(holiday_id);
  //     const data = await HolidayList(holiday_id);
  //     const details = data.data.data[0];

  //     console.log(details.company_name);

  //     setHolidayTitle(details.holiday_title);
  //     const formattedDate = new Date(details.holiday_date)
  //       .toISOString()
  //       .split("T")[0];

  //     setHolidayDate(formattedDate);
  //     setCompany(details.company);
  //     setBtnName("Update Holiday");
  //   }
  // };

  const getHolidayDetails = async () => {
    const holiday_id = params.get("holiday_id");
    console.log("holiday_id", holiday_id);

    if (holiday_id > 0) {
      setHolidayId(holiday_id);
      const data = await HolidayList(holiday_id);
      const details = data.data.data[0];

      console.log(details.company_id);

      setHolidayTitle(details.holiday_title);
      const formattedDate = new Date(details.holiday_date)
        .toISOString()
        .split("T")[0];

      setHolidayDate(formattedDate);
      setCompany(details.company);
      setBtnName("Update Holiday");
    }
  };


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
            breadcumr1={"Manage Holiday"}
            breadcumr1_link={"/branch/manage-holiday"}
            breadcumr2={btnName}
            button_name={"Holiday List"}
            button_link={"/branch/manage-holiday"}
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
          <div className="mt-3">
            <div className="card">
              <div className="card-header bg-white p-3 pb-4 border">
                <h3 className="font-bold">{btnName}</h3>
              </div>
              <div className="card-body bg-white py-2">
                <form onSubmit={addHoliday} method="post" autoComplete="off">
                  <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Holiday Title</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Holiday Title"
                        className="input input-bordered w-full"
                        name="name"
                        minLength={5}
                        maxLength={50}
                        required={true}
                        onChange={(e) => {
                          setHolidayTitle(e.target.value);
                        }}
                        value={holiday_title}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Holiday Date</span>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        name="holiday_date"
                        required={true}
                        onChange={(e) => {
                          setHolidayDate(e.target.value);
                        }}
                        value={holiday_date}
                      />
                    </div>

                    <div className="w-full">
                      <button
                        type="submit"
                        className="btn web-btn text-white sm:mt-0 md:mt-4"
                      >
                        {btnName}
                      </button>
                      <button
                        type="reset"
                        className="btn btn-warning mx-5 px-8"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddHoliday;
