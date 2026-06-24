import { z } from "zod";

export const AdminCategorySchema = z.object({
    name: z
        .string()
        .min(1, "카테고리 이름은 필수값입니다.")
        .max(50, "카테고리 이름은 절대 50자 까지 입니다."),
});

export type AdminCategoryInputType = z.infer<typeof AdminCategorySchema>;
