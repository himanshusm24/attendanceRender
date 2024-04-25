import axios from "axios";

export const UpdateHoliday = async (obj, holiday_id) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "holiday/" + holiday_id;

  const data = obj;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "PUT",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Holiday updated Successfully",
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
