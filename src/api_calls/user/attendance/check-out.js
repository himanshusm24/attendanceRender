import axios from "axios";

export const CheckOut = async (obj) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/check-out";

    const data = {
        company_id: obj.company_id,
        user_id: obj.user_id,
        attendance_date: obj.attendance_date,
        checkout_time: obj.checkout_time,
        checkout_address: obj.checkout_address,
        checkout_latitude: obj.checkout_latitude,
        checkout_longitude: obj.checkout_longitude,
        checkout_img: obj.checkout_img,
    };

    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const config = {
        headers: headers,
        url: api,
        method: "POST",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "User Clock-out Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: error.message, data: [] };

    });
};