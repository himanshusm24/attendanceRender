import axios from "axios";

export const editProject = async (editProjectId) => {

  let api = process.env.NEXT_PUBLIC_API_URL + "editProject/" + editProjectId;

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
        message: "Project Updated Successfully",
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
