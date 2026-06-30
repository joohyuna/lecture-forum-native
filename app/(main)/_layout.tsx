import { useWindowDimensions, View } from "react-native";
import { Slot } from "expo-router";
import MainFooter from "@/components/layouts/main/MainFooter";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import categoryApi from "@/api/user/categoryApi";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";

// 얘네들도 어차피 사용되니까,
// 상위 컴포넌트로 욜려도 됨

// 근데 올린다고 해서 장점이 없음

// 1. 개발자의 입장에서 Props만 많아질 뿐
// 2. zustand는 이 프로젝트 전역에 걸친 메모리에 상주하는 데이터 접근만 하고 있어서 리소스 누수가 크지 않음


function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const[list, setList] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await categoryApi.getCategoryList();
                setList(result);
            } catch (error) {
                console.log(error);
            }
        };
        loadCategories().then(() => {});
    }, []);

    return (
        <View className={"flex-1"}>
            {isMobile ? <MainHeaderMobile list={list} /> : <MainHeaderDesktop list={list} />}
            <View className={"flex-1"}>
                <Slot />
            </View>

            <MainFooter />
        </View>
    );
}

export default MainLayout;
