import axios from "axios";

export const UpdateCompany = async (obj, company_id) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "company/" + company_id;

    const data = obj;

    const config = {
        url: api,
        method: "PUT",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "Company Added Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Provide All Company Details", data: [] };

    });
};