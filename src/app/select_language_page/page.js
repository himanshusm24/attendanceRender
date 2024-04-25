"use client"
import React, { useState } from 'react';

const SelectUserLanguage = () => {
  const [selectedGrid, setSelectedGrid] = useState(null);

  const handleGridClick = (gridNumber) => {
    setSelectedGrid(selectedGrid === gridNumber ? null : gridNumber);
  };

  const getGridStyle = (gridNumber) => {
    const colors = ["bg-blue-300", "bg-green-300", "bg-red-300", "bg-yellow-300"];

    // Special case for English grid
    if (gridNumber === 1 && selectedGrid === 1) {
      return "bg-blue-400 p-6 rounded-md cursor-pointer";
    }

    return `bg-gray-300 p-6 rounded-md cursor-pointer ${selectedGrid === gridNumber ? colors[gridNumber - 1] : ''}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <nav className="bg-black/70 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-lg font-semibold">Select a Language</h1>
        </div>
      </nav>

      <div className="mt-2 ml-2 mr-2 grid grid-cols-2 gap-4">
        {/* First grid item */}
        <div
          className={getGridStyle(1)}
          onClick={() => handleGridClick(1)}
        >
          {/* Content for the first grid item */}
          <div className="ml-4">
            <p className="text-white text-xl font-semibold text-right">English</p>
            <p className="text-gray-500 text-2xl text-right">English</p>
          </div>
        </div>

        {/* Second grid item */}
        <div
          className={getGridStyle(2)}
          onClick={() => handleGridClick(2)}
        >
          {/* Content for the second grid item */}
          <div className="ml-4">
            <p className="text-white text-xl font-semibold text-right">Spanish</p>
            <p className="text-gray-500 text-2xl text-right">Spanish</p>
          </div>
        </div>

        {/* Third grid item */}
        <div
          className={getGridStyle(3)}
          onClick={() => handleGridClick(3)}
        >
          {/* Content for the third grid item */}
          <div className="ml-4">
            <p className="text-white text-xl font-semibold text-right">Hindi</p>
            <p className="text-gray-500 text-2xl text-right">Hindi</p>
          </div>
        </div>

        {/* Fourth grid item */}
        <div
          className={getGridStyle(4)}
          onClick={() => handleGridClick(4)}
        >
          {/* Content for the fourth grid item */}
          <div className="ml-4">
            <p className="text-white text-xl font-semibold text-right">Arabic</p>
            <p className="text-gray-500 text-2xl text-right">Arabic</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-1 bg-white rounded-sm">
        <button
          className="w-full h-12 bg-black/70 text-white py-2 rounded-md font-semibold hover:bg-gray-200"
        //   onClick={() => {}}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectUserLanguage;