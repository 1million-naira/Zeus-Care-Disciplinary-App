import { DimensionValue, KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native"
import CustomText from "./CustomText"
import { COLORS } from "@/src/colors"
import Spacer from "./Spacer"

type Props = {
    label?: string,
    value: string,
    onChangeText?: (text: string) => void,
    placeholder?: string,
    secureTextEntry?: boolean,
    keyboardType?: KeyboardTypeOptions,
    icon?: React.ReactNode,
    multiline?: boolean,
    numberOfLines?: number | undefined,
    style?: StyleProp<ViewStyle>,
    height?: number,
    width? : DimensionValue,
    editable?: boolean,
    size? : 'sm' | 'md',
    showLabel?: boolean,
    autoCapitalise?: "none" | "sentences" | "words" | "characters" | undefined;
}

export default function CustomInput ({label, 
    value,
    onChangeText, 
    placeholder, 
    secureTextEntry = false,
    keyboardType = 'default',
    icon,
    multiline = false,
    numberOfLines,
    style,
    width = '100%',
    height,
    editable = true,
    size = 'md',
    showLabel = true,
    autoCapitalise = undefined,
} : Props){

    const sizes = {
        sm: {fontSize: 12},
        md: {fontSize: 14},
    }
    return (
        <View style={{marginTop: 6}}>
            {label ? <CustomText style={[sizes[size], {fontWeight: 200, paddingHorizontal: 6}]}>{label}</CustomText> : null}
            <View style={[styles.form_group, {width: width}]}>
                {/* <View style={styles.row}>
                    {icon}
                    <CustomText style={[sizes[size]]}>{label}</CustomText>
                </View> */}
                {icon ? <View style={{opacity: 0.4, width: '5%'}}>{icon}</View> : null}
                <View style={styles.row}>
                    {/* {icon} */}
                    <TextInput
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        autoCorrect={false}
                        value={value}
                        onChangeText={(text) => onChangeText?.(text)}
                        keyboardType={keyboardType}
                        style={[styles.input, {height: height}]}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        editable={editable}
                        autoCapitalize={autoCapitalise}
                    />
                </View>
                <Spacer height={16}/>
            </View>
        </View>
    ) 
}


const styles = StyleSheet.create({
    form_group: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 4,
        width: '100%',
        // borderWidth: 1,
        backgroundColor: COLORS.inputBackground,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
    },

    label: {

    },

    input: {
        // backgroundColor: COLORS.inputBackground,
        // borderWidth: 1,
        // borderColor: COLORS.inputBorder,
        // borderRadius: 16,
        // paddingVertical: 12,
        marginLeft: 5,
        width: '95%',
        fontWeight: 300,
        fontSize: 14,
        color: COLORS.text2,
        overflowX: 'hide',
        // borderColor: '#ec8fe2ff',
        // borderWidth: 1,
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    }


})