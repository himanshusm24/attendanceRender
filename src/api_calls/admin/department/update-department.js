import axios from "axios";

export const updateDepartment = async (obj, editDepartmentId) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "department/" + editDepartmentId;

  const data = obj;
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "put",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Department Updated Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All department Details",
        data: [],
      };
    });
};
