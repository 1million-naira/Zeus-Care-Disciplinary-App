import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DateTimeInputNative from "@/src/components/UI/DateTimeInputNative";
import Dropdown from "@/src/components/UI/ListDisplay";
import Spacer from "@/src/components/UI/Spacer";
import { PURPLE } from "@/src/constants";
import { supabase } from "@/src/lib/supabase";
import { OptionItem, ReportableUser } from "@/src/Types/Types";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "@rneui/base";
import { Button, Input } from "@rneui/themed";
import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";




export default function Cases() {

    const {session, ready} = useSession();

    if (!ready) {
        return null;
    }

    // const [status, setStatus] = useState<"open"
    // | "closed" | "hearing_scheduled" 
    // | "hearing-done">("open");

    const [reportableUsers, setReportableUsers] = useState<ReportableUser[]>([]);
    const [reason, setReason] = useState<string>("");
    const [desciption, setDescription] = useState<string>("");
    const [subject_id, setSubjectId] = useState<string>("");
    const [hearing_datetime, setHearingDateTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState<string| null>(null);

    const created_by = session?.user?.id as string | undefined;
    const company_id = session?.user?.user_metadata?.company_id as string | undefined;
    // console.log("companyId", company_id);

    const updateHearingDateTime = (date: Date) => {
        setHearingDateTime(date);
        // console.log("Selected Date: ", date);
    }

    const updateSubjectId = (userId : string) => {
        setSubjectId(userId)
        console.log("Selected User ID: ", userId);
    }


    const formattedUsers = useMemo<OptionItem[]>(
        () => (reportableUsers || []).filter(Boolean).map((user) => {
            return {
                value: user.user_id,
                label: user.name
            }
        }),
        [reportableUsers]
    )

    


    useEffect(() => {
        if (session && company_id) {
            getReportableUsers();
        }
    }, [session]);


    async function getReportableUsers() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error("No user on the session!")
            const {data, error} = await supabase    
                .rpc('get_reportable_users', {p_company_id: company_id})
            
            if (error) {
                throw error;
            }

            if(data){
                // console.log(data);
                setReportableUsers(data);
            }

        } catch (error) {
            console.log('Error!', error);
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false)
        }
    }


    async function handleSubmit() {

    }


    return (
        // <View>
        //     {/* <Text style={{color: 'orange'}}>If you can not find a user to report, please try to make the description as precise as possible.</Text> */}
        //     <View>
        //         <Text>Case Title</Text>
        //         <Input
        //             leftIcon={{type: 'font-awesome', name: 'exclamation-circle'}}
        //             onChangeText={(text) => setReason(text)}
        //             value={reason}
        //             placeholder='Enter the title/reason for the case'
        //         />
        //     </View>

        //     <View>
        //         <Text>Select the Reported User</Text>
        //         <Dropdown data={formattedUsers} onChange={updateSubjectId} placeholder="Select a member of your company to report"/>
        //     </View>

        //     <View>
        //         <Text>Date And Time for a hearing</Text>
        //         <DateTimeInputNative minimumDate={new Date()} onChange={updateHearingDateTime}/>
        //     </View>

        //     <View>
        //         <Button title="Create Case" disabled={loading} onPress={() => handleSubmit()}/>
        //     </View>


        // </View>
        <MainContainer>
            <KeyboardAvoidingView style={styles.keyboard}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="never"
                >
                    <View style={styles.header}>
                        <CustomText type='caption'>
                            Fill the form below to create a new case. Keep descriptions clear and
                            concise.
                        </CustomText>
                    </View>


                    <CustomInput 
                        label="Case Title"
                        placeholder="Enter the title/reason for the case"
                        icon={<FontAwesome name="exclamation-circle" size={16} color={COLORS.mono}/>}
                        value={reason}
                        onChangeText={(text) => setReason(text)}
                        secureTextEntry={false}
                        width={'90%'}
                        numberOfLines={1}
                    />

                    <Spacer height={24}/>

                    <CustomText>Who is the subject of the case?</CustomText>
                    <Spacer height={8}/>
                    <CustomButton title="Select a member" color={COLORS.buttonSecondary} 
                    textColor={COLORS.buttonText}/>

                    <Spacer height={16}/>

                    <View style={styles.dateWrapper}>
                        <DateTimeInputNative
                            minimumDate={new Date()}
                            onChange={updateHearingDateTime}
                            label="Date And Time for a hearing"
                        />
                    </View>   

                    <Spacer height={16}/>


                    <CustomInput
                        label="Description (optional)"
                        value={desciption}
                        onChangeText={(text) => setDescription(text)}
                        placeholder="Add more details that will help the review"
                        secureTextEntry={false}
                        multiline={true}
                        numberOfLines={8}
                        height={120}
                    />

                    <Spacer height={36}/>
                    <CustomButton
                        title="Create case"
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



