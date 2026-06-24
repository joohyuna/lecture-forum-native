import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    fullscreen?: boolean; // 로딩 컴포넌트가 전체 화면의 중심에서 들어가길 원하면 true
    // false라면 사용되는 그 자리에 빙글 비글 sp
}

function LoadingIndicator({
    fullscreen = false,
    size = "large",
    color = "#3B82F6",
    className,
    ...props
}: LoadingIndicatorProps) {
    if (fullscreen) {
        return (
            <View
                className={twMerge(
                    ["absolute", "z-50", "inset-0"],
                    ["justify-center", "items-center"],
                    className,
                )}>
                <View
                    className={twMerge(
                        ["absolute", "inset-0"],
                        ["bg-background-default", "opacity-70"],
                    )}
                ></View>
                <ActivityIndicator size={size} color={color} {...props} />
            </View>
        );
    }
    return (
        <View className={twMerge(["py-10", "justify-center", "items-center"], className)}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
}

export default LoadingIndicator;
