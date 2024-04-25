import axios from "axios";

export const CompanyLists = async (company_id = 0) => {

    let api = process.env.NEXT_PUBLIC_API_URL + "company";

    if (company_id > 0) {
        api += "?company_id=" + company_id;
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