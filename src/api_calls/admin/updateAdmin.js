import axios from "axios";

export const UpdateAdmin = async (obj) => {
  let admin_id = localStorage.getItem("admin_id");

  const token = localStorage.getItem("token");

  const api = process.env.NEXT_PUBLIC_API_URL + "admin/" + admin_id;

  const data = obj;

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
        message: "Admin updated Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Admin Details",
        data: [],
      };
    });
};
