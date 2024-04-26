import axios from "axios";
import moment from "moment";

export const BreakUpdate = async (obj) => {
//   console.log("obj: ", obj);
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/breakUpdate";

    const data = {
      id: obj.id,
      user_id: obj.user_id,
      company_id: obj.company_id,
      attendance_date: moment(obj.attendance_date).format("YYYY-MM-DD"),
      breakId: obj.breakId,
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
          message: "Updated break",
          data: response,
        };
      })
      .catch((error) => {
        return { status: false, message: error.message, data: [] };
      });
  } catch (err) {
    return { status: false, message: err, data: [] };
  }
};
