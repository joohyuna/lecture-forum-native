import TextComponent from "@/components/common/text/TextComponent";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { Link, useRouter } from "expo-router";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Badge from "@/components/common/badge/Badge";
import { Feather } from "@expo/vector-icons";

function AdminCategoryListPage() {
    // const router = useRouter();
    const [list, setList] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCategories = async () => {
        try {
            const result = await adminCategoryApi.getCategoryList();
            setList(result);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                alert("카테고리 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "카테고리 목록을 불러오는데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        loadCategories().then(() => {});
    }, []);

    const handleToggleStatus = async (id: number) => {
        try {
            // 상태값 변경 요청
            await adminCategoryApi.toggleCategoryStatus(id);
            loadCategories().then(() => {});
            // 목록을 다시 불러와서 반영
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                alert("카테고리 상태 변경에 실패했습니다.");
            } else {
                Alert.alert("오류", '"카테고리 상태 변경에 실패했습니다."');
            }
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    // 목록 출력 페이지 => div / table
    //                  => 리액트에서는 가급적 table로 짜서 표현 -> 엑셀에 복사 붙여넣기를 해도 괜찮았음
    //                  => 리액트 네이티브에는 table이 있기 때문에 View (div)로 짜야함
    //                      -> 엑셀에서는 문제가 될 수 있음
    //                      -> 엑셀을 고려해야 한다면, 엑셀 파일로 다운로드 받는 기능을 마련해주면 문제 해결
    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"카테고리 관리"}
                description={"서비스의 토론장 카테고리를 관리하고 생성할 수 있습니다."}>
                <Link href={"/admin/categories/create"} asChild>
                    <Button variant={"contained"} color={"primary"}>
                        + 카테고리 생성
                    </Button>
                </Link>
            </Title>

            <Card className={twMerge(["flex-1", "overflow-hidden"])}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-16"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1", "px-2"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        카테고리명
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        상태
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        관리
                    </TextComponent>
                </View>

                <ScrollView className={"flex-1"}>
                    {list.length === 0 && (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 카테고리가 없습니다.
                            </TextComponent>
                        </View>
                    )}

                    {list.map(item => (
                        <View
                            key={item.id}
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3"],
                                ["border-b", "border-divider", "hover:bg-background-default"],
                                "transition-all",
                            )}>
                            <TextComponent
                                className={twMerge(["hidden", "md:flex", "w-16"], ["text-center"])}>
                                {item.id}
                            </TextComponent>
                            <TextComponent
                                className={twMerge(["flex-1", "px-2"])}
                                ellipsizeMode={"tail"} // 말줄임 표시를 할 수 잇는 속성
                                numberOfLines={1} // 텍스트를 몇 줄 보여줄까
                            >
                                {item.name}
                            </TextComponent>
                            <TextComponent className={twMerge(["w-24"], ["text-center"])}>
                                <Badge
                                    variant={"outlined"}
                                    color={item.status === "ACTIVE" ? "success" : "error"}>
                                    {item.status === "ACTIVE" ? "활성" : "비활성"}
                                </Badge>
                            </TextComponent>
                            <View
                                className={twMerge(
                                    ["w-24"],
                                    ["flex-row", "justify-center", "items-center", "gap-3"],
                                )}>
                                <Link href={`/admin/categories/${item.id}`} asChild>
                                    <Pressable>
                                        <Feather
                                            name={"edit-2"}
                                            size={16}
                                            className={twMerge([
                                                "text-text-secondary",
                                                "hover:text-primary-main",
                                            ])}
                                        />
                                    </Pressable>
                                </Link>
                                <Pressable onPress={() => handleToggleStatus(item.id)}>
                                    <Feather
                                        name={
                                            item.status === "ACTIVE"
                                                ? "toggle-right"
                                                : "toggle-left"
                                        }
                                        size={18}
                                        className={twMerge([
                                            item.status === "ACTIVE"
                                                ? "text-success-main"
                                                : "text-error-main",
                                        ])}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </Card>
        </View>
    );
}

export default AdminCategoryListPage;
