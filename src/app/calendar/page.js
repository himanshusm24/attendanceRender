"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/header/page";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { MonthlyLog } from "@/api_calls/user/attendance/monthly-log";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import { HolidayList } from "@/api_calls/admin/holiday/get-holiday";
import moment from "moment";

const AttendanceCalendar = () => {
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [missed, setMissed] = useState(0);
  const [weeklyOff, setWeeklyOff] = useState(0);
  const [holidays, setHolidays] = useState(0);
  const [holidayMonthDetails, setHolidayMonthDetails] = useState([]);
  const [countAbsentDate, setcountAbsentDate] = useState(0);

  const calculateSundays = () => {
    const today = moment();
    const checkMonth = today.format("MM");
    const checkYear = today.format("YYYY");
    let sundays = 0;
    for (let day = 1; day <= today.date(); day++) {
      if (moment({ year: checkYear, month: checkMonth - 1, day }).day() === 0) {
        sundays++;
      }
    }
    setWeeklyOff(sundays);
    return sundays;
  };

  const checkMonthlyLog = async (selectedDate) => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    const obj = {
      company_id: details.company_id,
      user_id: details.id,
      attendance_date: moment(selectedDate).format("YYYY-MM-DD"),
    };

    const response = await MonthlyLog(obj);
    // console.log("response: ", response);
    if (response.status == true) {
      setAttendanceDetails(response.data.data);

      // comment
      // for now changing as if someone present it should show them as present
      // setPresent(response.data.present_count);
      // setMissed(response.data.half_count);

      setPresent(response.data.half_count);

      let absentCount = Number(moment().format("DD"));
      // console.log("absentCount: ", absentCount);

      const sundayData = Number(calculateSundays());
      // console.log(sundayData);
      // console.log(holidays);
      const presentCount = Number(response.data.present_count) || 0;
      const halfCount = Number(response.data.half_count) || 0;

      // let totalabsent =
      //   absentCount -
      //   response.data.present_count -
      //   response.data.half_count -
      //   sundayData;
      let totalabsent = absentCount - presentCount - halfCount - sundayData;
      totalabsent = Math.max(totalabsent, 0);

      setAbsent(totalabsent);

      let details = response.data.data;

      let final_list = details.map((attendance, index) => {
        const date = moment(attendance["attendance_date"]).format(
          "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
        );
        let att_title = "";

        if (attendance.checkin == 1 && attendance.checkout == 0) {
          att_title = "Half-day";
        } else if (attendance.checkin == 1 && attendance.checkout == 1) {
          att_title = "Full-day";
        } else {
          att_title = "Absent";
        }
        return { date: date, title: att_title };
      });
      setEvents([...final_list]);
    }
  };

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  useEffect(() => {
    const fetchHolidayMonthDetails = async (newDate) => {
      const monthNames = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      const currentMonth = newDate.getMonth();
      const selectedMonth = monthNames[currentMonth];
      const userCompany = localStorage.getItem("companyId");
      // console.log("userCompany: ", userCompany);
      const holidayMonthData = await HolidayList(
        0,
        selectedMonth,
        userCompany,
        ""
      );
      // console.log("holidayMonthData: ", holidayMonthData.data.data.length);
      setHolidays(holidayMonthData?.data?.data?.length);
      setHolidayMonthDetails(holidayMonthData?.data?.data);
    };

    // const calculateSundays = () => {
    //   const today = moment();
    //   const checkMonth = today.format("MM");
    //   const checkYear = today.format("YYYY");
    //   let sundays = 0;
    //   for (let day = 1; day <= today.date(); day++) {
    //     if (
    //       moment({ year: checkYear, month: checkMonth - 1, day }).day() === 0
    //     ) {
    //       sundays++;
    //     }
    //   }
    //   setWeeklyOff(sundays);
    // };

    // calculateSundays();
    fetchHolidayMonthDetails(date);
    checkMonthlyLog(date);
  }, [date]);

  useEffect(() => {
    const calendarNavigation = document.querySelector(
      ".react-calendar__navigation"
    );
    const nextButton = calendarNavigation.querySelector(
      ".react-calendar__navigation__next-button"
    );
    const prevButton = calendarNavigation.querySelector(
      ".react-calendar__navigation__prev-button"
    );

    const handleNavigationClick = (direction) => {
      setTimeout(() => {
        const newDate = new Date(date);
        if (direction === "next") {
          newDate.setMonth(newDate.getMonth() + 1);
        } else {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        setDate(newDate);
      }, 100);
    };

    if (calendarNavigation) {
      nextButton.addEventListener("click", () => handleNavigationClick("next"));
      prevButton.addEventListener("click", () => handleNavigationClick("prev"));
    }

    return () => {
      if (calendarNavigation) {
        nextButton.removeEventListener("click", () =>
          handleNavigationClick("next")
        );
        prevButton.removeEventListener("click", () =>
          handleNavigationClick("prev")
        );
      }
    };
  }, [date]);

  const onChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const tileClassName = ({ date }) => {
    const currentDate = moment(date).startOf("day");
    const currentMonth = currentDate.month();

    if (currentDate.month() !== currentMonth) {
      return "";
    }

    // if (currentDate.isAfter(moment().startOf("day"))) {
    //   return "";
    // }
    const eventForDay = events.find((event) =>
    moment(event.date).startOf("day").isSame(moment(date).startOf("day"))
    );
    // console.log('eventForDay: ', eventForDay);

    const isHoliday = holidayMonthDetails.some((holiday) =>
      moment(holiday.holiday_date).isSame(date, "day")
    );

    const absentDates = [];
    for (let i = 1; i <= moment().date(); i++) {
      const day = moment(date).date(i).startOf("day");
      const isAbsent =
        attendanceDetails.filter((log) =>
          moment(log.attendance_date).isSame(day, "day")
        ).length === 0;
      if (isAbsent && !isHoliday) {
        absentDates.push(day.format("YYYY-MM-DD"));
      }
    }
    // console.log("absentDates: ", absentDates);

    const classes = [];
    if (eventForDay) {
      if (eventForDay.title === "Full-day") {
        classes.push("full-day-attendance");
      } else if (eventForDay.title === "Half-day") {
        classes.push("full-day-attendance");
        // classes.push("half-day-attendance");

      } else {
        classes.push("absent-attendance");
      }
    }
    if (isHoliday) {
      classes.push("holiday");
    }
    if (date.getDay() === 0) {
      classes.push("sunday");
    }
    if (
      !isHoliday &&
      absentDates.length > 0 &&
      currentDate.isSameOrBefore(moment().startOf("day"))
    ) {
      classes.push("absent");
    }
    return classes.join(" ");
  };
  // console.log("countAbsentDate: ", countAbsentDate);

  const isDateDisabled = (date) => {
    const today = new Date();
    return date > today;
  };

  const tileDisabled = ({ activeStartDate, date, view }) => {
    return moment(date).month() !== moment(activeStartDate).month();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col relative">
      <Header page_name={"view-log"} />

      <div className="bg-white mt-6 flex flex-row relative">
        <div
          style={{ backgroundColor: "#19838a" }}
          className="mx-2 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-green-500"
        >
          <p className="text-xs text-white mt-2 mx-2">Present</p>
          <h2 className="font-semibold text-white text-xl mt-1 mx-2">
            {present || 0}
          </h2>
        </div>

        <div className="mx-2 bg-red-400 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-red-600">
          <p className="text-xs text-white mt-2 mx-2">Absent</p>
          <h2 className="font-semibold text-white text-xl mt-1 mx-2">
            {absent || 0}
          </h2>
        </div>

        {/* <div className="mx-2 bg-yellow-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-yellow-500">
          <p className="text-xs text-gray-700 mt-2 mx-1">Half Days</p>
          <h2 className="font-semibold text-xl mt-1 mx-2">{Missed}</h2>
        </div> */}

        <div
          style={{ backgroundColor: "rgb(255, 174, 0)" }}
          className="mx-2  flex flex-col relative flex-1 w-16 h-16 border-l-2 border-yellow-500"
        >
          <p className="text-xs text-white mt-2 mx-1">Missed</p>
          <h2 className="font-semibold text-white text-xl mt-1 mx-1 truncate">
            {missed || 0}
          </h2>
        </div>

        {/* <div className="mx-2 bg-violet-100 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-violet-500">
          <p className="text-xs text-gray-700 mt-2 mx-1">PL</p>
          <h2 className="font-semibold text-xl mt-1 mx-2">0</h2>
        </div> */}
        <div className="mx-2 bg-gray-300 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-gray-500">
          <p className="text-xs text-white mt-2 mx-1">Weekly</p>
          <h2 className="font-semibold text-white text-xl mt-1 mx-1 truncate">
            {weeklyOff || 0}
          </h2>
        </div>
        <div className="mx-2 bg-blue-400 flex flex-col relative flex-1 w-16 h-16 border-l-2 border-blue-500">
          <p className="text-xs text-white mt-2 mx-1">Holiday</p>
          <h2 className="font-semibold text-white text-xl mt-1 mx-1 truncate">
            {holidays || 0}
          </h2>
        </div>
      </div>

      <hr className="w-full my-4 text-gray-400" />

      <div className=" flex flex-col">
        <Calendar
          // key={date.getMonth()}
          onChange={onChange}
          value={date}
          tileClassName={tileClassName}
          // tileDisabled={({ date }) => isDateDisabled(date)}
          tileDisabled={tileDisabled}
        />
      </div>

      <div className="rounded-md bg-white shadow-md mt-4 mx-4">
        <div className="h-1/4 flex items-center justify-between px-3 py-1 mt-2">
          <div className="flex items-center">
            <p className="ml-2 font-bold">Holidays</p>
          </div>
        </div>
        <hr className="border-gray-300 m-0 mt-2" />
        <div className="text-left px-3 py-3">
          <div className="mb-4">
            {holidayMonthDetails?.map((res, index) => (
              <p key={index} className="block font-bold mb-1 ">
                <span className="mr-2">{index + 1}.</span>
                {res.holiday_title} -{" "}
                {moment(res.holiday_date).format("DD MMM, YYYY")}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
