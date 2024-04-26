/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/admin/header/page";
import Sidebar from "@/components/admin/sidebar/page";
import BreadCrum from "@/components/admin/breadCrum/page";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { UpdateAdmin } from "@/api_calls/admin/updateAdmin";
import { getAdmin } from "@/api_calls/admin/getAdmin";

const AddUsers = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [btnName, setBtnName] = useState("Company Details");
  const [disabledInput, setDisabledInput] = useState(false);

  const [companyName, setCompanyName] = useState("");
  // const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState("");
  const [bussinessType, setBussinessType] = useState("");
  const [contact, setContact] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [epfNo, setEpfNo] = useState("");
  const [establishedDate, setEstablishedDate] = useState("");
  const [panNo, setPanNo] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [gstNo, setGstNo] = useState("");

  useEffect(() => {
    getAdminDetails();
  }, []);

  // const getCompanyList = async () => {
  //   const data = await CompanyLists();
  //   const list = data.data.data;
  //   setCompanyList([...companyList, ...list]);
  // };

  // const getRoleData = async () => {
  //   const data = await getRole();
  //   setRoleDetail(data.data.data);
  // };
  // const getDepartmentData = async () => {
  //   const data = await getDepartment();
  //   setDepartmentDetail(data.data.data);
  // };

  const getAdminDetails = async () => {
    const data = await getAdmin();
    // console.log("data: ", data.data.data[0]);
    const companydetail = data?.data?.data[0];
    setCompanyName(companydetail?.company_name);
    setCompanyEmail(companydetail?.company_email);
    setBussinessType(companydetail?.company_bussiness_type);
    setContact(companydetail?.company_contact_no);
    setRegistrationNo(companydetail?.company_registration_no);
    setEpfNo(companydetail?.company_epf_no);
    setEstablishedDate(
      moment(companydetail?.company_established_date).format("YYYY-MM-DD")
    );
    setPanNo(companydetail?.company_pan_no);
    setCompanyAddress(companydetail?.company_address);
    setGstNo(companydetail?.company_gst_no);
  };

  const UpdateAdminDetail = async (event) => {
    event.preventDefault();

    const obj = {
      company_name: companyName,
      company_email: companyEmail,
      company_address: companyAddress,
      company_bussiness_type: bussinessType,
      company_contact_no: contact,
      company_pan_no: panNo,
      company_registration_no: registrationNo,
      company_epf_no: epfNo,
      company_gst_no: gstNo,
      company_established_date: establishedDate,
      // company_country: dob,
      // company_state: dob,
      // company_city: dob,
    };

    const response = await UpdateAdmin(obj);

    if (response.status == true && response.data.data.affectedRows == 1) {
      // router.push("/admin/manage-users");
      setSuccessMsg("Company Data successfully edited");
      localStorage.setItem("company_name", companyName);
    } else {
      setErrorMsg(response.message);
    }
  };

  return (
    <div className="main-wrapper">
      <Sidebar
        sidemenu={`${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}
      />
      <div className="rightside">
        <Header
          clickEvent={() => {
            setSidebarVisible(!isSidebarVisible);
          }}
          sidebarVisible={isSidebarVisible}
        />
        <section className="mx-auto w-full">
          <BreadCrum
            breadcumr1={"Manage Company Details"}
            breadcumr1_link={"/admin/basic-details"}
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
          {successMsg != "" && successMsg != null ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
              role="alert"
            >
              <span className="block sm:inline">{successMsg}</span>
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
                <form
                  onSubmit={UpdateAdminDetail}
                  method="post"
                  autoComplete="off"
                >
                  <div className="gap-4 grid md:grid-cols-3 md:space-y-0">
                    {/* <div className="w-full">
                      <div className="label">
                        <span className="label-text">Company List</span>
                      </div>
                      <select
                        className="input input-bordered w-full"
                        name="company"
                        onChange={(e) => {
                          setCompanyId(e.target.value);
                        }}
                        value={companyId}
                      >
                        <option value="" disabled selected>
                          Select Company
                        </option>
                        {companyList?.map((company, index) => {
                          return (
                            <>
                              <option value={company.id} key={index}>
                                {company.name}
                              </option>
                            </>
                          );
                        })}
                      </select>
                    </div> */}
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Company Name</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="input input-bordered w-full"
                        name="companyname"
                        minLength={5}
                        maxLength={50}
                        required={true}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                        }}
                        value={companyName}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Company Email</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Company Email"
                        name="companyEmail"
                        className="input input-bordered w-full"
                        required={true}
                        onChange={(e) => {
                          setCompanyEmail(e.target.value);
                        }}
                        value={companyEmail}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text"> Bussiness Type</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="bussinessType"
                        required={true}
                        value={bussinessType}
                        onChange={(e) => {
                          setBussinessType(e.target.value);
                        }}
                      >
                        <option value="" selected="" disabled="">
                          Select Type of Business
                        </option>
                        <option value="Sole proprietorship">
                          Sole proprietorship
                        </option>
                        <option value="Partnership">Partnership</option>
                        <option value="Limited liability company">
                          Limited liability company
                        </option>
                        <option value="Cooperative">Cooperative </option>
                        <option value="Corporation">Corporation</option>

                        {/* {departmentDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))} */}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Established Date</span>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        name="dob"
                        onChange={(e) => {
                          setEstablishedDate(e.target.value);
                        }}
                        value={establishedDate}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Contact Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Contact Number"
                        className="input input-bordered w-full"
                        name="contact"
                        required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setContact(e.target.value);
                          }
                        }}
                        value={contact}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Registration Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Registration Number"
                        className="input input-bordered w-full"
                        name="contact"
                        // required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setRegistrationNo(e.target.value);
                          }
                        }}
                        value={registrationNo}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">E.P.F Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Company EPF"
                        className="input input-bordered w-full"
                        name="epfNo"
                        // required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setEpfNo(e.target.value);
                          }
                        }}
                        value={epfNo}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">GST Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Company GST"
                        className="input input-bordered w-full"
                        name="epfNo"
                        // required={true}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setGstNo(e.target.value);
                          }
                        }}
                        value={gstNo}
                      />
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Pan Number</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Company Pan Number"
                        className="input input-bordered w-full"
                        name="pan_no"
                        // require={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setPanNo(e.target.value);
                          }
                        }}
                        value={panNo}
                      />
                    </div>
                  </div>
                  <div className="">
                    <div className="w-full ">
                      <div className="label">
                        <span className="label-text">Company Address</span>
                      </div>
                      <textarea
                        placeholder="Company Address"
                        name="address"
                        className="input input-bordered w-full p-3 address h-24"
                        rows="5"
                        required={true}
                        onChange={(e) => {
                          setCompanyAddress(e.target.value);
                        }}
                        value={companyAddress}
                      >
                        {/* {companyAddress} */}
                      </textarea>
                    </div>
                  </div>
                  <hr className="w-full" />
                  <div className="w-full">
                    <button
                      type="submit"
                      className="btn web-btn text-white sm:mt-0 md:mt-4 w-32"
                    >
                      Save
                    </button>
                    <button type="reset" className="btn btn-warning mx-5 px-8">
                      Reset
                    </button>
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

export default AddUsers;
