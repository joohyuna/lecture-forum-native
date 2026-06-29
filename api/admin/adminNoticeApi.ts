import axiosInstance from "@/api/axiosInstance";
import { AdminNoticeInputType } from "@/schemas/notice/adminNoticeSchema";
import { Notice } from "@/types/notice";

const createNotice = async (input: AdminNoticeInputType) => {
    const response = await axiosInstance.post("/admin/notice/create", input);
    return response.data.data;
}

const updateNotice = async (id: number, input: AdminNoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.patch(`/admin/notice/${id}`, input);
    return response.data.data;
}

const  deleteNotice = async (id: number): Promise<void> => {
    // Promise라는 뜻은 내가 기다려야 결과를 알 수 있다 => async - await을 썼으면 무조건임
    await axiosInstance.delete(`/admin/notice/${id}`);
    // return값이 없다. => void
}

export default {
    createNotice,
    updateNotice,
    deleteNotice,
}