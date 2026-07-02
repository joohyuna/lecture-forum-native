import { z } from "zod";

export const postSchema = z
    .object({
        categoryId: z.number().positive("카테고리 정보가 올바르지 않습니다."),
        title: z.string().min(1, "제목을 입력해주세요").max(255, "제목은 255를 넣을 수 없습니다."),
        content: z.string().min(1, "내용을 입력해주세요"),
        option1Text: z.string().max(50, "50자이내로 입력해주세요").optional().or(z.literal("")),
        option2Text: z.string().max(50, "50자이내로 입력해주세요").optional().or(z.literal("")),
    })

    // 메소드 체인 refine() 은 검증 함수를 단순화 하여 true나 false로 검증 + 오류 메세지를 한 곳에만 출력할 때 사용
    // superRefine()은 검증 함수가 복잡해져야 할 때 사용
    // superRefine(함수)
    // superRefine((data, ctx) => {}) : data는 입력값들, ctx는 context

    // Context : 맥락 => 어떤 일이 일러나는데 필요한 배경 정보나 상황
    // zod안에서의 ctx는 zod 안에서의 context를 표현하는건데, zod 안에서 처리되는 흐름 안에서의 컨베이어 밸트 위의 박스

    // # 백엔드(Express) 쪽에서의 Context
    // 서버에 요청이 들어오고 나갈 때의 흐름을 관리하는데 쓰임

    // # 프론트엔드(React) 쪽에서의 Context
    // 컴포넌트 기반으로 전역 상태르 관리할 때 쓰임
    .superRefine((data, ctx) => {
        const isOption1Filled = !!data.option1Text?.trim();
        const isOption2Filled = !!data.option2Text?.trim();
        // 우리가 생각한걸 만족시키려면 둘 다 true거나 둘다 false거나
        if (isOption1Filled !== isOption2Filled) {
            // 문제가 생격ㅆ을 때 이슈를 추가한다
            ctx.addIssue(({
                code: "custom",
                message: "투표를 설정하려면 두 선택지 모두 입력해주세요",
                path: ["option2Text"]
            }))
        }
    });

export type PostInputType = z.infer<typeof postSchema>;
