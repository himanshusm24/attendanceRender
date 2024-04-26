import axios from "axios";

export const UserApplyLeave = async (obj) => {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL + "user-leave";

    const userId = localStorage.getItem("user_id");
    const companyId = localStorage.getItem("companyId");
    const data = {
      user_id: userId,
      companyId: companyId,
      from_date: obj.obj.from_date,
      to_date: obj.obj.to_date,
      to_email: obj.obj.to_email,
      subject: obj.obj.subject,
      body: obj.obj.body,
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
          message: "Applied Leave successfully",
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
