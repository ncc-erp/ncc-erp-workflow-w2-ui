import axios from "axios";

export const getInfoUserByGoogle = async (token: string) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}