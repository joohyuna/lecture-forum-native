import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/notice/adminNoticeSchema";
import adminNoticeApi from "@/api/admin/adminNoticeApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";

function AdminNoticeCreatePage() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminNoticeSchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });
    const onSubmit = async (data: AdminNoticeInputType) => {
        // 이 함수는 사용자가 입력한 값을 react-hook-form이 검증을 하고 성공한 정보들을 받아서


        // 사용자자 입력한 값과 백엔드에게 던져야 되는 내용이 다르면 그렇게 맞춰서 수정하여


        // 백엔드에게 던져주는 역할을 하는 함수 (try- catch)
        try {
            await adminNoticeApi.createNotice(data);

            if (Platform.OS === "web") {
                alert("공지사항이 성공적으로 등록되었습니다.");
                router.push("/admin/notices");
            } else {
                Alert.alert("완료", "공지사항이 성공적으로 등록되었습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/notices") },
                ]);
            }
        } catch (error) {
            console.log(error);
            setError("root", { message: "공지사항 등록이 실패했습니다." });
        }
    };

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title title={"공지사항 등록"} description={"서비스에 새로운 공지사항을 등록합니다."} />

            <ScrollView
                className={twMerge(
                    ["flex-1", "p-6"],
                    ["bg-background-paper", "border", "border-divider", "rounded-xl"],
                )}>
                <Controller
                    control={control}
                    name={"title"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                label={"제목"}
                                placeholder={"공지사항 제목을 입력해주세요"}
                                onBlur={onBlur}
                                onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                value={value}
                                errorMessage={errors.title?.message}
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"content"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <TextareaGroup
                                label={"내용"}
                                placeholder={"공지사항 상세 내용을 입력해주세요"}
                                onBlur={onBlur}
                                onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                value={value}
                                errorMessage={errors.content?.message}
                            />
                        );
                    }}
                />
                {errors.root?.message && (
                    <ErrorMessage className={twMerge("mt-2 text-center")}>
                        {errors.root.message}
                    </ErrorMessage>
                )}

                <View
                    className={twMerge("mt-10", [
                        "flex-row",
                        "justify-end",
                        "items-center",
                        "gap-3",
                    ])}>
                    <Button variant={"outlined"} color={"secondary"} onPress={() => router.back()}>
                        취소
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "저장 중..." : "저장"}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeCreatePage;
