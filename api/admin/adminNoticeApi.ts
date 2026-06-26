import axiosInstance from "@/api/axiosInstance";
import { AdminNoticeInputType } from "@/schemas/notice/adminNoticeSchema";

const createNotice = async (input: AdminNoticeInputType) => {
    const response = await axiosInstance.post("/admin/notice/create", input);
    return response.data.data;
}

export default {
    createNotice,
}