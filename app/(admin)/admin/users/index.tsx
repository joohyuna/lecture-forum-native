import TextComponent from "@/components/common/text/TextComponent";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import adminUserApi from "@/api/admin/adminUserApi";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Badge from "@/components/common/badge/Badge";
import { Feather } from "@expo/vector-icons";
import Pagination from "@/components/common/pagination/Pagination";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    // 사용자가 페이지를 바꿔서 쿼리스트링에 값이 기록될텐데, 그 쿼리 스트링 값을 가져요는 hook
    // React에서는 ----------------
    // 동적라우팅 값을 가져오는 것 : useParams();
    // 쿼리스트링 값을 가져오는것 : useSearchParams();
    // React-Native ----------------
    // 동적라우팅이이든, 쿼리스트링이든 : useLocalSearchParams()
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const loadUsers = async (targetPage: number, targetSize: number) => {
        try {
            const result = await adminUserApi.getUserList(targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("유저 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "유저 목록을 불러오는데 실패했습니다.");
            }
        }
    };

    useEffect(() => {
        // 불러오는 함수 실행
        loadUsers(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    const handleDeleteUser = async (id: number) => {
        const executeDelete = async () => {
            try {
                await adminUserApi.deleteUser(id);
                loadUsers(currentPage, pageSize).then(() => {});
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("유저 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "유저 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 유저를 삭제처리 하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("경고", "정말 이 유저를 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };
    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title
                title={"회원 관리"}
                description={"서비스에 가입한 유저 목록을 조회하고 관리합니다."}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onPress={() => router.push("/admin/users/create")}>
                    + 유저 생성
                </Button>
            </Title>
            <Card className={"p-0"}>
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "rounded-t-xl", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        유저 정보
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-16"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        권한
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        가입일
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-20"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        관리
                    </TextComponent>
                </View>

                <ScrollView className={"flex-1"}>
                    {list.length === 0 && (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 유저가 없습니다.
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
                                className={twMerge(["hidden", "md:flex", "w-12"], ["text-center"])}>
                                {item.id}
                            </TextComponent>
                            <View className={twMerge(["flex-1"], ["px-2"])}>
                                <View className={twMerge("flex-row", "items-center", "gap-1.5")}>
                                    <TextComponent className={"font-bold"} numberOfLines={1}>
                                        {item.username}
                                    </TextComponent>
                                    {item.deletedAt && (
                                        <TextComponent>
                                            <Badge
                                                color={"error"}
                                                size={"small"}
                                                variant={"outlined"}>
                                                탈퇴
                                            </Badge>
                                        </TextComponent>
                                    )}
                                </View>
                                <TextComponent
                                    className={twMerge("text-xs", "text-text-secondary", "mt-0.5")}
                                    numberOfLines={1}>
                                    {item.name} ({item.nickname})
                                </TextComponent>
                            </View>
                            <TextComponent
                                className={twMerge(
                                    ["w-16"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                <Badge
                                    color={item.role === "ADMIN" ? "info" : "secondary"}
                                    size={"small"}>
                                    {item.role}
                                </Badge>
                            </TextComponent>
                            <TextComponent
                                className={twMerge(["hidden", "md:flex", "w-24"], ["text-center"])}>
                                {item.createdAt.substring(0, 10)}
                            </TextComponent>
                            <TextComponent
                                className={twMerge(
                                    ["w-20"],
                                    ["font-bold", "text-text-secondary", "text-center"],
                                )}>
                                <Pressable
                                    className={"p-1.5"}
                                    disabled={!!item.deletedAt}
                                    onPress={() => router.push(`/admin/users/${item.id}`)}>
                                    <Feather
                                        name={"edit-2"}
                                        size={16}
                                        className={
                                            item.deletedAt
                                                ? "text-text-secondary"
                                                : "text-text-secondary hover:text-primary-main"
                                        }
                                    />
                                </Pressable>
                                <Pressable
                                    className={"p-1.5"}
                                    disabled={!!item.deletedAt}
                                    onPress={() => handleDeleteUser(item.id)}>
                                    <Feather
                                        name={"trash-2"}
                                        size={16}
                                        className={
                                            item.deletedAt
                                                ? "text-text-secondary"
                                                : "text-error-main"
                                        }
                                    />
                                </Pressable>
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

export default AdminUserListPage;
