"use client";
import React from "react";
import Link from "next/link";

const BreadCrum = ({
  breadcumr1,
  breadcumr1_link,
  breadcumr2,
  breadcumr2_link = "",
  breadcumr3 = "",
  breadcumr3_link = "",
  button_name,
  button_link,
}) => {
  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:flex bg-white p-4 mt-4 items-center">
        <div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/admin/dashboard"
                  className="ml-1 inline-flex text-sm font-medium text-gray-800 hover:underline md:ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="mr-4 h-4 w-4"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Admin
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <Link
                    href={breadcumr1_link}
                    className="ml-1 text-sm font-medium text-gray-800 hover:underline md:ml-2"
                  >
                    {breadcumr1}
                  </Link>
                </div>
              </li>
              {breadcumr2 && breadcumr2 != "" ? (
                <li>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <label className="ml-1 text-sm font-medium text-gray-800 md:ml-2">
                      {breadcumr2}
                    </label>
                  </div>
                </li>
              ) : (
                ""
              )}

              {breadcumr3 && breadcumr3 != "" ? (
                <li>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-4 w-4"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <label className="ml-1 text-sm font-medium text-gray-800 md:ml-2">
                      {breadcumr3}
                    </label>
                  </div>
                </li>
              ) : (
                ""
              )}
            </ol>
          </nav>
        </div>
        {button_link && button_link != "" ? (
          <div>
            <Link
              href={button_link}
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {button_name}
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default BreadCrum;
