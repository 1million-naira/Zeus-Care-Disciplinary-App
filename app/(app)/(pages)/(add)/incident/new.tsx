import { useSession } from "@/context/SessionProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DateTimeInputNative from "@/src/components/UI/DateTimeInputNative";
import Spacer from "@/src/components/UI/Spacer";
import { supabase } from "@/src/lib/supabase";
import { OptionItem, ReportableUser } from "@/src/Types/Types";
import useIncidentDetails from "@/src/zustand/useIncidentDetails";
import { EvilIcons, FontAwesome, FontAwesome6, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native";


export default function Incidents() {

    const {session, ready, permission} = useSession();

    const {setIncTitle, setIncDescription, setDate, incTitle, incDescription, date} = useIncidentDetails();

    console.log("User Permission in Add Incident: ", permission);

    const company_id = session?.user?.user_metadata?.company_id as string | undefined
    const created_by = session?.user?.id as string | undefined;

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [searchedUsers, setSearchedUsers] = useState<ReportableUser[]>([]);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const formattedUsers = useMemo<OptionItem[]>(
        () => (searchedUsers || []).filter(Boolean).map((user) => {
            return {
                value: user.user_id,
                label: user.name
            }
        }),
        [searchedUsers]
    )

    const [title, setTitle] = useState<string>(incTitle || "")
    const [description, setDescription] = useState<string>(incDescription || "")
    const [occured, setOccuredAt] = useState<Date | null>(date || null);


    const [loading, setLoading] = useState(false);




    const updateIncidentTiming = (date: Date) => {
        setOccuredAt(date);
        // console.log("Selected Date: ", date);
    }





    const saveIncidentInfo = () => {
        setIncTitle(title);
        setIncDescription(description);
        if(occured){
            setDate(occured);
        }
    }


    const validate = () => {
        if(title.trim().length === 0){
            Alert.alert("Please provide a title for the incident.")
            return;
        }

        if(description.trim().length === 0){
            Alert.alert("Please provide a description for the incident.")
            return;
        }

        if(occured === null){
            Alert.alert("Please provide the time the incident occurred.")
            return;
        }

        saveIncidentInfo();
        router.replace("/(app)/(pages)/(add)/incident/users");
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
                        <CustomText type='caption'>
                            Fill the form below to report a new incident. Keep descriptions clear and
                            concise.
                        </CustomText>
                    </View>


                    <CustomInput label="Incident Title" 
                    placeholder="Provide a title for the incident" value={title} 
                    onChangeText={(text: string) => setTitle(text)} secureTextEntry={false}
                    numberOfLines={1}
                    />

                

                    <View style={styles.dateWrapper}>
                        <DateTimeInputNative
                            minimumDate={new Date()}
                            onChange={updateIncidentTiming}
                            label="What time did the incident occurr?"
                        />
                    </View>
                    

                    <CustomInput value={description} 
                    label="Description"
                    onChangeText={(text:string) => setDescription(text)}
                    placeholder="Describe the details of the incident"
                    secureTextEntry={false}
                    multiline={true}
                    numberOfLines={8}
                    height={120}
                    />


                    <Spacer height={16}/>
                    <CustomButton
                        title="Next"
                        // disabled={loading}
                        onPress={() => {validate();}}
                        color={COLORS.buttonSecondary}
                        textColor={COLORS.buttonText}
                    />

                </ScrollView>

            </KeyboardAvoidingView>
        </MainContainer>
    )
}


const styles = StyleSheet.create({

    keyboard: { flex: 1 },

    header: {
        marginBottom: 18,
    },
    subtitle: {
        fontSize: 13,
        color: "rgba(122, 122, 115, 1)",
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