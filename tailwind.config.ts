// tailwind.config.ts
import { Config } from "tailwindcss";

export default {
    // darkMode를 어떠한 방식으로 사용하게 될건지를 결정
    darkMode: "class",
    // tailwindcss가 클래스를 구성할 때 참고해야 되는 코드들의 위치

    // 경로에 대해서 지정을 할 때 "모든 폴더"를 뜻하는 규칙은
    // * : 직계 자식으로 있는 모든 폴다
    // ** : 직계 뿐만 아니라 트리를 타고 들어가는 하위의 모든 폴더를 의미함

    // *.*.{js,jsx,ts,tsx} : 파일명은 모든 파일명이고, 확장자가 js, jsx, ts, tsx 파일을 의미함
    // *(abc) : 파일명 아무렇게나 붙이는것
    // tsx : 확장자 (해당 파일의 종류)
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./types/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    plugins: [],
    theme: {
        extend: {
            maxWidth: {
                "250": "1000px",
            },
            colors: {
                /* 이 부분에 내갸 원하는 컬러 팔레트를 마음대로 적으면 됨 */
                background: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                },
                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },
                divider: "var(--divider)",
                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                },
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                },
                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                },
                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
                },
                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                },
                info: {
                    main: "var(--info-main)",
                    contrast: "var(--info-contrast)",
                },
            },
        },
    },
    safelist: [
        // 코드에서 니가 찾지 못해도, 여기에 기록한 클래스는 만들어줘
        // 변수
        {
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning|info)-(main|contrast)/,
        },
    ],
} satisfies Config;

// type User = {
//      name: string;
//      nickname: string;
// };

// cons a = {
//      name: "abc";
//      nickname: "eee",
// } satisfies User;
// satisfies : 타입을 지정하는 방식이나, 해당 객체의 모양을 만족하는지에 대해서만 검사함.
//             맞지 않더라도 에러는 아님.

// const a: User {
//      name: "abc",
//      nickname?: "eee",
// };
// 값에 : 을 붙여서 타입을 지정하는 건 진짜 그 모양 그대로만 맞춰줘야함, 안 맞으면 에러.
