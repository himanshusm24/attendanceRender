import axios from "axios";

export const MonthlyLog = async (obj) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/monthly-log";

    const data = {
        company_id: obj.company_id,
        user_id: obj.user_id,
        attendance_date: obj.attendance_date
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

        return { status: true, message: "User Monthly Log Get Successfully", data: response.data, present_count: response.present_count, half_count: response.half_count };

    }).catch((error) => {

        return { status: false, message: "Please Enter a valid Email & Password", data: [] };

    });
};