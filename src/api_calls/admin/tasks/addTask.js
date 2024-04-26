import axios from "axios";

export const addTask = async (obj) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "addTask";

  const data = obj;

  const config = {
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Task Added Successfully",
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
