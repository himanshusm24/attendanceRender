import axios from "axios";

export const ChangePasswordAdminAPI = async (adminId, adminData, adminPassword, adminConfirmPassword) => {

    const api = process.env.NEXT_PUBLIC_API_URL + "admin/change-password";

    const data = {
        adminId: adminId,
        adminData: adminData,
        adminPassword: adminPassword,
        adminConfirmPassword: adminConfirmPassword,
    };

    const config = {
        url: api,
        method: "POST",
        data: data,
    };

    return await axios.request(config).then((response) => {

        return { status: true, message: response.message, data: response.data };

    }).catch((error) => {

        return { status: false, message: error.response.data.message, data: [] };

    });
};