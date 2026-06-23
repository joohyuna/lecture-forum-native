import { TextInput, TextInputProps } from "react-native";
import { BUTTON_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

// 웹(CSS)에서는 placeholder에 대하 스타일을 CSS에 저장해줬는데
// React-Native에서는 placeholder에 대한 스타일링을 "별도의 ClassName"으로 지정해줘야 함
function Input({
    hasError,
    size = "medium",
    className,
    placeholderClassName,
    ...props
}: InputProps) {
    return (
        <TextInput
            className={twMerge(
                "w-full bg-background-default rounded-lg border text-text-default",
                BUTTON_SIZE_STYLE[size],
                hasError ? "border-error-main" : "border-divider focus:border-primary-main",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default Input;

// HTML에서 placeholder(남김말) 에 스타일링을 하는 방법
// React-Native에서 placeholder는 별개의 속성을 통해 스타일링을 부여해야함