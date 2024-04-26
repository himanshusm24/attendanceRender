import axios from "axios";

export const HolidayList = async (holiday_id = 0, month = 0) => {
  // console.log('month: ', month);
  let company_id = localStorage.getItem("companyAdmin_id");

  let api =
    process.env.NEXT_PUBLIC_API_URL + "holiday?company_id=" + company_id;

  // if (company_id > 0) {
  //   api += "?company_id=" + company_id;
  // }

  if (holiday_id > 0) {
    api += "&holiday_id=" + holiday_id;
  }

  if (month) {
    api += "&month=" + month;
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
        message: "Details Fetch Successfully",
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        message: "Something went wrong",
        data: [],
      };
    });
};
