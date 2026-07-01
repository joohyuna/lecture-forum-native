import axiosInstance from "@/api/axiosInstance";
import { PostListItemType } from "@/types/post";
import { PaginationResponseType } from "@/types/common";

const getPostsByCategory = async (
    categoryId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<PostListItemType>> => {
    const response = await axiosInstance.get(`/post/list/${categoryId}`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

export default {
    getPostsByCategory,
};
