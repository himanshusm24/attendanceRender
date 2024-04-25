import axios from "axios";

export const TotalBreakTime = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/total-break-time";

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
          message: "Got total Break-time",
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
