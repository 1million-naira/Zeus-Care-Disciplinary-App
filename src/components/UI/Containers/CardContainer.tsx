import { COLORS } from "@/src/colors";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";


type Props = {
    children?: React.ReactNode,
    style?: ViewStyle,
    activeOpacity?: number,
    onPress?: () => void,
}

const shadow = {
    shadowOffset: {
    width: 0,
    height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
}

// function Background ({children} : {children: React.ReactNode}){
//     return
export default function CardContainer({children, style, activeOpacity, onPress} : Props) {
    return (
        <TouchableOpacity style={[styles.container, style]} activeOpacity={activeOpacity} onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    container: {
        minHeight: 160,
        // display: 'flex', 
        // flexDirection: 'column', 
        // gap: 1,
        // justifyContent: 'center',
        borderRadius: 12,
        // paddingVertical: 8,
        // paddingHorizontal: 16,
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        backgroundColor: COLORS.favourite,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.05,
        // shadowRadius: 1.41,
        // elevation: 1
    }
})