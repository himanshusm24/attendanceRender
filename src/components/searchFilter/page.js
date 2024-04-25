import React, { useState } from "react";

const SearchFilter = ({ onClose }) => {
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 8, 9]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white shadow-lg rounded-lg p-6">
        <button className="absolute top-0 right-0 mr-4 mt-2" onClick={onClose}>
          <svg
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <ul>
              {list.map((item, index) => (
                <li
                  key={index}
                  className="py-4 px-6 border-b border-gray-200"
                  onClick={() => console.log(index)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
