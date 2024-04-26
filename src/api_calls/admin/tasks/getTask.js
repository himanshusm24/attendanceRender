import axios from "axios";

export const getTask = async (project_id) => {
  let api;
  if (project_id) {
    api = process.env.NEXT_PUBLIC_API_URL + `getTask?project_id=${project_id}`;
  }
  // else if (task_id) {
  //   api = process.env.NEXT_PUBLIC_API_URL + `getTask?task_id=${task_id}`;
  // }
  else {
    api = process.env.NEXT_PUBLIC_API_URL + "getTask";
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
        message: "Task Get Successfully",
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
