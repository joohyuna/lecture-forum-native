import { ReactNode, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
    trigger: ReactNode; // 화면에 출력되는 버튼역할 컴포넌트가 들어가는 props

    //children에 컴포넌트를 그냥 집어 넣을 수도 있고
    // close: () => {} 라는 매개변수 함수를 받아서 컴포넌트를 리턴하는 것을 넣을 수도 있다
    children: ReactNode | ((close: () => void) => ReactNode);
    className?: string;
    dropdownClassName?: string;
}

function Dropdown({ trigger, children, className, dropdownClassName }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    return (
        <View className={twMerge("relative", "z-50", className)}>
            <Pressable onPress={() => setIsOpen(!isOpen)}>{trigger}</Pressable>
            {isOpen && (
                <>
                    {/* 백드롭 */}
                    <Pressable
                        onPress={close}
                        className={"z-40"}
                        style={
                            Platform.OS === "web"
                                ? {
                                      // 웹에서는 화면 전체를 감싸기 위에서
                                      // fixed를 하고 각 네 귀퉁이를 잡아주면 됨
                                      position: "fixed",
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                  }
                                : {
                                      // 앱에서는 fixed가 없어서
                                      position: "absolute",
                                      top: -1000,
                                      left: -1000,
                                      width: 3000,
                                      height: 3000,
                                  }
                        }
                    />
                    <View
                        className={twMerge(
                            // top, left, right, bottom은 부모기준
                            // translate는 내가 기준
                            //  "left-1/2", "-translate-x-1/2" // 중앙 기준
                            ["absolute", "top-full", "left-0"],
                            ["mt-2", "z-50", "min-w-[150px]", "shadow-md"],
                            ["bg-background-paper", "border", "border-divider", "rounded-lg"],
                            dropdownClassName,
                        )}>
                        {typeof children === "function" ? children(close) : children}
                    </View>
                </>
            )}
        </View>
    );
}

export default Dropdown;
