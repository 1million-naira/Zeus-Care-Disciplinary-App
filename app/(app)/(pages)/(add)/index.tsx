import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomText from "@/src/components/UI/CustomText";
import Spacer from "@/src/components/UI/Spacer";
import { PURPLE } from "@/src/constants";
import { FontAwesome, FontAwesome6, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function add() {
    const router = useRouter();
    const {permission} = useSession();
 
    return (
        <MainContainer>

            <View style={styles.options}>
                
                <CustomText type="subheading" style={{fontSize: 22, textAlign: 'center', paddingVertical: 12, fontStyle: 'italic'}}>What would you like to add?</CustomText>
                <CustomButton
                    title="Report an incident"
                    size="lg"
                    icon={<FontAwesome6 name="triangle-exclamation" size={18} color={COLORS.buttonText} />}
                    onPress={() => router.push('/(app)/(pages)/(add)/incident/new')}
                    color={COLORS.buttonSecondary}
                />

                <CustomButton
                    title="Add a note"
                    size="lg"
                    icon={<FontAwesome6 name="envelope-open-text" size={18} color={COLORS.buttonText}/>}
                    onPress={() => router.push("/(app)/(pages)/(add)/note/new")}
                    color={COLORS.buttonSecondary}
                />


                <Spacer height={24}/>
                {
                    permission === 'admin' || permission === 'manager' || permission === 'supervisor'  ?
                    (
                        <>
                        <CustomButton
                            title="Create a case"
                            size="lg"
                            icon={<FontAwesome6 name="briefcase" size={18} color={COLORS.buttonText} />}
                            onPress={() => router.push("/(app)/(pages)/(add)/case/new")}
                            color={COLORS.buttonSecondary}
                        />
                        <CustomButton 
                            title="Invite a member"
                            size="lg"
                            icon={<Ionicons name="person-add-sharp" size={18} color={COLORS.buttonText} />}
                            onPress={() => {router.push("/(app)/(pages)/(add)/employees/new")}}
                            color={COLORS.buttonSecondary}
                        />
                        </>
                    ) :
                    null
                }
            </View>
          
        </MainContainer>
    )
}


const styles = StyleSheet.create({
    options: {
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
        gap: 12,
        // borderWidth: 1
    },
})