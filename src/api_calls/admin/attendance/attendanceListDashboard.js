import axios from "axios";

export const AttedanceListDashBoard = async (filterDate = "") => {
  const api = process.env.NEXT_PUBLIC_API_URL + "attendance-list/dashboard";

  let data;

  if (filterDate != "") {
    data = { filterDate: filterDate };
  }

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
        message: "Attendance List Fetched Successfully",
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
