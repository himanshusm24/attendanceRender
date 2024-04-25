import axios from "axios";

export const CreateHoliday = async (obj) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "holiday";

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
        message: "Holiday Added Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Holiday Details",
        data: [],
      };
    });
};
