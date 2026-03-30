import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DateTimeInputNative from "@/src/components/UI/DateTimeInputNative";
import Spacer from "@/src/components/UI/Spacer";
import { PURPLE } from "@/src/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Input } from "@rneui/base";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Notes() {
    
    const {session, ready} = useSession()

    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);

    const [subjectId, setSubjectId] = useState<string>('')

    const [summary, setSummary] = useState<string>('')

    const [followUpDue, setFollowUpDue] = useState<Date | null>(null);



    const created_by = session?.user?.id as string | undefined;
    const companyId = session?.user?.user_metadata?.company_id as string | undefined


    async function handleSubmit() {

    }



    return (
        <MainContainer>
            <KeyboardAvoidingView style={styles.keyboard}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="never"
                >
                    <View style={styles.header}>
                        {/* <Text style={styles.title}>Add a Note</Text> */}
                        <CustomText type='caption'>
                            Fill the form below to report a new conduct note. Keep descriptions clear and
                            concise.
                        </CustomText>
                    </View>

                    <CustomInput
                        label="Summary"
                        value={summary}
                        onChangeText={(text) => setSummary(text)}
                        placeholder="Summarise the note"
                        secureTextEntry={false}
                        multiline={true}
                        numberOfLines={8}
                        height={120}
                    />
                    <Spacer height={24}/>

                    <CustomText>Who is the note for?</CustomText>
                    <Spacer height={8}/>
                    <CustomButton title="Select a member" color={COLORS.buttonSecondary} 
                    textColor={COLORS.buttonText}/>

                    <Spacer height={24}/>
                    <View style={styles.dateWrapper}>
                        <DateTimeInputNative
                            minimumDate={new Date()}
                            onChange={() => {}}
                            label="When should the subject respond by?"
                        />
                    </View>
                    <Spacer height={36}/>
                    <CustomButton
                        title="Create note"
                        color={COLORS.buttonPrimary}
                        onPress={() => handleSubmit()}
                        size="lg"
                    />

                </ScrollView>

            </KeyboardAvoidingView>
        </MainContainer>
    )
}



const styles = StyleSheet.create({

    keyboard: { flex: 1 },
    container: { 
        backgroundColor: "#FFFFFF" 
    },

    header: {
        marginBottom: 18,
    },

    subtitle: {
        fontSize: 13,
        color: "#666",
    },

    dateWrapper: {
        borderRadius: 30,
        padding: 8,
        backgroundColor: COLORS.background,
        borderWidth: 0,
        borderColor: '#e3ddddff',
        marginTop: 4,
    },
});
