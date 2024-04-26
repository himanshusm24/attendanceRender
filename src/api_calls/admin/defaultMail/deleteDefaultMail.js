import axios from "axios";

export const deletedefaultMail = async (deleteId) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "defaultMail/" + deleteId;

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
        message: "Default mail deleted Successfully",
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
