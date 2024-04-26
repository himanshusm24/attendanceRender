import axios from "axios";

export const deleteRoles = async (obj, deleteRoleId) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "roles/" + deleteRoleId;

  const data = obj;
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "delete",
    data: data,
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Role deleted Successfully",
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
