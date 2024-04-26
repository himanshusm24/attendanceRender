import { sendRequest } from "@/api_calls/sendRequest";

let token;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

export const getAllStatus = async () => {
  try {
    const data = await sendRequest(
      "get",
      "api/getProjectStatus",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
};
