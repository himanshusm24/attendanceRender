/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import AccessibilityOutlinedIcon from "@mui/icons-material/AccessibilityOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import Header from "@/components/header/page";
import { useRouter } from 'next/navigation';
import { GetUserDetails } from '@/api_calls/user/get-user-details';
import LogoutIcon from '@mui/icons-material/Logout';
import { UpdateUserImage } from "@/api_calls/user/user-details/update-user-img";
import "./my-profile.css";
import imageCompression from 'browser-image-compression';

const MyProfile = () => {
  const router = useRouter();
  const [checkin, setCheckin] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    setUserDetails(details);
  }

  const page_router = (page_name) => {
    if (page_name == 'personal-details') {
      router.push('/my-profile/personal-details');
    } else {

    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_contact');
    localStorage.removeItem("user_company_name");
    localStorage.removeItem("companyId");
    localStorage.removeItem("user_department_Id");
    localStorage.removeItem("user_role_Id");
    localStorage.removeItem("mobtaskSidebar");
    router.push('/');
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 700,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Data = reader.result;
          console.log(base64Data);
          setUserImage(base64Data);
          updateImage(base64Data);
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setErrorMsg("Error compressing image");
      }
    };
  }

  const updateImage = async (base64Data) => {

    const obj = {
      profile_img: base64Data,
    }

    const reponse = await UpdateUserImage(obj);

    if (reponse.status == true && reponse.data.data.affectedRows == 1) {
      setErrorMsg("");
      setSuccessMsg("User Updated Successfully");
    } else {
      setErrorMsg(reponse.data.message);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <Header page_name="profile" />

      {
        (successMsg != "" && successMsg != null) ?
          <div className='mt-2'>
            <div className="bg-green-100 border border-green-400 px-4 py-3 rounded relative mb-3" role="alert">
              <span className="block sm:inline">{successMsg}</span>
            </div>
          </div>
          : ""
      }
      {
        (errorMsg != "" && errorMsg != null) ?
          <div className='mt-2'>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3" role="alert">
              <span className="block sm:inline">{errorMsg}</span>
            </div>
          </div>
          : ""
      }
      <div className="flex flex-col items-center mt-4 relative">
        <div className="bg-gray-300 rounded-full p-1 w-28 h-28 relative">
          <label className="user-profile-image">
            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
            <span className="text-white text-7xl font-bold flex items-center justify-center relative z-10 h-full">
              {
                (userImage && userImage != null)
                  ? <img src={userImage} alt="User image" />
                  : <img src={userDetails && (userDetails?.profile_image != null) ? `${userDetails?.profile_image}` : "/img/user.png"} alt="User image" />
              }

            </span>
            <div className="absolute -bottom-4 -right-4 mr-4 mb-4" style={{ zIndex: 10 }} >
              <div className="bg-white rounded-full border p-1.5">
                <CameraAltOutlinedIcon
                  style={{ color: "#07cba4", fontSize: "1.5rem" }}
                />
              </div>
            </div>
          </label>
        </div>
        <h2 className="text-2xl font-semibold mt-3">{(userDetails && userDetails?.name) ? userDetails?.name : "Username"}</h2>
        <h4 className="text-md mt-2">{(userDetails && userDetails?.contact) ? "+91 " + userDetails?.contact : "Contact Number"}</h4>
      </div>

      <div className="bg-white rounded-md mx-4 mt-4 flex flex-col">
        <div className="flex items-center py-4" onClick={() => page_router('personal-details')} >
          <AccessibilityOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Personal Details</div>
          <KeyboardArrowRightOutlinedIcon className="text-gray-500 mr-2 ml-auto" />
        </div>
        <hr className="border-t border-gray-300 w-full" />
        {/* <div className="flex items-center py-4">
          <BadgeOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Identity Proofs</div>
          <KeyboardArrowRightOutlinedIcon className="text-gray-500 mr-2 ml-auto" />
        </div>
        <hr className="border-t border-gray-300 w-full" />
        <div className="flex items-center py-4">
          <WorkOutlineOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Current Employment</div>
          <KeyboardArrowRightOutlinedIcon className="text-gray-500 mr-2 ml-auto" />
        </div>
        <hr className="border-t border-gray-300 w-full" />

        <div className="bg-white rounded-md py-4 flex items-center">
          <AccountBalanceOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Bank Details</div>
          <KeyboardArrowRightOutlinedIcon className="ml-auto mr-2 text-gray-500" />
        </div>
        <hr className="border-t border-gray-300 w-full" />

        <div className="bg-white rounded-md py-4 flex items-center">
          <PermIdentityOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">User Permission</div>
          <div className="ml-auto mr-2 text-sm text-gray-500">Employee</div>
          <KeyboardArrowRightOutlinedIcon className="text-gray-500 mr-2" />
        </div>
        <hr className="border-t border-gray-300 w-full" />

        <div className="bg-white rounded-md py-4 flex items-center">
          <FingerprintOutlinedIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Attendance Details</div>
          <KeyboardArrowRightOutlinedIcon className="ml-auto mr-2 text-gray-500" />
        </div> */}

        <div className="bg-white rounded-md py-4 flex items-center" onClick={logout} >
          <LogoutIcon className="ml-4" />
          <div className="ml-4 text-gray-500 text-md">Logout</div>
          <KeyboardArrowRightOutlinedIcon className="ml-auto mr-2 text-gray-500" />
        </div>
      </div>

    </div>
  );
};

export default MyProfile;