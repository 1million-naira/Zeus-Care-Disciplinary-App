import { COLORS } from "@/src/colors";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";


type Props = {
    title?: string;
    onPress?: () => void;
    icon? : ReactNode;
    size? : 'lg' | 'md' | 'sm';
    color?: string;
    textColor? : string;
    disabled? : boolean;
    disabledText? : string;
}


const sizeStyles = {
    sm: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        fontSize: 12,
    },
    md: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    lg: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 18,
    }
}


export default function CustomButton({
    title = 'This is a button',
    onPress = () => {},
    icon,
    size = 'md',
    color = COLORS.buttonSecondary,
    textColor = COLORS.buttonText,
    disabled = false,
    disabledText,
}: Props){

    const sizing = sizeStyles[size] || {
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
    };


    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.buttonContainer, {
                    paddingHorizontal: sizing.paddingHorizontal, 
                    paddingVertical: sizing.paddingVertical,
                    backgroundColor: color
                }
            ]}
            onPress={onPress}
        >
            {icon ? 
            (
            <View style={{opacity: 0.7}}>
                {icon}
            </View>
            ) : null
            }

            <CustomText style={[{fontSize: sizing.fontSize, color: textColor}]}>{disabled ? disabledText : title}</CustomText>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: "#999494ff",
        shadowOffset: {
            width: 0.2,
            height: 0.2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        borderRadius: 24,
    }
})