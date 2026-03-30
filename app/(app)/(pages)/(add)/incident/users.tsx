import { useSession } from "@/context/SessionProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import Dropdown from "@/src/components/UI/Dropdown";
import ListDisplay from "@/src/components/UI/ListDisplay";
import Spacer from "@/src/components/UI/Spacer";
import { INCIDENT_OUTCOME_OPTIONS, SuggestedIncidentOutcome } from "@/src/constants";
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers";
import { supabase } from "@/src/lib/supabase";
import { OptionItem, ReportableUser } from "@/src/Types/Types";
import useIncidentDetails from "@/src/zustand/useIncidentDetails";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function AddUsers() {

    const {session, ready, permission} = useSession();

    const {incTitle, incDescription, date, reset} = useIncidentDetails();

    const router = useRouter();

    type IncidentUser = {
        // incident_id? : string;
        subject_id : string;
        role?: 'subject' | 'witness' | 'reported' | 'other'
        name?: string
        suggested_outcome?: SuggestedIncidentOutcome
        avatar_url? : string | null
    };

    const [searchedUsers, setSearchedUsers] = useState<ReportableUser[]>([]);

    const formattedUsers = useMemo<OptionItem[]>(
        () => (searchedUsers || []).filter(Boolean).map((user) => {
            return {
                value: user.user_id,
                label: user.name
            }
        }),
        [searchedUsers]
    );

    const [incidentUsers, setIncidentUsers] = useState<IncidentUser[]>([]);

    const [searchText, setSearchText] = useState<string>("");

    const [expanded, setExpanded] = useState(false);

    const debouncedSearch = useDebouncedValue(searchText, 500)

    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);


    //Create a list from dropdown selections.
    const addIncidentUser =  (item : OptionItem) => {
        setIncidentUsers(prev => {
            if(prev.some(u => u.subject_id === item.value)) return prev
            return [...prev, {subject_id: item.value, name: item.label}]
        }
        )
    }

    const updateUserRole = (id: string, role: 'subject' | 'witness' | 'reported' | 'other') => {
        setIncidentUsers(prev => prev.map(u => (u.subject_id === id) ? {...u, role:role} : u))
    }

    const updateUserOutcome = (id: string, outcome: SuggestedIncidentOutcome) => {
        setIncidentUsers(prev => prev.map(u => (u.subject_id === id) ? {...u, suggested_outcome:outcome} : u))
    }


    const removeIncidentUser = (user : IncidentUser) => {
        setIncidentUsers(prev => prev.filter(u => u.subject_id !== user.subject_id))
    }


    async function getSearchedUsers(text : string){
        try{
            setLoading(true)
            setSearchLoading(true)

            if(!session?.user) throw new Error("No user on the session!");
            const {data, error} = await supabase
                .rpc('get_reportable_users', {p_company_id : session.user.user_metadata.company_id, p_text : text});


            if (error){
                throw error;
            }

            if (data){
                setSearchedUsers(data)
                console.log('Actual Users', data)
            }

        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                Alert.alert(error.message);
            }

        } finally {
            setLoading(false);
            setSearchLoading(false)

        }
    }

    useEffect(() => {
        const search = debouncedSearch?.trim() ?? '';
        
        if (search.length === 0) {
            setSearchedUsers([]);
            return;
        }
        getSearchedUsers(debouncedSearch)
        
    }, [debouncedSearch])


    useEffect(() => {
        let expanded = searchText.trim().length > 0 && formattedUsers.length > 0;
        setExpanded(expanded);
        console.log('Formatted Users', formattedUsers)
    }, [formattedUsers, searchText])


    const validate = () => {
        console.log('Validate')
        if(incidentUsers.length === 0){
            Alert.alert("Please add at least one user involved in the incident.");
            return;
        }

        for (let user of incidentUsers){
            if(!user.role){
                Alert.alert(`Please select a role for ${user.name}`)
                return;
            }

            if(!user.suggested_outcome){
                Alert.alert(`Please select a suggested outcome for ${user.name}`)
                return;
            }
        }

        //Create the incident
        console.log('Incident submitted')

        reset();
        router.replace("/(app)/(pages)/(add)/incident/new");
    }




    return (
        <MainContainer>
            <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="never"
                >
                    <CustomText style={{textAlign: 'center', fontWeight: 100}} type='subheading'>Incident details</CustomText>
                    <CardContainer style={{backgroundColor: 'transparent', paddingVertical: 6, marginTop: 8}}>
                        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, paddingHorizontal: 12, paddingVertical: 6}}>
                            <CustomText style={{fontWeight: 200}}>Incident title</CustomText>
                            <CustomText style={{fontWeight: 300, fontStyle: 'italic'}} numberOfLines={1}>{incTitle}</CustomText> 
                        </View>
                        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, paddingHorizontal: 12, paddingVertical: 6}}>
                            <CustomText style={{fontWeight: 200}}>What happened?</CustomText>
                            <CustomText style={{fontWeight: 300, fontStyle: 'italic'}} type="body" numberOfLines={1} >{incDescription}</CustomText> 
                        </View>

                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6}}>
                            <CustomText style={{fontWeight: 200}}>Occurred at</CustomText>
                            <CustomText style={{fontWeight: 300}} type="caption">{date?.toLocaleString()}</CustomText>
                        </View>

                        <View style={{marginTop: 8, padding: 12}}>
                            <CustomButton
                                title="Edit Incident Details"
                                onPress={() => router.replace("/(app)/(pages)/(add)/incident/new")}
                                color={COLORS.buttonSecondary}
                                size="sm"
                            />
                        </View>
                    </CardContainer>




                    <Spacer height={24}/>
                    <CustomInput label="Search and add the members of your company involved"
                    size="sm"
                    placeholder="Search by name" value={searchText} 
                    onChangeText={(text: string) => setSearchText(text)} secureTextEntry={false}
                    icon={<EvilIcons name="search" size={18}/>}
                    />

                    <Spacer height={4}/>
                    {
                    expanded ? (
                        <View style={{}}>
                            {
                            searchLoading ? (
                                // <CustomText type="caption">Loading...</CustomText>
                                <ActivityIndicator/>
                            ) : <ListDisplay data={formattedUsers} expanded={expanded} changeExpanded={setExpanded} onChange={(item : OptionItem) => {addIncidentUser(item)}}/>
                            }
                        </View>
                    ) : null
                    }

                    <Spacer height={24}/>
                    <CustomText type="subheading">Who is involved?</CustomText>
                
                    <FlatList
                        data={incidentUsers}
                        renderItem={({item}) => (
                            <CardContainer style={{backgroundColor: 'transparent'}}>
                                <View style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}>
                                    <DefaultProfile url={item.avatar_url ? supabaseGetPublicUrl(item.avatar_url, 'avatars') : ''}
                                    size={50}
                                    />
                                    <CustomText type="caption" style={{fontWeight: 300}}>{item.name}</CustomText>

                                </View>
                                <View style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    gap: 4,
                                    
                                }}>
                                    <Dropdown
                                        data={[
                                            {value: 'subject', label: 'Subject'}, 
                                            {value: 'witness', label: 'Witness'}, 
                                            {value: 'other', label: 'Other'}
                                        ]}
                                        onChange={(value : string) => updateUserRole(item.subject_id, value as 'subject' | 'witness' | 'reported' | 'other')}
                                        placeholder="Select Role"
                                    />
                                    {
                                    permission === 'admin' 
                                    || permission === 'manager'
                                    || permission === 'supervisor' ?

                                    (
                                        <Dropdown data={INCIDENT_OUTCOME_OPTIONS} 
                                        onChange={(value : string) => updateUserOutcome(item.subject_id, value as SuggestedIncidentOutcome)} 
                                        placeholder="Suggested outcome"/>
                                    ) 
                                    
                                    : null
                                    }
                                </View>
                                <TouchableOpacity onPress={() => removeIncidentUser(item)} style={{alignItems: 'center', paddingVertical: 4, marginTop: 12, borderColor: COLORS.inputBackground, borderRadius: 12, borderWidth: 1}}>
                                    {/* <FontAwesome name='trash' size={16} color='#686363ff'/> */}
                                    <CustomText type="button" 
                                    style={{
                                        // color: '#d45353ff'
                                    }}>
                                        DELETE
                                    </CustomText>
                                </TouchableOpacity>
                            </CardContainer>
                        )}
                        keyExtractor={item => item.subject_id}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{borderColor: '#e9e4e4ff', borderBottomWidth: 1, width: '100%',}}></View>}
                    />
                    
                    <Spacer height={24}/>
                    <CustomButton
                        title="Report Incident"
                        disabled={loading}
                        onPress={() => {validate(); console.log('Route back')}}
                        color={COLORS.buttonSecondary}
                        textColor={COLORS.buttonText}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </MainContainer>
    )
}