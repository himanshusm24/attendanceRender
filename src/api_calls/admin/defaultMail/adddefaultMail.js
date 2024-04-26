import axios from "axios";

export const AddDefaultMail = async (obj) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "defaultMail";

  const data = obj;
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Default Mail Added Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Details",
        data: [],
      };
    });
};
