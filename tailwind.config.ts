// tailwind.config.ts
import { Config } from "tailwindcss";

export default {
    // darkMode를 어떠한 방식으로 사용하게 될건지를 결정
    darkMode: "class",
    // tailwindcss가 클래스를 구성할 때 참고해야 되는 코드들의 위치
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    plugins: [],
} satisfies Config;
