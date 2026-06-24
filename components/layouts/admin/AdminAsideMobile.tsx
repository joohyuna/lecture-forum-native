import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Link, usePathname } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { ADMIN_NAV_LIST } from "@/constants/menu";
import Button from "@/components/common/button/Button";
// import { useAuthStore } from "../../../store/auth/useAuthStore";

function AdminAsideMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    // useWindowDimensions: 화면의 정보를 실시간으로 가져오는 hooks
    // width, height, scale 같은 것들을 실시간으로 꺼내올 수 있음
    const { width } = useWindowDimensions();
    useEffect(() => {
        if (width >= 768 && isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [width, isMenuOpen]);

    return (
        <>
            {/*    화면 상단에 나와야되는 바 */}
            <View
                className={twMerge(
                    ["h-14", "px-4", "flex-row", "justify-between", "items-center"],
                    ["bg-background-paper", "border-b", "border-divider"],
                )}>
                <Link href={"/admin"} asChild>
                    <Pressable>
                        <TextComponent
                            className={twMerge("text-lg", "font-extrabold", "text-primary-main")}>
                            관리자 센터
                        </TextComponent>
                    </Pressable>
                </Link>
                <Pressable className={"p-2"} onPress={() => setIsMenuOpen(!isMenuOpen)}>
                    <Feather name={"menu"} size={24} className={"text-text-default"} />
                </Pressable>
            </View>

            {/*    화면에 햄버거 아이콘을 누르면 튀어나와야 되는 메뉴 View */}
            <Modal visible={isMenuOpen} transparent={true} animationType={"slide"}>
                <View className={twMerge("flex-1", "justify-between", "bg-background-paper")}>
                    {/* 메뉴 상단 */}
                    <View>
                        <View
                            className={twMerge(
                                ["h-14", "flex-row", "justify-between", "items-center", "px-4"],
                                ["border-b", "border-divider"],
                            )}>
                            <Link href={"/admin"} asChild onPress={() => setIsMenuOpen(false)}>
                                <Pressable>
                                    <TextComponent
                                        className={twMerge(
                                            "text-lg",
                                            "font-extrabold",
                                            "text-primary-main",
                                        )}>
                                        관리자 센터
                                    </TextComponent>
                                </Pressable>
                            </Link>
                            <Pressable onPress={() => setIsMenuOpen(false)}>
                                <Feather name={"x"} size={24} className={"text-text-default"} />
                            </Pressable>
                        </View>
                        <View className={twMerge("px-3 py-4 gap-1")}>
                            {ADMIN_NAV_LIST.map(item => {
                                const isActive =
                                    item.path === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.path);

                                return (
                                    <Link
                                        href={item.path}
                                        key={item.path}
                                        asChild
                                        onPress={() => setIsMenuOpen(false)}>
                                        <Pressable
                                            className={twMerge(
                                                ["flex-row", "items-center", "gap-3"],
                                                ["p-4", "rounded-xl"],
                                                // 이 메뉴는 모바일 기준으로 만들어녀야 함
                                                // hover를 해줄 이유가 없음
                                                // active: 클릭하고 있거나 터치하고 있는 순간 적용
                                                isActive
                                                    ? "bg-primary-main"
                                                    : "active:bg-background-default",
                                            )}>
                                            <Feather
                                                name={item.icon as any}
                                                size={20}
                                                className={
                                                    isActive
                                                        ? "text-primary-contrast"
                                                        : "text-text-secondary"
                                                }
                                            />
                                            <TextComponent
                                                className={twMerge(
                                                    "font-bold",
                                                    isActive
                                                        ? "text-primary-contrast"
                                                        : "text-text-secondary",
                                                )}>
                                                {item.label}
                                            </TextComponent>
                                        </Pressable>
                                    </Link>
                                );
                            })}
                        </View>
                    </View>

                    {/* 메뉴 하단 */}
                    <View className={twMerge(["p-4"], ["border-t", "border-divider"])}>
                        <View className={twMerge(["flex-row", "items-center", "gap-3"])}>
                            <View
                                className={twMerge(
                                    ["w-12", "h-12", "justify-center"],
                                    ["bg-primary-main", "rounded-full"],
                                )}>
                                <Feather
                                    name={"shield"}
                                    size={20}
                                    color={"white"}
                                    className={"text-text-default"}
                                />
                            </View>
                            <View>
                                <TextComponent className={twMerge("font-bold")}>
                                    {user?.name}
                                </TextComponent>
                                <TextComponent
                                    className={twMerge("text-sm", "text-text-secondary")}>
                                    {user?.email}
                                </TextComponent>
                            </View>
                        </View>
                        <Button
                            variant={"outlined"}
                            color={"error"}
                            fullWidth={true}
                            size={"large"}
                            onPress={() => {
                                setIsMenuOpen(false);
                                logout();
                            }}>
                            로그아웃
                        </Button>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default AdminAsideMobile;
