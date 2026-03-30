import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomText from "@/src/components/UI/CustomText";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { COLORS } from "@/src/colors";
import { useState } from "react";
import Spacer from "@/src/components/UI/Spacer";

export default function NewCode () {
    const router = useRouter();
    const {code} = useLocalSearchParams();
    const codeString = Array.isArray(code) ? code.join("") : (code ?? "");

    const [codeToCopy, setCodeToCopy] = useState<string>(codeString.trim().length === 0 ? 'Code???' : codeString)

    async function copyToClipboard () {
        await Clipboard.setStringAsync(codeString)
    }


    return (
        <MainContainer>
            <CustomText type='subheading'>Here is your employee invite code</CustomText>
            <Spacer height={12}/>
            <CustomText>You can press the button to copy to your clipboard</CustomText>
            <Spacer height={48}/>
            <View style={{
                display: 'flex', flexDirection: 'row', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
            }}
            >
                <TouchableOpacity onPress={() => {copyToClipboard()}}>
                    <Feather name='copy' size={36} color={COLORS.buttonSecondary}/>
                </TouchableOpacity>

                <CustomText style={styles.text}>{codeToCopy}</CustomText>
            </View>
            <Spacer height={36}/>

            <CustomButton title='Return to home' 
            onPress={() => {router.replace('/(app)/(pages)/home')}}
            color={COLORS.buttonPrimary}
            />
        </MainContainer>
    )
}


const styles = StyleSheet.create({
    text: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontWeight: 300,
        fontSize: 16,
        color: COLORS.text2,
        // borderWidth: 1,
    },
})