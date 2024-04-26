import axios from "axios";

export const DailyLog = async (obj) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "attendance/daily-log";

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

        return { status: true, message: "User Clock-out Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Enter a valid Email & Password", data: [] };

    });
};