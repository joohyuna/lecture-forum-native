import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCategoryInputType, AdminCategorySchema } from "@/schemas/admin/adminCategorySchema";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import { isAxiosError } from "axios";
import { Alert, Platform, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminCategoryUpdatePage() {
    // expo가 동적라우팅으로 된 주소에 값을 id라고 하는 변수로 전달해줄 것읨
    // React에서 동적라우틴으로 전달된 값을 꺼내는 hook은 useParams
    // Expo에서 동적라우팅으로 전달된 값을 꺼내는 hook은 useLocalSearchParams

    const { id } = useLocalSearchParams<{ id: string }>();
    const categoryId = Number(id);

    // 작성을 해야 되는 내용은 CreatePage와 다를바 없음
    // 현재의 Category 정보를 백엔드에서 불러와서 input에 넣어줘야 된다.
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(AdminCategorySchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const result = await adminCategoryApi.getCategoryById(categoryId);
                reset({name: result.name});
            } catch(error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("카테고리 정보를 불러오는데 싫패했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "카테고리 정보를 불러오는데 싫패했습니다.");
                    router.back();
                    }
                } finally {
                    setIsLoading(false);
                }

            }

        loadCategory().then(() => {});
    }, [categoryId, reset, router]);

    const onSubmit = async (data: AdminCategoryInputType) => {
        try {
            await adminCategoryApi.updateCategory(categoryId, data);
            router.push("/admin/categories");
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                if (error.response?.status === 409) {
                    setError("name", { message: error.response.data.message });
                    return;
                }
            }
            setError("root", { message: "카테고리 수정 중 알 수 없는 오류가 발생되었습니다." });
        }
    };

    if (isLoading) {
        return <LoadingIndicator  fullscreen={true} />
    }
    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title title={"카테고리 수정"} description={"기존 토론장 이름을  수정합니다."} />

            <Card>
                <Controller
                    control={control}
                    name={"name"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                label={"카테고리명"}
                                placeholder={"50자 이내로  입력해주세요"}
                                onBlur={onBlur}
                                onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                value={value}
                                errorMessage={errors.name?.message}
                                onSubmitEditing={handleSubmit(onSubmit)} // 엔터키를 줬을 때 발동되어야 하는 함수를 넣어줌
                            />
                        );
                    }}
                />
                {errors.root?.message && (
                    <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                        {errors.root?.message}
                    </ErrorMessage>
                )}

                <View
                    className={twMerge(
                        ["mt-6"],
                        ["flex-row", "items-center", "justify-end", "gap-3"],
                    )}>
                    <Button variant={"outlined"} color={"secondary"} onPress={() => router.back()}>
                        취 소
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "수정하기"}
                    </Button>
                </View>
            </Card>
        </View>
    );
}

export default AdminCategoryUpdatePage;