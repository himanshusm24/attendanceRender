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
import { UserListss } from "@/api_calls/user/user-details/user-list";
import { UpdateUser } from "@/api_calls/admin/user/update-user";
import { getRole } from "@/api_calls/admin/roles/get-roles";
import { getDepartment } from "@/api_calls/admin/department/get-department";

const AddUsers = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [aadhar_no, setAadharNo] = useState("");
  const [pan_no, setPanNo] = useState("");
  const [paid_leave, setPaidleave] = useState("");
  const [password, setPassword] = useState("");
  const [user_id, setUserId] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnName, setBtnName] = useState("Add Employee");
  const [editMessage, setEditMessage] = useState("");
  const [roleDetail, setRoleDetail] = useState([]);
  const [departmentDetail, setDepartmentDetail] = useState([]);

  const [disabledInput, setDisabledInput] = useState(false);

  useEffect(() => {
    getCompanyList();
    getEmployeeDetails();
    getRoleData();
    getDepartmentData();
  }, []);

  const getCompanyList = async () => {
    const data = await CompanyLists();
    const list = data.data.data;
    setCompanyList([...companyList, ...list]);
  };

  const getRoleData = async () => {
    const data = await getRole();
    setRoleDetail(data.data.data);
  };
  const getDepartmentData = async () => {
    const data = await getDepartment();
    setDepartmentDetail(data.data.data);
  };

  const getEmployeeDetails = async () => {
    const user_id = atob(params.get("user_id"));
    if (user_id > 0) {
      setDisabledInput(true);
    }

    if (user_id > 0) {
      setUserId(user_id);
      const data = await UserListss(user_id);
      console.log("data: ", data);
      const userData = data.data.data[0];

      const dateOfBirth = moment(userData.dob).format("YYYY-MM-DD");

      setCompanyId(userData.company_id);
      setName(userData.name);
      setDesignation(userData.designation);
      setRole(userData.role_id);
      setDepartment(userData.department_id);
      setEmail(userData.email);
      setDob(dateOfBirth);
      setContact(userData.contact);
      setGender(userData.gender);
      setAadharNo(userData.aadhar_no);
      setPanNo(userData.pan_no);
      setPaidleave(userData.paid_leave);
      setBtnName("Update Employee");
      setEditMessage(
        "(Please Enter Password, If you want to change your password)"
      );
    }
  };

  const addUser = async (event) => {
    event.preventDefault();

    const obj = {
      company_id: companyId,
      name: name,
      designation: designation,
      role_id: role,
      department_id: department,
      email: email,
      contact: contact,
      dob: dob,
      gender: gender,
      aadhar_no: aadhar_no,
      pan_no: pan_no,
      paid_leave: paid_leave,
      password: password,
    };

    const user_id = atob(params.get("user_id"));

    const reponse =
      user_id > 0 ? await UpdateUser(obj, user_id) : await CreateUser(obj);

    if (reponse.status == true && reponse.data.data.affectedRows == 1) {
      router.push("/branch/manage-users");
    } else {
      setErrorMsg(reponse.message);
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
            breadcumr1={"Manage Employee"}
            breadcumr1_link={"/branch/manage-users"}
            breadcumr2={btnName}
            button_name={"Employee List"}
            button_link={"/branch/manage-users"}
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
                <form onSubmit={addUser} method="post" autoComplete="off">
                  <div className="gap-4 grid md:grid-cols-2 md:space-y-0">
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Branch List</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="company"
                        onChange={(e) => {
                          setCompanyId(e.target.value);
                        }}
                        value={companyId}
                      >
                        <option value="" disabled selected>
                          Select Branch
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
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Employee Name</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Name"
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
                        <span className="label-text">Employee Designation</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Designation"
                        name="designation"
                        className="input input-bordered w-full"
                        required={true}
                        onChange={(e) => {
                          setDesignation(e.target.value);
                        }}
                        value={designation}
                      />
                    </div>

                    {disabledInput == true ? (
                      <div className="w-full">
                        <div className="label">
                          <span className="label-text">Email Address</span>
                        </div>
                        <input
                          type="email"
                          placeholder="Employee Email"
                          className="input input-bordered w-full"
                          name="email"
                          required={true}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          value={email}
                          disabled
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="label">
                          <span className="label-text">Email Address</span>
                        </div>
                        <input
                          type="email"
                          placeholder="Employee Email"
                          className="input input-bordered w-full"
                          name="email"
                          required={true}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          value={email}
                        />
                      </div>
                    )}

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Department</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="department"
                        value={department}
                        required={true}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Department
                        </option>
                        {departmentDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Role</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="role"
                        value={role}
                        required={true}
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Role
                        </option>
                        {roleDetail?.map((res, index) => (
                          <option key={index} value={res.id}>
                            {res.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Contact Number</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Employee Contact"
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
                        <span className="label-text">Gender</span>
                      </div>
                      <select
                        className="input input-bordered select select-bordered w-full"
                        name="gender"
                        value={gender}
                        required={true}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                      >
                        <option value="" selected disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Date of Birth</span>
                      </div>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        name="dob"
                        min={moment()
                          .subtract(80, "years")
                          .format("YYYY-MM-DD")}
                        max={moment()
                          .subtract(10, "years")
                          .format("YYYY-MM-DD")}
                        // required={true}
                        onChange={(e) => {
                          setDob(e.target.value);
                        }}
                        value={dob}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Aadhar Number</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Aadhar Number"
                        className="input input-bordered w-full"
                        name="aadhar_no"
                        // required={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 16) {
                            setAadharNo(e.target.value);
                          }
                        }}
                        value={aadhar_no}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Pan Number</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Employee Pan Number"
                        className="input input-bordered w-full"
                        name="pan_no"
                        // require={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setPanNo(e.target.value);
                          }
                        }}
                        value={pan_no}
                      />
                    </div>
                    <div className="w-full">
                      <div className="label">
                        <span className="label-text">Paid Leave</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Employee Paid Leave"
                        className="input input-bordered w-full"
                        name="paid_leave"
                        require={true}
                        onChange={(e) => {
                          if (e.target.value.length <= 4) {
                            setPaidleave(e.target.value);
                          }
                        }}
                        value={paid_leave}
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
                        placeholder="Employee Password"
                        className="input input-bordered w-full"
                        name="password"
                        require={true}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <hr />
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

export default AddUsers;
