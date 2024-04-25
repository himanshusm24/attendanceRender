import axios from "axios";

export const createLog = async (
  followUpId,
  message,
  method,
  oldValue = null,
  newValue = null,
  data_id = null,
  data_type = null
) => {
  let userType = localStorage.getItem("user_type");
  const token = localStorage.getItem("token");

  let api = process.env.NEXT_PUBLIC_API_URL + "create";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const strMsg = JSON.stringify(message);

  let data = {
    followUpId: followUpId,
    type: userType,
    message: strMsg,
    oldValue: oldValue,
    newValue: newValue,
    data_id: data_id,
    data_type: data_type,
  };

  if (method == "post") {
    data.message = `Created: ${data.message}`;
  }
  if (method == "put") {
    data.message = `Updated: ${data.message}`;
  }
  if (method == "delete") {
    data.message = `Deleted: ${data.message}`;
  }

  const config = {
    headers: headers,
    url: api,
    method: "POST",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Log Created Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Details",
        data: [],
      };
    });
};
