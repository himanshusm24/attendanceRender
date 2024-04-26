import axios from "axios";

export const ForgotPasswordAdminAPI = async (adminData) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "admin/forgot-password";

  const data = {
    adminData: adminData,
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
      return {
        status: false,
        message: "Please Enter a valid Email Or Contact Number",
        data: [],
      };
    });
};
