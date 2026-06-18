import { Config } from "prettier";

export default {
    // darkMode를 어떠한 방식으로 사용하게 될건지를 결정
    darkMode: "class",
    // tailwindcss가 클래스를 구성할 때 참고해야 되는 코드들의 위치
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    preset: [require("nativewind/preset")],
    plugins: [],
} satisfies Config;


// type User = {}



// satisfies : 타입을 지정하는 방식이나, 해당 객체의 모양을 만족하는지에 대해서만 검사함
//             맞지 않더라도 에러는 아님



//  const a: User {
//      name: "abc",
//      nickname: "eee",
//  }
// 값에 : 을 붙여서 타입을 지정하는것 진짜 그 모양 그대로만 맞춰줘야 함, 안 맞으면 에러,
