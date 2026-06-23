import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/user";
import { LoginUserInputType } from "@/schemas/user/loginUserSchema";

// RegisterUserInputType 에 존재하는 항목들 중 "confirmPassword"라는 항목을
// 실제 백엔드에게는 던져주지 않아도 되는 항목
const registerUser = async (
    data: Omit<RegisterUserInputType, "confirmPassword">,
): Promise<User> => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data;
};



const login = async (data: LoginUserInputType): Promise<{user: User, token: string}> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
}

export default {
    registerUser,
    login,
};

// Pick은 <첫번째 자리, 두번째자리> 첫번째 자리 타입을 기준으로 두번째 자리에 써 놓은 것임 "선택"
// Omit은 <첫번째 자리, 두번째자리> 첫번째 자리 타입을 기준으로 두번째 자리에 써 놓은 것임 "제외"