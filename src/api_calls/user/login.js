import axios from "axios";

export const LoginAPI = async (email, password) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "user/login";

    const data = {
        email: email,
        password: password
    };

    const config = {
        url: api,
        method: "POST",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: response.message, data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Enter a Valid Email & Password", data: [] };

    });
};