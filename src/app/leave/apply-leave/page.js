"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/header/page";
import { UserApplyLeave } from "@/api_calls/user/user-leave/applyLeave";
import { useRouter } from "next/navigation";
import { HeadEmails } from "@/api_calls/user/user-leave/headEmail";
import EmailIcon from "@mui/icons-material/Email";

const ApplyLeave = () => {
  const router = useRouter();
  const [emails, setEmails] = useState([""]);
  const [subject, setSubject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [HeadEmail, setHeadEmail] = useState("");

  const [addEmailButton, setAddEmailButton] = useState(true);

  const addEmailInput = () => {
    if (emails.length < 2) {
      setEmails([...emails, ""]);
      setAddEmailButton(false);
    }
  };

  const removeEmailInput = (indexToRemove) => {
    const updatedEmails = emails.filter(
      (email, index) => index !== indexToRemove
    );
    setEmails(updatedEmails);
    if (updatedEmails.length === 0) {
      setAddEmailButton(true);
    }
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleSubmit = async () => {
    let userData = localStorage.getItem("user_email");
    let toEmailString;
    if (Array.isArray(emails)) {
      toEmailString = emails.join(",");
    }
    if (toEmailString) {
      toEmailString += `,${HeadEmail}`;
    } else {
      toEmailString = HeadEmail;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = (email) => emailPattern.test(email);
    const toEmails = toEmailString.split(",").map((email) => email.trim());
    const allEmailsValid = toEmails.every((email) => isValidEmail(email));
    if (!allEmailsValid) {
      return setErrorMsg("Please enter valid email addresses.");
    }
    let obj = {
      from_date: fromDate,
      to_date: toDate,
      to_email: toEmailString,
      subject: subject,
      body: `From : ${userData} <br/> <br/>`,
    };
    obj.body += body;
    if (obj.subject == "") {
      return setErrorMsg("Please enter Subject.");
    }
    if (obj.to_date == "") {
      return setErrorMsg("Please enter correct date.");
    }
    if (obj.from_date == "") {
      return setErrorMsg("Please enter correct date.");
    }
    if (obj.body == "") {
      return setErrorMsg("Please enter Body.");
    }
    if (obj.body.length > 150) {
      return setErrorMsg("You cannot enter more that 150 words.");
    }

    const data = await UserApplyLeave({ obj });
    if (data.data.data.affectedRows == 1) {
      setSuccessMsg("Leave Applied Successfully");
      setBody("");
      setEmails("");
      setFromDate("");
      setToDate("");
      setSubject("");
      setTimeout(() => {
        router.push("/leave");
      }, 2000);
    }
  };

  const allHead = async () => {
    let companyId = localStorage.getItem("companyId");
    let user_department_Id = localStorage.getItem("user_department_Id");
    const data = await HeadEmails(companyId, user_department_Id);
    // console.log("data: ", data.data.data[0].email);
    setHeadEmail(data?.data?.data[0]?.email);
  };

  useEffect(() => {
    setEmails(emails.slice(0, 1));
    allHead();
  }, []);

  useEffect(() => {
    const clearErrorMessage = () => {
      setErrorMsg("");
    };

    if (errorMsg !== "") {
      const timerId = setTimeout(clearErrorMessage, 2000);
      return () => clearTimeout(timerId);
    }
  }, [errorMsg]);

  useEffect(() => {
    const clearSuccessMessage = () => {
      setSuccessMsg("");
    };

    if (successMsg !== "") {
      const timerId = setTimeout(clearSuccessMessage, 2000);
      return () => clearTimeout(timerId);
    }
  }, [successMsg]);

  return (
    <div>
      <Header page_name={"view-log"} />
      <div className=" text-center p-2 font-bold bg-white w-full">
        <h2 className="">LEAVE APPLICATION FORM</h2>
      </div>

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

      {successMsg != "" ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
          role="alert"
        >
          <span className="block sm:inline">{successMsg}</span>
        </div>
      ) : (
        ""
      )}

      <div className="p-2">
        <div>
          <div className="input input-bordered flex gap-0 font-bold h-[55px]">
            <p className="font-bold"> To: </p>

            <div style={{ wordBreak: "break-word" }} className="ml-4 font-bold">
              <b className="font-normal">Hr@secondemedic.com, </b>
              {/* <br /> */}
              <b className="font-normal">{HeadEmail}</b>
            </div>
          </div>
        </div>
        {addEmailButton && emails.length < 2 ? (
          <div className="items-center text-center my-1">
            <button
              className="web-btn btn btn-sm text-white"
              onClick={() => {
                setAddEmailButton(false);
                addEmailInput();
              }}
            >
              Add Optional Email
            </button>
          </div>
        ) : null}

        {!addEmailButton && (
          <div>
            {Array.isArray(emails) &&
              emails.map((email, index) => (
                <div
                  key={index}
                  className="input input-bordered flex items-center gap-2 font-bold"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="grow font-normal"
                    placeholder="Optional Email"
                  />

                  {emails.length == 1 && (
                    <button
                      onClick={addEmailInput}
                      className="web-btn btn btn-sm text-white font-bold"
                    >
                      +
                    </button>
                  )}

                  <button
                    onClick={() => removeEmailInput(index)}
                    className="web-btn btn btn-sm text-white font-bold"
                  >
                    -
                  </button>
                </div>
              ))}
          </div>
        )}

        <label className="input input-bordered flex items-center gap-2 font-bold my-1">
          Subject:
          <input
            type="text"
            placeholder="Leave Application"
            className=" w-full font-normal"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 my-1">
          <label className=" input input-bordered flex items-center font-bold mr-1">
            From:
            <input
              type="date"
              placeholder=""
              className=" bg-white p-2 ml-2 w-full "
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </label>
          <label className=" input input-bordered flex items-center font-bold ml-1">
            To:
            <input
              type="date"
              placeholder=""
              className=" bg-white p-2 ml-2 w-full "
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate}
            />
          </label>
        </div>

        <textarea
          className="textarea textarea-bordered pt-4 w-full h-72"
          placeholder="Enter max 150 words in Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="h-3/4 text-center">
        <div
          // type="button"
          className="web-btn rounded-md px-5 py-3 text-sm text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 w-1/2 ml-24"
          onClick={() => handleSubmit()}
        >
          Apply
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
