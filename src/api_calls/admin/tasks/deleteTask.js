import axios from "axios";

export const deleteTask = async (deleteTaskId) => {

  let api = process.env.NEXT_PUBLIC_API_URL + "deleteTask/" + deleteTaskId;

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
        message: "Task deleted Successfully",
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
