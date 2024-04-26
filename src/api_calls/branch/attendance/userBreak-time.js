import axios from "axios";

export const UserBreakTime = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/break-time";

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
          message: "Got user Break-time",
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
