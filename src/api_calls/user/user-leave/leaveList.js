import axios from "axios";

export const UserLeaveList = async (obj) => {
  try {
    let api = process.env.NEXT_PUBLIC_API_URL + "user-leave/list";

    let queryString = "";
    if (obj) {
      queryString = Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join("&");
    }

    if (queryString !== "") {
      api += `?${queryString}`;
    }

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const config = {
      headers: headers,
      url: api,
      method: "GET",
    };

    return await axios
      .request(config)
      .then((response) => {
        return {
          status: true,
          message: "Leave List Fetched",
          data: response.data,
        };
      })
      .catch((error) => {
        return { status: false, message: error.message, data: [] };
      });
  } catch (err) {
    return { status: false, message: err, data: [] };
  }
};
