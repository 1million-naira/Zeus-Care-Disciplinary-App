import { Session } from "@supabase/supabase-js";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, LayoutChangeEvent, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, color } from "@rneui/base";

import { supabase } from "@/src/lib/supabase";
import { useSession } from "@/context/SessionProvider";
import { router, useRouter } from "expo-router";
import { Alert } from "react-native";
import Spacer from "@/src/components/UI/Spacer";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import { PURPLE } from "@/src/constants";
import { AntDesign, FontAwesome6, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import ComopanyLogo from "@/src/components/UI/CompanyLogo";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import { COLORS } from "@/src/colors";
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers";
import CustomText from "@/src/components/UI/CustomText";

import {BarChart, ProgressChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import { Layout } from "@react-navigation/elements";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { activities } from "@/src/data";

const screenWidth = Dimensions.get("window").width



type Incident = {
    title: string;
    description: string;
    occured_at: string;
}

type EmployeePreview = {
    name: string,
    avatar_url: string | null,
    role: 'staff' | 'supervisor' | 'admin' | 'manager' | 'viewer',
    public_avatar_url?: string,
}

type IncidentBarChartData = {
    month: string,
    count: number,
    month_num: number,
}


export default function ManagerHome(){

    const {session} = useSession();
    const router = useRouter();
    const {width} = useWindowDimensions();

    const [chartWidth, setChartWidth] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [company, setCompany] = useState("")
    const [fullName, setFullName] = useState("")
    const [avatarUri, setAvatarUri] = useState("")
    const [companyLogo, setCompanyLogo] = useState("")
    const [employeePreviews, setEmployeePreviews] = useState<EmployeePreview[]>([])
    const [openCases, setOpenCases] = useState<number>(0)
    const [openIncidents, setOpenIncidents] = useState<number>(0)
    const [incidentChartData, setIncidentChartData] = useState<IncidentBarChartData[]>([
        {month: 'Jan', count: 1, month_num: 1}, 
        {month: 'Feb', count: 2, month_num: 2}, 
        // {month: 'Mar', count: 9, month_num: 3}, 
        // {month: 'Apr', count: 4, month_num: 4},
        // {month: 'May', count: 10, month_num: 5},
        // {month: 'Jun', count: 21, month_num: 6},
    ])

    const progress_data = {
    labels: ["Risk Score"], // optional
    data: [0.4]
    };

    const [progressChartWidth, setProgressChartWidth] = useState<number>(0);

    useEffect(() => {
        if (session){
            getProfile();
            getCompany();
            getEmployeesPreview(7);
            getInsights();
        }
    }, [session]);


    async function getProfile(){
        try {
            setLoading(true)
            if (!session?.user) throw new Error("No user on the session!")

            const {data, error, status} = await supabase
                .from("profiles")
                .select(`first_name, last_name, is_test, avatar_url`)
                .eq("user_id", session?.user?.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setFullName(data.first_name + " " + data.last_name)

                if (data.avatar_url){
                    setAvatarUri(supabaseGetPublicUrl('avatars', data.avatar_url) + `?t=${Date.now()}`)
                }
            }



        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false)
        }
    }




    async function getCompany() {
        try{
            setLoading(true)
            if (!session?.user || !session.user.user_metadata) throw new Error("No user on the session!");

            const {data, error} = await supabase
                .from("company")
                .select(`name, company_logo_url`)
                .eq("company_id", session.user.user_metadata.company_id)
                .single();


            console.log("Raw query result:", {data, error});


            if(error) throw error;

            if(!data || !data.name){
                throw new Error("Could not retrieve company information")
            }

            setCompany(data.name)

            const {data: download} = await supabase.storage
                .from('company_logos')
                .getPublicUrl(data.company_logo_url)

            setCompanyLogo(download.publicUrl)


            console.log(data)
            
        } catch(error){
            if(error instanceof Error){
                console.log('Error: ', error)
                Alert.alert(error.message)
            }
        } finally{
            setLoading(false)
        }
    }

    async function getEmployeesPreview(limit: number) {
        try{
            setLoading(true)
            const {data, error} = await supabase
                .rpc('get_members_preview_with_limit', {p_company: session?.user.user_metadata.company_id, 
                    p_limit: limit});
            if (error) throw error

            if(data){
                const employees : EmployeePreview[] = data as EmployeePreview[]

                const mapped = await Promise.all(employees.map((e) => {
                    const url = e.avatar_url ? supabaseGetPublicUrl('avatars', e.avatar_url || '') : ''
                    // setEmployeePreviews((prev) => ([...prev, {name: e.name, role: e.role, avatar_url: e.avatar_url, publicUrl: url}]))

                    return {
                        name: e.name,
                        avatar_url: e.avatar_url,
                        role: e.role,
                        public_avatar_url: url 
                    }
                }))
                .then((data) => {
                    setEmployeePreviews(data);
                    console.log('Employees: ', employeePreviews);

                })
                .catch((error) => {throw new Error('Could not fetch employees')})
            }

            
        } catch(error) {
            console.log(error)
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        } finally{
            setLoading(false)
        }

    }


    async function getInsights(){
        try{
            if (!session?.user || !session.user.user_metadata) throw new Error("No user on the session!");
            setLoading(true)

            const {count: openCases, error: caseError} = await supabase
                .from('disciplinary_case')
                .select('*', {count: 'exact', head: true})
                .eq('company_id', session.user.user_metadata.company_id)
                .eq('status', 'open')

            if(caseError) throw caseError

            if(openCases){
                console.log('Open cases: ', openCases)
                setOpenCases(openCases)
            }

            const {count: openIncidents, error: incidentError} = await supabase
                .from('incident')
                .select('*', {count: 'exact', head: true})
                .eq('company_id', session.user.user_metadata.company_id)
                .eq('status', 'reported')

            if(incidentError) throw incidentError

            if(openIncidents){
                console.log('Open incidents: ', openIncidents)
                setOpenIncidents(openIncidents)
            }


            const {data: incidentChart, error: incidentChartError} = await supabase
                .rpc('get_monthly_incident_counts', {p_company: session.user.user_metadata.company_id})

            if(incidentChartError) throw incidentChartError

            if(incidentChart){
                console.log('Incident chart data: ', incidentChart)
                // setIncidentChartData(incidentChart)
            }


        } catch(error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }

        } finally{
            setLoading(false)
        }
    }

    const iconsForActivities = {
        'incident' : <FontAwesome6 name="triangle-exclamation" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>,
        'case' : <FontAwesome6 name="briefcase" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>,
        'note' : <FontAwesome6 name="envelope-open-text" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>,
        'person': <Ionicons name="people-circle" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>
    }

    const activityTypeLabels = {
        'incident' : 'Incident',
        'case' : 'Case',
        'note' : 'Note',
    }

    return (
        <MainContainer>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 90}}
                ListHeaderComponent={
                    <>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'flex-start'}}>
                        <CardContainer style={{width: '47%', padding: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome6 name="briefcase" color={COLORS.buttonSecondary} size={25} style={{opacity: 0.7}}/>
                                </View>
                                <CustomText numberOfLines={1}>Cases</CustomText>
                            </View>

                            <CustomText type='subheading' style={{paddingHorizontal: 4, marginTop: 10, fontWeight: 200}}>Total: 20</CustomText>
                            <CustomText type='caption' style={{paddingHorizontal: 4, marginTop: 10}}>5 new</CustomText>
                        </CardContainer>

                        <CardContainer style={{width: '47%', padding: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center',  gap: 12}}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome6 name="triangle-exclamation" color={COLORS.buttonSecondary} size={25} style={{opacity: 0.7}}/>
                                </View>
                                <CustomText numberOfLines={1}>Incidents</CustomText>
                            </View>

                            <CustomText type='subheading' style={{paddingHorizontal: 4, marginTop: 10, fontWeight: 200}}>Total: 20</CustomText>
                            <CustomText type='caption' style={{paddingHorizontal: 4, marginTop: 10}}>5 new</CustomText>
                        </CardContainer>

                        <CardContainer style={{width: '47%', padding: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center',  gap: 12}}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome6 name="envelope-open-text" color={COLORS.buttonSecondary} size={25} style={{opacity: 0.7}}/>
                                </View>
                                <CustomText numberOfLines={1}>Notes</CustomText>
                            </View>

                            <CustomText type='subheading' style={{paddingHorizontal: 4, marginTop: 10, fontWeight: 200}}>Total: 20</CustomText>
                            <CustomText type='caption' style={{paddingHorizontal: 4, marginTop: 10}}>5 new</CustomText>
                        </CardContainer>

                        <CardContainer style={{width: '47%', padding: 16}} onPress={() => router.push('/(app)/(pages)/employees')}>
                            <View style={{flexDirection: 'row', alignItems: 'center',  gap: 12}}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome6 name="people-group" color={COLORS.buttonSecondary} size={25} style={{opacity: 0.7}}/>
                                </View>
                                <CustomText numberOfLines={1}>Staff</CustomText>
                            </View>
                            {/* <CustomText type='subheading' style={{paddingHorizontal: 4, marginTop: 10, fontWeight: 200}}>Total: 20</CustomText>
                            <CustomText type='caption' style={{paddingHorizontal: 4, marginTop: 10}}>5 new</CustomText> */}
                        </CardContainer>
                    </View>
                    <Spacer height={36}/>
                    <View>
                        <CustomText type='subheading'>Recent events</CustomText>
                        <Spacer height={24}/>
                    </View>
                    </>
                }
                data={activities}
                renderItem={({item}) => (
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 16}}>
                        <View style={styles.iconContainer}>
                            {iconsForActivities[item.type]}
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', gap: 2, width: '60%'}}>
                            <CustomText style={{fontSize: 12, fontWeight: '300'}} numberOfLines={1}>{activityTypeLabels[item.type]} ({item.subject})</CustomText>
                            <CustomText type='caption'>Created by...</CustomText>
                            <CustomText type='caption'>{item.created_at.toDateString()}</CustomText>
                        </View>
                        <CustomText style={{fontSize: 14, fontWeight: '200'}} >{item.created_at.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        }).toUpperCase()}</CustomText>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <Spacer height={24}/>}
            />
        </MainContainer>
    )
}


const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: COLORS.lightPurple, 
        borderRadius: 50, 
        padding: 12, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
})