import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
import { twMerge } from "tailwind-merge";
import Card from "@/components/common/card/Card";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import Button from "@/components/common/button/Button";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";

function AuthRegisterPage() {
    // React에서는 useNative() 준비를 해뒀었는데 React-Native에서는 useRouter()
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;
            const payload = {
                ...submitData,
                phoneNumber: data.phoneNumber === "" ? undefined : data.phoneNumber,
                birthdate: data.birthdate === "" ? undefined : data.birthdate,
            };

            await userApi.registerUser(payload);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해 주세요");
                router.push("/auth/login");
            } else {
                // 모바일 환경일 때에는 Alert.alert(제목, 내용, 버튼설정Array)으로 경고창 출력
                Alert.alert("가입완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
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

    // PC 에서는 문제가 아닌데, 모바일에서는 키보드가 화면을 침범하게 됨
    // 키보드가 화면 하단에 올라오면 화면이 줄어들도록 적용해줘야 되는데 : KeyboardAvoidingView
    // behavior 속성에 "지금 현재 플랫폼에 따라서 동작 방식을 달리 적용" 해줘야 함
    // ios (아이폰)일 때는 padding을 통해 하단에 키보드가 올라갈 공간을 마련해 주는 것
    // aos (안드로이드)일 때는 height를 통해 화면이 줄어들도록 적용해 주는 것

    // ScrollView 컴포넌트 : 화면이 넘어 갈 만큼 넓거나, 길면 스크롤바을 만들어주는 녀석
    // 모바일 앱은 ScrollView로 감싸주지 않으면 스크롤바가 안 나옴, 그래서 ScrollView로 감싸주어야 함
    // 심지어 이 ScrollView는 패딩 영역을 주려면 className으로 주지 않고
    // contentContainerClassName 이라는 속성으로 부여해야 함
    // showVerticalScrollIndicator 속성 : 스크롤바를 보여줄지 여부를 결정하는 속성
    // keywordShouldPersistTaps 속성 : 터치 이벤트가 자식 컴포넌트로 전파되는지 여부를 결정하는 속성
    //                                 handled 값을 주지 않으면 키보드가 열려있는 상태에서 터치 시 키보드만 닫힘

    // 모바일에서는 form과 같은 역활을 해주는 게 없음
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={twMerge("flex-1", "bg-background-default")}>
            <ScrollView
                contentContainerClassName={twMerge("p-5", "justify-center", "items-center")}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}>
                <Card className={twMerge("w-full", "max-w-md", "my-8")}>
                    <Text className={twMerge("mb-6", ["text-2xl", "font-bold", "text-center"])}>
                        회원가입
                    </Text>
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

                    <Controller
                        control={control}
                        name={"confirmPassword"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"비밀번호 확인"}
                                    placeholder={"비밀번호를 다시 입력해주세요"}
                                    secureTextEntry={true} // 비밀번호 마스킹 속성
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.confirmPassword?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"name"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"이름"}
                                    placeholder={"이름을 입력해주세요"}
                                    onBlur={onBlur}
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
                                    placeholder={"2자 이상 10자 이내 닉네임을 입력해주세요"}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.nickname?.message}
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
                                    placeholder={"이메일을 입력해주세요"}
                                    keyboardType={"email-address"}
                                    autoCapitalize={"none"} /* 첫글자를 자동 대문자 전환 */
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.email?.message}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"phoneNumber"}
                        render={({ field: { onChange, onBlur, value } }) => {
                            return (
                                <InputGroup
                                    label={"전화번호"}
                                    placeholder={"전화번호를 입력해주세요"}
                                    keyboardType={"phone-pad"}
                                    onBlur={onBlur}
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
                                    label={"생년월일"}
                                    placeholder={"YYYYMMDD"}
                                    keyboardType={"phone-pad"}
                                    maxLength={8}
                                    onBlur={onBlur}
                                    onChangeText={onChange} // HTML onChange 속성 =>  React-Native onChangeText 속성
                                    value={value}
                                    errorMessage={errors.birthdate?.message}
                                />
                            );
                        }}
                    />

                    {/* 성별 입력 Select는 내일 합시다 */}

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
                        회원가입
                    </Button>

                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        size={"large"}
                        fullWidth={true}
                        className={"mt-2"}
                        onPress={() => router.push("/auth/login")}>
                        로그인하러 가기
                    </Button>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;