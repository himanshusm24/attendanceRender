import axios from "axios";

export const BreakIn = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/break-in";

    const data = {
      company_id: obj.company_id,
      user_id: obj.user_id,
      attendance_date: obj.attendance_date,
      break_startTime: obj.break_startTime,
      remark: obj.remark,
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
          message: "User Break-in Successfully",
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
