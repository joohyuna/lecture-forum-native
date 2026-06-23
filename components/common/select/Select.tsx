import { BUTTON_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { FlatList, Modal, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export interface SelectOptionType {
    label: string;
    value: string | number; // 선택할 수 있는 옵션의 값
}

interface SelectProps {
    options: SelectOptionType[];
    value?: string | number; // 선택된 값
    onSelect: (value: string | number) => void; // 옵션을 선택할 대 발동될 함수
    placeholder?: string;
    hasError?: boolean;
    size?: StyleSizeType;
    className?: string;
}

function Select({
    options,
    value,
    onSelect,
    placeholder = "선택해주세요",
    hasError,
    size = "medium",
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    // 지금 현재 선택한 value라고 값에 존재한다면
    // 그 value값의 label 을 선택해와야 함
    // ex. 사용자가 "날짜"를 선택했다면 value값은 MALE

    const selectOption = options.find(option => option.value === value);

    return (
        <>
            <Pressable
                className={twMerge(
                    "w-full flex-row justify-between items-center",
                    "rounded-lg border bg-background-default",
                    BUTTON_SIZE_STYLE[size],
                    hasError ? "border-error-main" : "border-divider",
                    className,
                )}
                onPress={() => {
                    console.log("!");
                    setIsOpen(!isOpen);
                }}>
                <TextComponent
                    className={selectOption ? "text-text-default" : "text-secondary-main"}>
                    {selectOption ? selectOption.label : placeholder}
                </TextComponent>
                <Ionicons name={"chevron-down"} size={16} color={"#9CA3AF"} />
            </Pressable>

            {/*
                Model 컴포넌트 (react-native)
                화면에 띄워지는 모달창을 손쉽게 구현할 수 있도록 제공되고 있는 컴포넌트
            */}
            {isOpen && (
                <Modal
                    visible={isOpen} // 모달이 화면에 보여지는 것을 boolean 결정
                    transparent={true} // 이 모달창이 투명인지를 boolean 결정
                    animationType={"fade"} // 이 모달창이 뜨고 사라질 때의 애니메애션 결정
                    onRequestClose={() => setIsOpen(false)}>
                    <Pressable
                        className={"flex-1 justify-center items-center px-5"}
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onPress={() => setIsOpen(false)}>
                        {/*
                            이벤트 버블링 ->
                            화면에 요소가 중첩되어 있을 때  클릭을 하게 되면,
                            위에 있는 녀석 뿐만 아니라 아래에 있는 녀석까지 그 클릭이라는 동작이 전파됨

                            Card를 바로 쓰지 않고 Pressable로 묶어서 이벤트 버블링을 막다줘야 함
                        */}
                        <Pressable
                            className={
                                "w-full max-w-sm bg-background-paper rounded-xl overflow-hidden max-h-{60%}"
                            }
                            //onPress={() => {}}
                            >
                            {/*
                                FlatList 컴포넌트도 div 태그와 매칭 되는 녀석
                                View 컴포넌트도 div 태그와 매칭 되긴 하지만, 스크롤바가 없는 컴포넌트였음
                                ScrollView 컴포넌트가 div 태그과 매칭되는, 스크롤바가 있는 컴포넌트였는데
                                왜 그럼 FlatList 여기서 썼을까?

                                ScrollView : 화면에 보여지지 않는 데이터까지 한꺼번에 렌더링 (계산)
                                            수백개의 데이터가 된다면, 메모리 용량을 너무 많이 차지해서 문제될 수 있음
                                            => 데이터의 갯수가 적고 고정되어 있을 때 사용
                                FlatList : 화면에 보여지는 부분만 자동으로 계산해서 렌더링
                                            => 데이터 갯수가 많거나, 무한 스크롤이 필요할 때
                            */}
                            <FlatList
                                data={options}
                                keyExtractor={item => String(item.value)}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            onSelect(item.value);
                                            setIsOpen(false);
                                        }}
                                        className={twMerge(
                                            "px-5 py-4 border-b border-divider flex-row justify-between",
                                            item.value === value && "bg-primary-main/10",
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-base",
                                                item.value === value
                                                    ? "text-primary-main font-bold"
                                                    : "text-text-default",
                                            )}>
                                            {item.label}
                                        </TextComponent>
                                        {item.value === value && (
                                            <Ionicons
                                                name={"checkmark"}
                                                size={20}
                                                className={"text-primary-main"}
                                            />
                                        )}
                                    </Pressable>
                                )}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

export default Select;
