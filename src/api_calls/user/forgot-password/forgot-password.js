import axios from "axios";

export const ForgotPasswordAPI = async (userData, userType) => {
//   console.log("userData: ", userData);
//   console.log("userType: ", userType);
  let api;
  if (userType == "branch") {
    api = process.env.NEXT_PUBLIC_API_URL + "company-forgot-password";
  }
  if (userType == "admin") {
    api = process.env.NEXT_PUBLIC_API_URL + "admin-forgot-password";
  }
  if (userType == "users") {
    api = process.env.NEXT_PUBLIC_API_URL + "forgot-password";
  }

  const data = {
    userData: userData,
    optFor: userType
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
      console.log('error: ', error.response.data.message);
      return {
        status: false,
        message: error.response.data.message,
        data: [],
      };
    });
};
