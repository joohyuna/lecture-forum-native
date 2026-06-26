import axiosInstance from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { User } from "@/types/user";
import { AdminCreateUserInputType } from "@/schemas/user/adminCreateUserSchema";

const getUserList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<User>> => {
    // axiosInstance 옵션값을 두번째 매개변수로 넣는데
    // 그냥 넣으면 req.body에 포함되어서 전송되고
    // 옵션에 params라는 프로퍼티를 만들어서 집어넣어야 쿼리스티링으로 전송
    const response = await axiosInstance.get("/admin/user/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const createUser = async (input: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", input);
    return response.data.data;
};

const deleteUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}/delete`);
    return response.data.data;
};

export default {
    getUserList,
    createUser,
    deleteUser,
};
