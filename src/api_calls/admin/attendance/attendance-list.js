import axios from "axios";

export const AttedanceList = async (
  per_page = 20,
  skip_count = 0,
  filterDate = "",
  userDetails = "",
  company_id = ""

) => {
  const api = process.env.NEXT_PUBLIC_API_URL + "attendance-list";

  let data = { per_page: per_page, skip_count: skip_count };

  if (filterDate != "") {
    data = { ...data, filterDate: filterDate };
  }

  if (userDetails != "") {
    data = { ...data, userDetails: userDetails };
  }
  if (company_id != "") {
    data = { ...data, company_id: company_id };
  }

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

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
        message: "Attendance List Fetched Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Please Provide Per Page Count Details",
        data: [],
      };
    });
};
