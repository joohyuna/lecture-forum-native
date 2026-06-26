import TextComponent from "@/components/common/text/TextComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminCreateUserInputType,
    adminCreateUserSchema,
} from "@/schemas/user/adminCreateUserSchema";
import { Gender, Role } from "@/types/user";
import { isAxiosError } from "axios";
import adminUserApi from "@/api/admin/adminUserApi";
import { Alert, Platform, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import SelectGroup from "@/components/common/select/SelectGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import {
    AdminUpdateUserInputType,
    adminUpdateUserSchema,
} from "@/schemas/user/adminUpdateUserSchema";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminUserUpdatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = Number(id);
    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminUpdateUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            gender: Gender.MALE,
            role: Role.USER,
        },
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await adminUserApi.getUserById(userId);

                // birthdate : "2026-12-25 14:33:11" -> "20261225"
                // password : 넣어주면 안됨
                // phoneNumber도 값이 없으면 빈 스트링을 input에 넣어줘야 함

                let formattedBirthdate = "";
                if (result.birthdate) {
                    // 백엔드에서 받아온 정보 중 birthdate를 0번부터 10번 문자까지 자르고
                    // /-/g 정규식을 통해 - 를 없앰
                    formattedBirthdate = result.birthdate.substring(0, 10).replace(/-/g, "");
                }
                reset({
                    username: result.username,
                    password: "",
                    name: result.name,
                    nickname: result.nickname,
                    email: result.email,
                    phoneNumber: result.phoneNumber || "",
                    birthdate: formattedBirthdate,
                    gender: result.gender,
                    role: result.role,
                });
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("유저 정보를 불러오는데 실패했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "유저 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadUser().then(() => {});
    }, [reset, router, userId]);

    const onSubmit = async (data: AdminUpdateUserInputType) => {
        try {
            const { phoneNumber, birthdate, password, ...prevInput } = data;
            let formattedBirthdate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);

                formattedBirthdate = `${year}-${month}-${day}`;
            } else {
                formattedBirthdate = undefined;
            }

            await adminUserApi.updateUser(userId, {
                ...prevInput,
                phoneNumber: phoneNumber || undefined,
                birthdate: formattedBirthdate || undefined,
                password: password || undefined,
            });

            if (Platform.OS === "web") {
                alert("유저가 성공적으로 생성되었습니다.");
                router.back();
            } else {
                Alert.alert("생성 완료", "유저가 성공적으로 생성되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                // 지금 이 error가 axios error이고, response (백엔드에서 한 응답)가 존재한다면
                const errorMessage = error.response.data.message;
                if (error.response.status === 409) {
                    if (errorMessage.includes("아이디")) {
                        setError("username", { message: errorMessage });
                    } else if (errorMessage.includes("이메일")) {
                        setError("email", { message: errorMessage });
                    } else if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
                    return;
                }

                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title title={"유저 정보 수정"} description={"가입된 유저의 정보를 수정합니다."} />

            <ScrollView
                className={twMerge(
                    ["flex-1", "p-6"],
                    ["bg-background-paper", "rounded-xl", "border", "border-divider"],
                )}>
                <View>
                    <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                        계정정보
                    </TextComponent>

                    <Controller
                        control={control}
                        name={"username"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"아이디"}
                                    placeholder={"4자 이상 입력해주세요"}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.username?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"비밀번호"}
                                    placeholder={"6자 이상 입력해주세요"}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    secureTextEntry={true}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"email"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"이메일"}
                                    placeholder={"example@domain.com"}
                                    onBlur={onBlur}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
                                    onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            );
                        }}
                    />

                    <View className={twMerge("border-b", "border-divider", "my-6")} />

                    <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                        개인 정보
                    </TextComponent>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name={"name"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"이름"}
                                        placeholder={"실명 입력"}
                                        onBlur={onBlur}
                                        wrap={true}
                                        onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                        value={value}
                                        errorMessage={errors.name?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"nickname"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"닉네임"}
                                        placeholder={"서비스에서 사용할 닉네임 (2~10자)"}
                                        onBlur={onBlur}
                                        wrap={true}
                                        onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                        value={value}
                                        errorMessage={errors.nickname?.message}
                                    />
                                );
                            }}
                        />
                    </View>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name={"phoneNumber"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"전화번호 (선택)"}
                                        placeholder={"010-0000-000"}
                                        onBlur={onBlur}
                                        wrap={true}
                                        keyboardType={"phone-pad"}
                                        onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                        value={value}
                                        errorMessage={errors.phoneNumber?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"birthdate"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"생년월일 (선택)"}
                                        placeholder={"YYYYMMDD (예: 19951225)"}
                                        onBlur={onBlur}
                                        wrap={true}
                                        keyboardType={"number-pad"}
                                        maxLength={8}
                                        onChangeText={onChange} // HTML onChange 속성 => React-Native onChangeText 속성
                                        value={value}
                                        errorMessage={errors.birthdate?.message}
                                    />
                                );
                            }}
                        />
                    </View>

                    <View className={twMerge("border-b", "border-divider", "my-6")} />

                    <TextComponent className={twMerge("mb-4", ["text-lg", "font-bold"])}>
                        권한 및 성별
                    </TextComponent>

                    <View className={twMerge("flex-col", "md:flex-row", "md:gap-4")}>
                        <Controller
                            control={control}
                            name={"gender"}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    <SelectGroup
                                        options={[
                                            { label: "남성", value: "MALE" },
                                            { label: "여성", value: "FEMALE" },
                                        ]}
                                        label={"성별"}
                                        placeholder={"성별을 선택해주세요"}
                                        value={value}
                                        onSelect={onChange}
                                        errorMessage={errors.gender?.message}
                                        wrap
                                    />
                                );
                            }}
                        />

                        <Controller
                            control={control}
                            name={"role"}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    <SelectGroup
                                        options={[
                                            { label: "관리자 (ADMIN)", value: "ADMIN" },
                                            { label: "사용자 (USER)", value: "USER" },
                                        ]}
                                        label={"권한 설정"}
                                        placeholder={"권한을 설정해주세요"}
                                        value={value}
                                        onSelect={onChange}
                                        errorMessage={errors.role?.message}
                                        wrap
                                    />
                                );
                            }}
                        />
                    </View>

                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("mt-6", "text-center")}>
                            {errors.root.message}
                        </ErrorMessage>
                    )}

                    <View
                        className={twMerge(
                            "mt-10",
                            ["flex-row", "justify-end", "items-center"],
                            "gap-3",
                        )}>
                        <Button
                            variant={"outlined"}
                            color={"secondary"}
                            onPress={() => router.back()}>
                            취소
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}>
                            {isSubmitting ? "수정 중..." : "수정"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminUserUpdatePage;
