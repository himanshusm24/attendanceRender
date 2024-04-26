import axios from "axios";

export const CreateCompany = async (obj) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "company";

    const data = obj;

    const config = {
        url: api,
        method: "POST",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: "Company Added Successfully", data: response.data };

    }).catch((error) => {

        return { status: false, message: "Please Provide All Company Details", data: [] };

    });
};