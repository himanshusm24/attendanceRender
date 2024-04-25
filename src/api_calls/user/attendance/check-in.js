import axios from "axios";

export const CheckIn = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/check-in";

    const data = {
      company_id: obj.company_id,
      user_id: obj.user_id,
      attendance_date: obj.attendance_date,
      checkin_time: obj.checkin_time,
      checkin_address: obj.checkin_address,
      checkin_latitude: obj.checkin_latitude,
      checkin_longitude: obj.checkin_longitude,
      checkin_img: obj.checkin_img,
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
          message: "User Clock-in Successfully",
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
