import axiosInstance from "@/api/axiosInstance";

const getCategoryList = async () => {
    const response = await axiosInstance.get("/category");
    return response.data.data;

    }

    export default { getCategoryList, };