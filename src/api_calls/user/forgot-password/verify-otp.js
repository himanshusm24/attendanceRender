import axios from "axios";

export const OTPVerificationAPI = async (userData, userOtp, otpFor) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "verify-otp";

  const data = {
    userData: userData,
    userOtp: userOtp,
    otpFor: otpFor,
  };

  const config = {
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return { status: true, message: response.message, data: response.data };
    })
    .catch((error) => {
      return { status: false, message: "Please Enter Valid OTP", data: [] };
    });
};
