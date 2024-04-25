import axios from "axios";

export const getProject = async (id) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "getProject";

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
        message: "Project Get Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Project Details",
        data: [],
      };
    });
};
