import axios from "axios";

export const GetUserDetails = async () => {

    const userDetails = localStorage.getItem('user_id');

    const api = process.env.NEXT_PUBLIC_API_URL + "user?user_id=" + userDetails;

    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const config = {
        headers: headers,
        url: api,
        method: "GET",
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "Details Fetach Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Enter a valid Email & Password", data: [] };

    });
};