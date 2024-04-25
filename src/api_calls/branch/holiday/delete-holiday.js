import axios from "axios";

export const DeleteHoliday = async (holiday_id) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "holiday/" + holiday_id;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "DELETE",
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Holiday deleted Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Something went wrong",
        data: [],
      };
    });
};
