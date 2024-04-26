import axios from "axios";

export const deleteDepartment = async (deleteRoleId) => {

  let api = process.env.NEXT_PUBLIC_API_URL + "department/" + deleteRoleId;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "delete",
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Department deleted Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All Department Details",
        data: [],
      };
    });
};
