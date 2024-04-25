import axios from "axios";

export const UpdateUser = async (obj, user_id) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "user/" + user_id;

    const data = obj;

    const config = {
        url: api,
        method: "PUT",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "User Added Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Provide All User Details", data: [] };

    });
};