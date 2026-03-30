import { COLORS } from "@/src/colors";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = {
    children: React.ReactNode
}
export default function MainContainer({children} : Props) {
    return (
        <SafeAreaView style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.background}}>
            {children}
        </SafeAreaView>
    )
}