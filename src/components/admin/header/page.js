"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/admin/sidebar/page";
import "./header.css";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

const menuItems = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "About",
    href: "#",
  },
  {
    name: "Contact",
    href: "#",
  },
];

const Header = ({ clickEvent, sidebarVisible }) => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    let admin_id = localStorage.getItem("admin_id");
    let companyAdmin_id = localStorage.getItem("companyAdmin_id");
    let user_type = localStorage.getItem("user_type");

    if (user_type !== "admin") {
      router.push("/admin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_contact");
    localStorage.removeItem("company_name");
    router.push("/admin");
  };

  const handleCompanyName = () => {
    let data = localStorage.getItem("company_name");
    setCompanyName(data);
  };

  useEffect(() => {
    handleCompanyName();
  }, []);

  return (
    <>
      <div className="header bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between pr-4 py-2">
          <div className="hidden grow items-start lg:flex">
            <ul className="ml-12 inline-flex space-x-8">
              {/* {menuItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                </li>
              ))} */}
              {/* <li className="font-bold"> SECOND MEDIC REMOTE HEALTHCARE </li> */}
              <li className="font-bold"> {companyName} </li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <button
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          <div className="lg:hidden">
            <h5 className="font-bold px-3 py-2">Admin Dashboard</h5>
          </div>
          <div className="lg:hidden">
            {sidebarVisible == true ? (
              <CloseIcon
                className="h-6 w-6 cursor-pointer"
                onClick={clickEvent}
              />
            ) : (
              <Menu className="h-6 w-6 cursor-pointer" onClick={clickEvent} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
