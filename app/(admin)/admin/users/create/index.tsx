import TextComponent from "@/components/common/text/TextComponent";
import { useRouter } from "expo-router";
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


function AdminUserCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminCreateUserSchema),
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

    const onSubmit = async (data: AdminCreateUserInputType) => {
        try {
            // phoneNumber에 대해서 처리 => 데이터베이스에서도 varchar
            // birthdate에 대해서 처리 => 우라가 입력 받을 때 YYYYMMDD 받지만
            //                            사용자가 입력한 값이 잇다면 YYYY-MM-DD 형식으로 보내야 함

            const { phoneNumber, birthdate, ...prevInput } = data;
            let formattedBirthdate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);

                formattedBirthdate = `${year}-${month}-${day}`;
            } else {
                formattedBirthdate = undefined;
            }

            await adminUserApi.createUser({
                ...prevInput,
                phoneNumber: phoneNumber || undefined,
                birthdate: formattedBirthdate || undefined,
            });

            if (Platform.OS === "web") {
                alert("유저가 성공적으로 생성되었습니다.");
                router.back();
            } else {
                Alert.alert("생성완료", "유저가 성공적으로 생성되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            // 에러가 났을 때 확인해야 되는거
            // 1. 개발자 도구의 console
            // 2. 네트워크 상의 statusCode
            //    요청이 진행된 주소 확인
            //    백엔드가 뱉어준 응답내용
            // 3. 300번대, 400번재 에러면
            //    프론트엔드에서 잘못된 것이고
            //    500번대 에러면
            //    백엔드에서도 try-catch안에
            //    console.log가 있기 때문에
            //    백엔드 측 웹스톰에서 확인 가능
            console.log(error);

            // axios 에러 + 백엔드가 응답 있음
            // - 409일 때
            // - 그외
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
                // axion 에러가 아니거나, 백엔드 응답이 없고
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className={twMerge("flex-1", "w-full")}>
            <Title title={"유저 생성"} description={"새로운 관리자 또는 일반 유저를 등록합니다."} />

            <ScrollView
                className={twMerge(
                    ["fle-1", "p-6"],
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
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
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
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.password?.message}
                                    secureTextEntry={true}
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
                                    placeholder={"example@admin.com"}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.email?.message}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"}
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
                                        onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
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
                                        onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
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
                                        placeholder={"010-0000-0000"}
                                        onBlur={onBlur}
                                        wrap={true}
                                        keyboardType={"phone-pad"}
                                        onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
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
                                        onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
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
                                        wrap // 아무것도 않쓰면 true
                                    /> // <--- 이 부분에 닫는 태그를 추가했습니다.
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
                                            { label: "관리자(ADMIN)", value: "ADMIN" },
                                            { label: "사용자(USER)", value: "USER" },
                                        ]}
                                        label={"권한 설정"}
                                        placeholder={"권한을 설정해주세요"}
                                        value={value}
                                        onSelect={onChange}
                                        errorMessage={errors.role?.message}
                                        wrap // 아무것도 않쓰면 true
                                    /> // <--- 이 부분에 닫는 태그를 추가했습니다.
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
                        className={twMerge("mt-10", [
                            "flex-row",
                            "justify-end",
                            "items-center",
                        ]
                        , "gap-3")}>
                        <Button variant={"outlined"} color={"secondary"} onPress={() => router.back()}>취소</Button>
                        <Button variant={"contained"} color={"primary"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? "등록 중..." : "등록"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminUserCreatePage;
