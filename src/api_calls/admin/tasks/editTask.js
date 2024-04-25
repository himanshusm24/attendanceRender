import axios from "axios";

export const editTask = async (editTaskId) => {

  let api = process.env.NEXT_PUBLIC_API_URL + "editTask/" + editTaskId;

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
        message: "Task Updated Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Task Details",
        data: [],
      };
    });
};
