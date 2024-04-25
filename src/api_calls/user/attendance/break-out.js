import axios from "axios";

export const BreakOut = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/break-out";

    const data = {
      company_id: obj.company_id,
      user_id: obj.user_id,
      attendance_date: obj.attendance_date,
      break_endTime: obj.break_endTime,
    };

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
          message: "User Break-out Successfully",
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
