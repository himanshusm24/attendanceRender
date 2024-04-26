import axios from "axios";

export const ChangePasswordAPI = async (
  userId,
  userData,
  userPassword,
  userConfirmPassword,
  userType
) => {
  let api;
  if (userType == "branch") {
    api = process.env.NEXT_PUBLIC_API_URL + "company-change-password";
  }
  if (userType == "users") {
    api = process.env.NEXT_PUBLIC_API_URL + "change-password";
  }
  if (userType == "admin") {
    api = process.env.NEXT_PUBLIC_API_URL + "admin-change-password";
  }

  let data;
  data = {
    userId: userId,
    userData: userData,
    userPassword: userPassword,
    userConfirmPassword: userConfirmPassword,
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
      return { status: false, message: error.response.data.message, data: [] };
    });
};
