import axios from "axios";

export const deleteProject = async (deleteProjectId) => {

  let api = process.env.NEXT_PUBLIC_API_URL + "deleteProject/" + deleteProjectId;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "put",
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Project deleted Successfully",
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
