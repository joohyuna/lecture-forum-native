import TextComponent from "@/components/common/text/TextComponent";
import { Link, useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme/useThemeStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import categoryApi from "@/api/user/categoryApi";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MYPAGE_NAV_LIST } from "@/constants/menu";
import Button from "@/components/common/button/Button";
import { valibotResolver } from "@hookform/resolvers/valibot/src";
import { Role } from "@/types/user";

function MainHeaderMobile() {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [list, setList] = useState<Category[]>([]);
    // 카테고리의 정보를 불러오기 전이라도 로그아웃 등의 기능은 사용할 수 있어야 되므로
    // isLoading는 없을 것임

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await categoryApi.getCategoryList();
                setList(result);
            } catch (error) {
                console.log(error);
            }
        };
        loadCategories().then(() => {});
    }, []);

    const handleNavigate = (path: string) => {
        setIsMenuOpen(false);
        router.push(path);
    }

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
    }

    return (
        <View
            className={twMerge(
                ["w-full", "h-16", "bg-background-paper"],
                ["justify-center"],
                ["border-b", "border-divider"],
            )}>
            <View
                className={twMerge(
                    ["flex-row", "justify-between", "items-center"],
                    ["w-full", "px-4", "h-full"],
                )}>
                <Link href={"/"} asChild>
                    <Pressable className={twMerge("flex-row", "items-center", "gap-2")}>
                        <Ionicons name={"chatbubbles"} size={26} className={"text-primary-main"} />
                        <TextComponent
                            className={twMerge(["text-xl", "font-extrabold", "text-primary-main"])}>
                            토론 대난투
                        </TextComponent>
                    </Pressable>
                </Link>

                <View className={twMerge("flex-row", "items-center", "gap-2")}>
                    <Pressable
                        className={twMerge(
                            ["p-2", "rounded-full"],
                            ["transition-all", "active:bg-background-default"],
                        )}>
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={22}
                            className={twMerge("text-text-default")}
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => setIsMenuOpen(true)}
                        className={twMerge(["p-2", "rounded-lg", "bg-background-default"])}>
                        <Feather name={"menu"} size={24} className={"text-text-default"} />
                    </Pressable>
                </View>
            </View>
            <Modal
                visible={isMenuOpen}
                animationType={"slide"}
                transparent={false}
                onRequestClose={() => setIsMenuOpen(false)}>
                <SafeAreaProvider className={twMerge("flex-1", "bg-background-paper")}>
                    {/* 헤더 부분 */}
                    <View
                        className={twMerge(
                            ["flex-row", "justify-between", "items-center"],
                            ["w-full", "px-4", "h-16"],
                            ["border-b", "border-divider"],
                        )}>
                        <Pressable
                            className={twMerge("flex-row", "items-center", "gap-2")}
                            onPress={() => handleNavigate("/")}>
                            <Ionicons
                                name={"chatbubbles"}
                                size={26}
                                className={"text-primary-main"}
                            />
                            <TextComponent
                                className={twMerge([
                                    "text-xl",
                                    "font-extrabold",
                                    "text-primary-main",
                                ])}>
                                토론 대난투
                            </TextComponent>
                        </Pressable>

                        <Pressable
                            onPress={() => setIsMenuOpen(false)}
                            className={twMerge(["p-2", "rounded-lg", "bg-background-default"])}>
                            <Feather name={"x"} size={24} className={"text-text-default"} />
                        </Pressable>
                    </View>
                    {/* 메뉴 부분 */}

                    <ScrollView
                        className={"flex-1"}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 20, //
                            paddingTop: 24,
                            paddingBottom: 40,
                        }}>
                        <TextComponent
                            className={twMerge("mb-3", [
                                "text-sm",
                                "text-text-secondary",
                                "font-extrabold",
                            ])}>
                            메인메뉴
                        </TextComponent>
                        <View
                            className={twMerge(
                                ["mb-8", "bg-background-default", "rounded-xl"],
                                ["border", "border-divider"],
                            )}>
                            {list.map(item => (
                                <Pressable
                                    key={item.id}
                                    className={twMerge(
                                        ["px-8", "py-3"],
                                        ["active:bg-background-default", "transition-all"],
                                    )}
                                    onPress={() => handleNavigate(`/categories/${item.id}`)}>
                                    <TextComponent className={twMerge("font-medium")}>
                                        {item.name}
                                    </TextComponent>
                                </Pressable>
                            ))}

                            <Pressable
                                onPress={() => handleNavigate("/notices")}
                                className={twMerge(
                                    ["px-8", "py-3"],
                                    ["active:bg-background-default", "transition-all"],
                                )}>
                                <TextComponent className={"font-medium"}>공지사항</TextComponent>
                            </Pressable>
                        </View>
                        {/*  마이메튜 영역 */}
                        {isLoggedIn && (
                            <TextComponent
                                className={twMerge([
                                    "font-extrabold",
                                    "text-sm",
                                    "text-text-secondary",
                                    "mb-3",
                                ])}>
                                마이페이지
                            </TextComponent>
                        )}
                        <View
                            className={twMerge(
                                ["mb-18", "rounded-all", "bg-background-default"],
                                ["border", "border-divider"],
                            )}>
                            {MYPAGE_NAV_LIST.map((item, index) => {
                                // 마지막 요소에만 border-b를 빼주기 위해서
                                // 이 map을 통해 선택된 요소가 마지막 요소인지 판별
                                const isLast = index === MYPAGE_NAV_LIST.length - 1;

                                return (
                                    <View key={index}>
                                        <Pressable
                                            onPress={() => handleNavigate(item.path)}
                                            className={twMerge(
                                                ["flex-row", "justify-between", "items-center"],
                                                ["p-4", "active:bg-divider", "transition-all"],
                                                item.isDanger && "active:bg-error-main",
                                                !isLast && ["border-b", "border-divider"],
                                            )}>
                                            <TextComponent
                                                className={twMerge(
                                                    ["font-medium"],
                                                    item.isDanger && [
                                                        "text-error-main",
                                                        "active:text-error-contrast",
                                                    ],
                                                )}>
                                                {item.label}
                                            </TextComponent>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* 사용자 부분 */}
                    <View className={twMerge(["mt-4", "p-4", "border-t", "border-divider"])}>
                        {isLoggedIn ? (
                            <View
                                className={twMerge(
                                    ["p-4", "rounded-xl"],
                                    ["border", "border-divider", "bg-background-default"],
                                )}>
                                <View
                                    className={twMerge(
                                        ["flex-row", "justify-between", "items-center"],
                                        "mb-4",
                                    )}>
                                    <View>
                                        <TextComponent
                                            className={twMerge(["font-bold", "text-lg"], "bg-1")}>
                                            {user?.nickname} 님
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(["text-sm", "text-text-secondary"])}>
                                            {user?.email}
                                        </TextComponent>
                                    </View>
                                    {user?.role === Role.ADMIN && (
                                        <Pressable
                                            onPress={() => handleNavigate("/admin")}
                                            className={twMerge(
                                                ["p-2", "border", "border-divider"],
                                                ["rounded-full", "bg-background-paper"],
                                            )}>
                                            <Ionicons
                                                name={"shield"}
                                                size={20}
                                                className={"text-primary-main"}
                                            />
                                        </Pressable>
                                    )}
                                    <Button
                                        fullWidth
                                        variant={"contained"}
                                        color={"error"}
                                        onPress={handleLogout}>
                                        로그아웃
                                    </Button>
                                </View>
                            </View>
                        ) : (
                            <View className={twMerge("flex-row", "gap-3")}>
                                <Button
                                    className={"flex-1"}
                                    variant={"outlined"}
                                    color={"primary"}
                                    onPress={() => handleNavigate("/auth/login")}>
                                    로그인
                                </Button>
                                <Button
                                    className={"fle-1"}
                                    variant={"contained"}
                                    color={"primary"}
                                    onPress={() => handleNavigate("/auth/register")}>
                                    회원가입
                                </Button>
                            </View>
                        )}
                    </View>
                </SafeAreaProvider>
            </Modal>
        </View>
    );
}

export default MainHeaderMobile;
