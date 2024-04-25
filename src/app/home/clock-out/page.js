"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Camera } from "react-camera-pro";
import "./clock-out.css";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { CheckOut } from "@/api_calls/user/attendance/check-out";
import { GetUserDetails } from "@/api_calls/user/get-user-details";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Control = styled.div`
  position: fixed;
  padding: 50px;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 120px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(Button)`
  background: url("/img/compact-camera.png");
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(Button)`
  background: url(/img/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 100%;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  ${
    "" /* @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  } */
  }
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : "")}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const FullScreenImagePreview = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : "")}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const ClockOut = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const camera = useRef(null);
  const [devices, setDevices] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const location = searchParams.get("location");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const [successMsg, setSuccessMsg] = useState(null);

  const currentDate = moment().format("YYYY-MM-DD H:mm:ss");

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind == "videoinput");
      setDevices(videoDevices);
    })();

    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const data = await GetUserDetails();
    const details = data.data.data[0];
    setUserDetails(details);
  };

  const retakeImage = async () => {
    setImage(null);
    setShowImage(false);
    setNumberOfCameras(0);
  };

  const submitAttendance = async () => {
    const obj = {
      company_id: userDetails.company_id,
      user_id: userDetails.id,
      attendance_date: moment().format("YYYY-MM-DD"),
      checkout_latitude: latitude,
      checkout_longitude: longitude,
      checkout_address: location,
      checkout_img: image,
      checkout_time: currentDate,
    };

    const reponse = await CheckOut(obj);

    if (reponse.status == true && reponse.data.data.affectedRows == 1) {
      router.push("/home");
    } else {
      setErrorMsg(reponse.data.message);
    }
  };

  useEffect(() => {
    if (image) {
      setSuccessMsg("Image Captured");
    }
  }, [image]);

  return (
    <Wrapper>
      {image ? (
        <>
          {successMsg != "" && successMsg != null ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3"
              role="success"
            >
              <span className="block sm:inline">{successMsg}</span>
            </div>
          ) : (
            ""
          )}
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
          <FullScreenImagePreview
            image={image}
            onClick={() => {
              setShowImage(!showImage);
            }}
          />
          <TakePhotoButton
            onClick={() => {
              if (camera.current) {
                const photo = camera.current.takePhoto();
                console.log(photo);
                setImage(photo);
              }
            }}
          />
        </>
      ) : (
        <Camera
          ref={camera}
          aspectRatio="cover"
          numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          videoReadyCallback={() => {
            console.log("Video feed ready.");
          }}
        />
      )}
      <Control>
        {!image ? (
          <>
            <TakePhotoButton
              onClick={() => {
                if (camera.current) {
                  const photo = camera.current.takePhoto();
                  setImage(photo);
                }
              }}
            />
            {/* <ChangeFacingCameraButton
                                onClick={() => {
                                    if (camera.current) {
                                        const result = camera.current.switchCamera();
                                    }
                                }}
                            /> */}
          </>
        ) : (
          <>
            <div className="clock-out-button">
              <button onClick={retakeImage}>
                <AutorenewIcon />
              </button>

              <button onClick={submitAttendance}>
                <CheckCircleOutlineIcon />
              </button>
            </div>
          </>
        )}
      </Control>
    </Wrapper>
  );
};

export default ClockOut;
