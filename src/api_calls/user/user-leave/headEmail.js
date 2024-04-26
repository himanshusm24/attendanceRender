import axios from "axios";

export const HeadEmails = async (company_id, department_id) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "user/head";

  if (company_id && department_id) {
    api += `?company_id= ${company_id}&department_id=${department_id}`;
  }
  
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  const config = {
    headers: headers,
    url: api,
    method: "GET"
  };

  return await axios
    .request(config)
    .then((response) => {
      return { status: true, message: response.message, data: response.data };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Enter company Id and department Id",
        data: [],
      };
    });
};
