import axios from "axios";

export const getAdmin = async (id) => {
  const token = localStorage.getItem("token");
  const adminid = localStorage.getItem("admin_id");

  let api = process.env.NEXT_PUBLIC_API_URL + "admin?id=" + adminid;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "get",
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Admin Get Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All admin Details",
        data: [],
      };
    });
};
