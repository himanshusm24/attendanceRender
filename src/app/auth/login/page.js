/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
import { LoginAPI } from "@/api_calls/user/login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const user_login = async (event) => {
    event.preventDefault();

    const response = await LoginAPI(email, password);
    console.log("response: ", response);

    let data = response.data;

    if (data.status == true) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_type", "user");
      localStorage.setItem("user_id", data.data.id);
      localStorage.setItem("user_name", data.data.name);
      localStorage.setItem("user_email", data.data.email);
      localStorage.setItem("user_contact", data.data.contact);
      localStorage.setItem("companyId", data.data.company_id);
      localStorage.setItem("user_role_Id", data.data.role_id);
      localStorage.setItem("user_department_Id", data.data.department_id);
      localStorage.setItem("user_company_name", data.data.head_company_name);
      router.push("/home");
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
    checkUserLoginStatus();
  }, []);

  const checkUserLoginStatus = () => {
    let user_id = localStorage.getItem("user_id");
    let user_type = localStorage.getItem("user_type");

    if (user_type == "user" && user_id > 0) {
      router.push("/home");
    }
  };

  const forgot_password = async (event) => {
    event.preventDefault();
    router.push("/auth/forgot-password?userType=users");
  };

  return (
    <section className="min-h-screen rounded-md bg-[#188389] p-2 login-page">
      <div className="block items-center justify-center h-full bg-white px-8 py-10 sm:px-12 sm:py-16 lg:px-8">
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
          <div className="my-5 flex items-center justify-center">
            <img src="/img/7oclockIcon.png" width={120} alt="Image" />
          </div>

          <h2 className="text-2xl font-bold text-center leading-tight text-[#188389]">
            User Sign In
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                    onClick={forgot_password}
                    title=""
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="w-full">
                <button
                  onClick={user_login}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#188389] px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Sign in <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
          <div className="mt-5 mb-8 space-y-3">
            {/* <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            >
              <span className="mr-2 inline-block">
                <svg
                  className="h-6 w-6 text-rose-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
              </span>
              Sign in with Google
            </button>
            <div className="mt-2 h-14">
              <p className="mt-20 text-sm text-gray-600 ">
                Company not registered?{" "}
                <a
                  href="/signup"
                  title=""
                  className="font-semibold text-black transition-all duration-200 hover:underline text-[#188389]"
                >
                  Sign up
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
