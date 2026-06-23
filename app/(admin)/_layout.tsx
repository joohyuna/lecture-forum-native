import { Slot } from "expo-router";
import { ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import AdminAsideDesktop from "@/components/layouts/admin/AdminAsideDesktop";
import AdminAsideMobile from "@/components/layouts/admin/AdminAsideMobile";

function AdminLayout() {
    // tailwind을 통해서 "반응형 디자인"을 적용 시키는 것은
    // 작은 화면부너 큰화면으로 적용시킨
    // sm:(648px)   md: (768px)  lg:(1024px)   xl: (1280px) 형태로서 앞에 접두사를 붙임
    // flex-col md:flex-row   => 기본값으로 flex-direction: column이 적용 되지만
    //                          브라우저 크기가 768px 이 넘으로 flex-direction: row로 적용 된다.
    return (
        <View className={twMerge(["flex-1", "flex-col", "md:flex-row"])}>
            {/* hidden -> display: hidden  , flex -> display: flex */}
            {/* 화면이 작을 때 (기본값)은 hidde이 적용될 것이고, 화면에 768px를 넘어가면 flex로 적용 */}
            <View className={twMerge("hidden", "md:flex", "h-full")}>
                <AdminAsideDesktop />
            </View>

            <View className={twMerge("flex", "md:hidden", "w-full", "z-50")}>
                <AdminAsideMobile />
            </View>

            <View className={"flex-1"}>
                <ScrollView
                    className={"flex-1"}
                    contentContainerClassName={"p-4 md:p-8 items-center"}
                    showsVerticalScrollIndicator={false}>
                    <View className={"w-full max-w-5xl"}>
                        <Slot />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AdminLayout;
