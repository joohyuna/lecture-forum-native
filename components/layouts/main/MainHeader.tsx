import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useThemeStore } from "@/store/theme/useThemeStore";
import Button from "@/components/common/button/Button";

function MainHeader() {
    const { theme, onChangeTheme } = useThemeStore();

    return (
        <View className={"w-full h-16 bg-background-paper border-b border-divider"}>
            <View className={"flex-row justify-between items-center w-full max-w-5xl mx-auto h-16"}>
                <Link href={"/"} asChild>
                    <Pressable className={"flex-row items-center gap-1.5"}>
                        <Ionicons name={"chatbubbles"} size={24} className={"text-primary-main"} />
                        <Text className={"text-lg font-extrabold text-primary-main"}>
                            토론대난투
                        </Text>
                    </Pressable>
                </Link>

                <View className={"flex-row items-center gap-8"}>
                    <Pressable onPress={onChangeTheme} className={"p-1.5 mr-1"}>
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={20}
                            className={"text-text-default"}
                        />
                    </Pressable>
                    <Link href={"/auth/login"} asChild>
                        <Button color={"primary"} variant={"text"}>
                            로그인
                        </Button>
                    </Link>
                    <Link href={"/auth/register"} asChild>
                        <Button variant={"contained"} color={"primary"}>
                            회원가입
                        </Button>
                    </Link>
                </View>
            </View>
        </View>
    );
}

export default MainHeader;
