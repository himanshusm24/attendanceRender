import axios from "axios";

export const UserListss = async (user_id = 0) => {

    let api = process.env.NEXT_PUBLIC_API_URL + "user";

    if (user_id > 0) {
        api += "?user_id=" + user_id;
    }

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