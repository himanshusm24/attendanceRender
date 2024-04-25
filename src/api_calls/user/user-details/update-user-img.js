import axios from "axios";

export const UpdateUserImage = async (obj) => {

    let api = process.env.NEXT_PUBLIC_API_URL + "user-profile-img/";

    const user_id = localStorage.getItem('user_id');

    if (user_id > 0) {
        api += user_id;
    }

    const data = obj;

    const config = {
        url: api,
        method: "PUT",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "User Image Updated Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Provide All User Details", data: [] };

    });
};