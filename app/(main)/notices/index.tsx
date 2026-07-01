import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Notice } from "@/types/notice";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import notices from "@/app/(admin)/admin/notices";
import noticeApi from "@/api/user/noticeApi";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Pagination";

function NoticeListPage() {
    const router = useRouter();
    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = useCallback(async () => {
        try {
            setIsLoading(true); // 페이지네이션으로 데이터를 불러올 때 이동 할때 다시 돌리기 위해
            const result = await noticeApi.getNoticeList(currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
            const msg = "공지사항 목록을 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        // 불러오고
        loadNotices().then(() => {});
    }, [loadNotices]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <ScrollView className={twMerge(["flex-1", "w-full", "bg-background-default"])}>
            <Title title={"공지사항"} description={"서비스의 주요 소식및 안내 사항을 확인하세요"} />

            <Card className={twMerge("p-0")}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        번호
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1", "px-2"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(["w-24"], ["font-bold", "text-text-secondary"])}>
                        내용
                    </TextComponent>
                </View>

                <View>
                    {isLoading ? (
                        <View className={"py-20"}>
                            <LoadingIndicator />
                        </View>
                    ) : (
                        <>
                            {list.length === 0 && (
                                <View
                                    className={twMerge("pt-20", "justify-center", "items-center")}>
                                    <TextComponent className={twMerge(["text-text-secondary"])}>
                                        등록된 공지사항이 없습니다.
                                    </TextComponent>
                                </View>
                            )}
                            {list.map((item, index) => {
                                const isLast = index === list.length - 1;

                                return (
                                    <View
                                        key={index}
                                        className={twMerge(
                                            ["flex-row", "item-center"],
                                            ["px-4", "py-4", "transition-colors"],
                                            ["hover:bg-background-default"],
                                            !isLast && ["border-b", "border-divider"],
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                ["hidden", "md:flex", "w-12"],
                                                ["text-text-secondary"],
                                            )}>
                                            {item.id}
                                        </TextComponent>
                                        <Pressable
                                            className={twMerge(
                                                ["flex-1", "justify-center"],
                                                "px-2",
                                            )}
                                            onPress={() => router.push(`/notices/${item.id}`)}>
                                            <TextComponent
                                                className={twMerge([
                                                    "font-medium",
                                                    "transition-colors",
                                                    "hover:text-primary-main",
                                                ])}
                                                numberOfLines={1}
                                            >
                                                {item.title}
                                            </TextComponent>
                                            <TextComponent className={twMerge(["w-24"], ["text-sm", "text-text-secondary", "text-center"])}>
                                                {item.createdAt.substring(0, 10)}
                                            </TextComponent>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </>
                    )}
                </View>
            </Card>
            <View className={twMerge("py-4")}>
                <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={newPage => router.setParams({
                    page: String(newPage),
                    size: String(pageSize)
                })}
                color={"primary"}
                shape={"square"}>
                </Pagination>
            </View>
        </ScrollView>
    );
}

export default NoticeListPage;
