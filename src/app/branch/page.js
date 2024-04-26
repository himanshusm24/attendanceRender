/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";
import { CompanyLoginAPI } from "@/api_calls/branch/companyLogin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const CompanyAdmin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const admin_login = async (event) => {
    event.preventDefault();

    const response = await CompanyLoginAPI(email, password);

    let data = response.data;

    if (data.status == true) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_type", "companyAdmin");
      localStorage.setItem("companyAdmin_id", data.data.id);
      localStorage.setItem("companyAdmin_name", data.data.name);
      localStorage.setItem("companyAdmin_email", data.data.email);
      localStorage.setItem("companyAdmin_contact", data.data.contact);
      localStorage.setItem("company_name", data.data.company_name);

      router.push("/branch/dashboard");
    } else if (data.status == false) {
      setErrorMsg(data.message);
    } else {
      setErrorMsg(response.message);
    }
  };

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    let token = localStorage.getItem("token");
    let companyAdmin_id = localStorage.getItem("companyAdmin_id");
    let user_type = localStorage.getItem("user_type");

    if (user_type == "companyAdmin" && companyAdmin_id > 0 && token != "") {
      router.push("/branch/dashboard");
    }
  };

  const forgotRoute = async (event) => {
    event.preventDefault();
    router.push("/auth/forgot-password?userType=branch");
  };

  return (
    <section className="min-h-screen bg-[#188389] p-2 login-page">
      <div className="block items-center justify-center h-full py-12 sm:px-12 sm:py-16 lg:px-8">
        <div className="bg-white px-7 py-10 rounded-lg xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
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
            <img
              src="/img/7oclockIcon.png"
              style={{ width: "140px" }}
              alt="Image"
            />
          </div>

          <h2 className="text-2xl font-bold text-center leading-tight text-[#188389]">
            Branch Login
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  <button
                    className="password-toggle-btn absolute inset-y-0 right-0 mt-2 mr-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
              <div className="flex items-end mt-1">
                <div className="ml-auto">
                  <a
                    onClick={forgotRoute}
                    title=""
                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={admin_login}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Sign in <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CompanyAdmin;
