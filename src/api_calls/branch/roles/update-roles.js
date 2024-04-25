import axios from "axios";

export const updateRoles = async (obj, editRoleId) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "roles/" + editRoleId;

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
        message: "Role Updated Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide All role Details",
        data: [],
      };
    });
};
