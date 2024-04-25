import axios from "axios";

export const AttedanceCount = async (
  per_page = 20,
  skip_count = 0,
  filterDate = ""
) => {
  console.log("filterDate: ", filterDate);
  let api = process.env.NEXT_PUBLIC_API_URL + `attendance-list`;

  if (filterDate != "") {
    api += `?filterDate=${filterDate.filterDate}`;
  }

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
    url: api,
    method: "GET",
  };

  return await axios
    .request(config)
    .then((response) => {
      return {
        status: true,
        message: "Attendance Count Fetched Successfully",
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
