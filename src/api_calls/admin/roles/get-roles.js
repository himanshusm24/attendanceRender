import axios from "axios";

export const getRole = async (id) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "roles";

  if (id > 0) {
    api += "?id=" + id;
  }

  const token = localStorage.getItem("token");

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
        message: "Role Get Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All role Details",
        data: [],
      };
    });
};
