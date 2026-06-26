import { z } from "zod";
import { Gender, Role } from "@/types/user";

export const adminCreateUserSchema = z.object({
    username: z.string().min(4, "아이디는 4자 이상이어야 합니다."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상이어야 합니다.")
        .max(10, "닉네임은 최대 10자까지 가능합니다."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    phoneNumber: z.string().optional().or(z.literal("")),
    // birthdate는 웹에서는 input type="date"를 써서 달력으로 입력을 받도록 했는데,
    // React-Native엔 type이 없어서 숫자 8자리를 받도록 했었음
    // 정규식을 통해 제한 => 첫자리 숫자는 1과 2만 가능하다 / 두번쨰 자리 숫자는 9 0
    //                     다섯번쨰 자리 숫자 0과 1만 가능하다. 일곱번쨰 자리는 0 1 2 3
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요")
        .optional()
        .or(z.literal("")),  // 보여지는 대로 이값에 대해서도 허용하겠다 이것을 제외해줘야함
    gender: z.enum(Gender, "성별을 선택해주세요"),
    role: z.enum(Role, "권한을 선택해주세요."),
});

export type AdminCreateUserInputType = z.infer<typeof adminCreateUserSchema>;
