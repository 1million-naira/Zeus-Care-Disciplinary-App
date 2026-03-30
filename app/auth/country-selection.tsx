import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomText from "@/src/components/UI/CustomText";
import Spacer from "@/src/components/UI/Spacer";
import { PURPLE } from "@/src/constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function CountrySelect() {

    const [country, setCountry] = useState<'uk' | 'global' | null>(null)
    const router = useRouter();

    return (
        <MainContainer>
            <CustomText type="heading">Where is your company located?</CustomText>
            <Spacer height={16}/>
            <CustomText>
                We'll tailor your registration based on your country. UK companies can be automatically verified.      
            </CustomText>

            <View style={styles.optionsContainer}>
                <CustomButton size="lg" title="United Kingdom" icon={<CustomText>🇬🇧</CustomText>} color={COLORS.buttonPrimary}
                onPress={() => {setCountry('uk'); router.push('/auth/company-search')}}
                />
                <CustomButton size="lg" title="Other countries" icon={<CustomText>🌍</CustomText>} color={COLORS.buttonPrimary}
                onPress={() => {setCountry('global'); router.push('/auth/company-detials')}}
                />
            </View>

            <Text>
                {country}
            </Text>

        </MainContainer>
    )


}


const styles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        gap: 14,
        marginTop: 60,
        alignItems: 'center',
        width: '100%',
    },
});