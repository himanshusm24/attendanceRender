import axios from "axios";

export const sendRequest = async (
  method,
  endpoint,
  data,
  customConfig = {}
) => {
  const defaultConfig = {
    method,
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
    data,
  };

  const config = { ...defaultConfig, ...customConfig };

  try {
    const response = await axios.request(config);
    return { status: 1, msg: "", data: response.data };
  } catch (error) {
    return { status: 0, msg: error};
  }
};