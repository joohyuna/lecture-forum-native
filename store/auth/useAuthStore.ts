import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";
import { Platform } from "react-native";

type AuthState = {
    // 값을 저장하는 프로퍼티
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;

    // 저장된 값을 바꿀 수 있도록 외부에서 사용하게 하는 기능 프로퍼티
    // 글자가 아니라 위치 글자는 내가 알아보기 위해서 사용하는 것이다.
    login: (user: User, token: string) => void; // token과 user의 항목의 값을 저장하고, isLoggedIn을 true로 바꾸는 일
    logout: VoidFunction; // token과 user의 항목의 값을 비우고, isLoggedIn을 false로 바꾸는 일
};

// 이 프로그램이 구동되는 환경에 따라 사용해야 하는 스토리지(저장소)가 달라져야 함
// 이프로그램을 실행 할때 결정됨
const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)  // 웹이면
        : createJSONStorage(() => AsyncStorage);  // 앱이면

// 실제 작업 // 값만 바꿔주고 끝낼꺼야
export const useAuthStore = create<AuthState>()(
    persist(
        // persist 로 자동 localStorage 에 저장
        set => ({
            isLoggedIn: false,
            token: null,
            user: null,
            login: (user, token) => set({ isLoggedIn: true, token, user }),
            logout: () => set({ isLoggedIn: false, token: null, user: null }),
        }),

        // react-native 추가 정보 storage 장소가 변경됨
        //
        { name: "auth-storage", storage },
    ),
);

// 원래 객체의 값을 바꿔준다고 했을때, 나머지 항목들도 값을 유지하려면 값을 적어줘야 하는데
// zustand의 set 명렁어는 적어주지 않은 프로퍼니(항목)의 값을 안 적어줘도 유지함
