import { Platform, TextInput, TextInputProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function Textarea({
    hasError,
    className,
    size = "medium",
    placeholderClassName,
    ...props
}: TextareaProps) {
    const getTextSizeClasses = () => {
        switch (size) {
            case "small":
                return "text-xs";
            case "medium":
                return "text-sm";
            case "large":
                return "text-base";
        }
    };
    return (
        <TextInput
            multiline={true}
            textAlignVertical={"top"} // 안드로이드에서 TextInput에 입력하는 택스트는 y축 중앙에 정렬됨 그래서 top으로 수정
            className={twMerge(
                ["w-full", "p-4", "min-h-32"],
                ["bg-background-default", "rounded-lg", "border", "text-text-default"],
                getTextSizeClasses(),
                hasError ? "border-error-default" : "border-divider focus:border-primary-main",
                Platform.OS === "web" && "outline-none",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default Textarea;
