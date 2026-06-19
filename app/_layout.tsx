import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/store/theme/useThemeStore";  // 문법 오류
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
    const { theme } = useThemeStore();
    // 앱에서 라이브모드와 다크모들 적용하기 위하  기능을 호출
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        // 앱을 위한것
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    // SafeAreaProvider : 앱 환경일때 최상단에 휴대폰 OS 상태바가 들어가기 때문에 그것이 가려지지 않도록
    //                      앱 전체를 감싸주는 컴포넌트
    // StatusBar : 앱 환경일 때 최상단에 휴대폰 OS 상태바를 커스텀 할 수 있는 컴포넌트
    return (
        <SafeAreaProvider>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <SafeAreaView className={"flex-1 bg-background-default"}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
