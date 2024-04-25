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
import "./add-company.css";
import { CompanyLists } from "@/api_calls/admin/company/company-list";
import { CreateCompany } from "@/api_calls/admin/company/create-company";
import { UpdateCompany } from "@/api_calls/admin/company/update-company";

const AddCompany = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Company");
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const getCompanyDetails = async () => {
    const company_id = atob(params.get("company_id"));
    console.log("company_id", company_id);

    if (company_id > 0) {
      setCompanyId(company_id);
      const data = await CompanyLists(company_id);
      const details = data.data.data[0];

      console.log(details);

      setCompanyId(details.company_id);
      setName(details.name);
      setEmail(details.email);
      setContact(details.contact);
      setAddress(details.address);
      setCheckInTime(details.checkin_time);
      setCheckOutTime(details.checkout_time);

      setBtnName("Update Company");
      setEditMessage(
        "(Please Enter Password, If you want to change your password)"
      );
    }
  };

  const createCompany = async (event) => {
    event.preventDefault();

    if (
      name != "" &&
      email != "" &&
      contact != "" &&
      address != "" &&
      checkInTime != "" &&
      checkOutTime != ""
    ) {
      const obj = {
        name: name,
        email: email,
        contact: contact,
        address: address,
        password: password,
        checkin_time: checkInTime,
        checkout_time: checkOutTime,
      };

      const company_id = atob(params.get("company_id"));

      const reponse =
        company_id > 0
          ? await UpdateCompany(obj, company_id)
          : await CreateCompany(obj);

      if (reponse.status == true && reponse.data.data.affectedRows == 1) {
        router.push("/admin/manage-company");
      } else {
        setErrorMsg(reponse.message);
      }
    } else {
      setErrorMsg("Please Enter All Details");
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
            breadcumr1={"Manage Company"}
            breadcumr1_link={"/admin/manage-company"}
            breadcumr2={btnName}
            button_name={"Employee List"}
            button_link={"/admin/manage-users"}
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
                <form onSubmit={createCompany} method="post" autoComplete="off">
                  <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Company Name</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="input input-bordered w-full"
                        name="name"
                        minLength={5}
                        maxLength={50}
                        required={true}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        value={name}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Contact Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Company Contact"
                        className="input input-bordered w-full"
                        name="contact"
                        required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          setContact(e.target.value);
                        }}
                        value={contact}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Email Address</span>
                      </div>
                      <input
                        type="email"
                        placeholder="Company Email"
                        className="input input-bordered w-full"
                        name="email"
                        required={true}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">
                          Password <small>{editMessage}</small>
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Company Password"
                        className="input input-bordered w-full"
                        name="password"
                        require={true}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Check In Time</span>
                      </div>
                      <input
                        type="time"
                        name="checkinTme"
                        className="input input-bordered w-60"
                        require={true}
                        onChange={(e) => {
                          setCheckInTime(e.target.value);
                        }}
                        value={checkInTime}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Check Out Time</span>
                      </div>
                      <input
                        type="time"
                        name="checkouttime"
                        className="input input-bordered w-60"
                        require={true}
                        onChange={(e) => {
                          setCheckOutTime(e.target.value);
                        }}
                        value={checkOutTime}
                      />
                    </div>
                  </div>
                  <div className="gap-4 grid md:grid-cols-1 md:space-y-0 mt-3">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Company Address</span>
                      </div>
                      <textarea
                        placeholder="Company Address"
                        name="address"
                        className="input input-bordered w-full p-3 address"
                        rows="5"
                        required={true}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        value={address}
                      >
                        {address}
                      </textarea>
                    </div>
                    <div className="w-full">
                      <button
                        type="submit"
                        className="btn web-btn text-white sm:mt-0"
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

export default AddCompany;
