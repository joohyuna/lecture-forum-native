import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/store/theme/useThemeStore";
import { useColorScheme } from "nativewind";
import { Animated } from "react-native";
import View = Animated.View;
import { useEffect } from "react";

export default function RootLayout() {
    const { theme } = useThemeStore();
    // 앱에서 라이브모드와 다크모들 적용하기 위하  기능을 호출
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        // 앱을 위한것
        setColorScheme(theme);
    }, [theme, setColorScheme]);
    return (
        <View className={theme}>
            <Slot />
        </View>
    );
}
