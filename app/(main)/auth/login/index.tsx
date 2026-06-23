import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import { useAuthStore } from "@/store/auth/useAuthStore";

function AuthLoginPage() {
    const router = useRouter();
    const {login} = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const onSubmit = async (data: LoginUserInputType) => {
        try {
            const result = await userApi.login(data);

            if (result.user && result.token) {
                login(result.user, result.token);
            }
        } catch (error) {
            console.log(error);
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError("root", { message: errorMessage });
        }
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-default")}>
            <ScrollView
                contentContainerClassName={twMerge("p-5", "justify-center", "items-center")}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}>
                <Card className={twMerge("w-full", "max-w-md", "my-8")}>
                    <TextComponent
                        className={twMerge("mb-6", ["text-2xl", "font-bold", "text-center"])}>
                        로그인
                    </TextComponent>
                    {/*
                        react-hook-form에서 register를 꺼내서 사용하는 방법은 한 방에 처리하는 편의 기능
                        Controller 컴포넌트는 react-hook-form 에서 제공하는 컴포넌트로,
                        폼 필드를 컨트롤할 수 있는 기능을 제공한다.
                        render 속성은 Controller 컴포넌트의 필수 속성으로,
                        폼 필드를 렌더링하는 함수를 지정한다.
                        name 속성은 폼 필드의 이름을 지정한다.
                        control 속성에는 react-hook-form에서 꺼내온 control을 넣어줌
                    */}
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
                                    secureTextEntry={true} // 비밀번호 마스킹 속성
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.password?.message}
                                />
                            );
                        }}
                    />


                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                            {errors.root?.message}
                        </ErrorMessage>
                    )}

                    <Button
                        color={"primary"}
                        variant={"contained"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-4"}
                        disabled={isSubmitting}
                        onPress={handleSubmit(onSubmit)}>
                        로그인
                    </Button>

                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-2"}
                        onPress={() => router.push("/auth/register")}>
                        회원가입 하러 가기
                    </Button>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
