import { z } from "zod";

export const adminNoticeSchema = z.object({
    title: z.string().min(1, "제목음 필수 입력 사항입니다."),
    content: z.string().min(1, "내용은 필수 입력사항입니ㅏㄷ."),
})

export type AdminNoticeInputType = z.infer<typeof adminNoticeSchema>