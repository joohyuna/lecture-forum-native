import TextComponent from "@/components/common/text/TextComponent";
import { useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import { useLocalSearchParams, useRouter } from "expo-router";
import noticeApi from "@/api/user/noticeApi";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Pagination from "@/components/common/pagination/Pagination";

function AdminNoticeListPage() {
    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const loadNotices = async (targetPage: number, targetSize: number) => {
        try {
            const result = await noticeApi.getNoticeList(targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                alert("공지사항 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "공지사항 목록을 불러오는데 실패했습니다.");
            }
        }
    };

    useEffect(() => {
        loadNotices(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"공지사항 관련"}
                description={"서비스의 주요 소식 및 공지사항을 관리합니다."}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onPress={() => router.push("/admin/notices/create")}>
                    + 공지사항
                </Button>
            </Title>

            <Card className={twMerge("p-0")}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default", "rounded-t-xl"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["w-12", "hidden", "md:flex"],
                            ["font-bold", "text-text-secondary", "justify-center"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-default", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                </View>

                <ScrollView className={"flex-1"}>
                    {list.length === 0 && (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 공지사항이 없습니다.
                            </TextComponent>
                        </View>
                    )}
                    {list.map((item, index) => (
                        <View
                            key={item.id}
                            className={twMerge(
                                ["flex-row", "items-center", "px-4", "py-3", "transition-all"],
                                ["border-b", "border-divider"],
                                index === list.length - 1 && ["rounded-b-xl", "border-b-0"],
                            )}>
                            <TextComponent
                                className={twMerge(
                                    ["hidden", "md:flex", "w-12"],
                                    ["text-bold", "text-text-secondary"],
                                )}>
                                {item.id}
                            </TextComponent>
                            <Pressable
                                className={twMerge("flex-1", "justify-center", "px-2")}
                                onPress={() => router.push(`/admin/notices/${item.id}`)}>
                                <TextComponent
                                    className={twMerge([
                                        "font-bold",
                                        "hover:text-primary-main",
                                        "transition-all",
                                    ])}>
                                    {item.title}
                                </TextComponent>
                            </Pressable>
                            <TextComponent
                                className={twMerge("w-24", [
                                    "text-sm",
                                    "text-text-secondary",
                                    "text-center",
                                ])}
                                numberOfLines={1}
                                ellipsizeMode={"tail"}>
                                {item.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>
                    ))}
                </ScrollView>
            </Card>
            <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={newPage =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
                size={"medium"}
                color={"primary"}
                shape={"rounded"}
            />
        </View>
    );
}

export default AdminNoticeListPage;
