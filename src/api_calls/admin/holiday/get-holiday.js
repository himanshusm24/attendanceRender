import axios from "axios";

export const HolidayList = async (
  holiday_id = 0,
  month = 0,
  company_id,
  holidayTitle = ""
) => {
  let api = process.env.NEXT_PUBLIC_API_URL + "holiday";

  // if (holiday_id > 0) {
  //   api += "?holiday_id=" + holiday_id;
  // }

  // if (month) {
  //   api += "?month=" + month;
  // }

  // if (company_id) {
  //   api += "&&company_id=" + company_id;
  // }

  // if (holidayTitle.length > 0) {
  //   api += "?holidayTitle=" + holidayTitle;
  // }
  if (holiday_id > 0) {
    api += (api.includes("?") ? "&" : "?") + "holiday_id=" + holiday_id;
  }

  if (month) {
    api += (api.includes("?") ? "&" : "?") + "month=" + month;
  }

  if (company_id) {
    api += (api.includes("?") ? "&" : "?") + "company_id=" + company_id;
  }

  if (holidayTitle.length > 0) {
    api += (api.includes("?") ? "&" : "?") + "holidayTitle=" + holidayTitle;
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
