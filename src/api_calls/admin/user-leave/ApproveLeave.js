import axios from "axios";

export const UserApproveLeave = async (obj) => {
    console.log('obj: ', obj);
  try {
    const api =
      process.env.NEXT_PUBLIC_API_URL + `user-leave/approve/${obj.id}`;

    const data = {
      leave_status: obj.leave_status,
      user_id: obj.user_id,
      leave_count: obj.leave_count
    };

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
          message: "Approved Leave successfully",
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
