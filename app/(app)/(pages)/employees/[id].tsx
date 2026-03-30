import { COLORS } from "@/src/colors";
import CaseList from "@/src/components/UI/CaseList";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomText from "@/src/components/UI/CustomText";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import IncidentList from "@/src/components/UI/IncidentList";
import Spacer from "@/src/components/UI/Spacer";
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers";
import { MemberRole } from "@/src/Types/Types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Employee = {
    id: string
    avatar_url: string | null
    name: string
    role: MemberRole
}

export default function Employee () {
    const {id} = useLocalSearchParams();
    const [employee, setEmployee] = useState<Employee | null>(null);

    const [menu, setMenu] = useState<'personal' | 'incident' | 'cases' | 'notes' | 'metrics'>('metrics')

    async function getEmployeeDetails(){

    }

    useEffect(() => {

    }, [])

    return (
        <MainContainer>
            <View>
                <View style={{display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                    <DefaultProfile size={75} url={employee?.avatar_url ? supabaseGetPublicUrl('avatars', employee.avatar_url) : ''}/>
                    <View>
                        <CustomText type="subheading" numberOfLines={1} style={{fontWeight: 400}}>Name</CustomText>
                        <CustomText numberOfLines={2} style={{fontStyle: 'italic', fontSize: 13}}>{employee?.role || 'Role'}</CustomText>
                    </View>
                </View>
                <Spacer height={16}/>
                <ScrollView horizontal={true} contentContainerStyle={styles.menuBox}>
                    {/* <TouchableOpacity onPress={() => setMenu('personal')} activeOpacity={1}
                    style={[styles.menuButton, menu === 'personal' ? styles.menuButtonSelected : {}]}
                    >
                        <CustomText style={{fontSize: 13}}>Personal Info</CustomText>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => setMenu('metrics')} activeOpacity={1}
                    style={[styles.menuButton, menu === 'metrics' ? styles.menuButtonSelected : {}]}
                    >
                        <CustomText style={{fontSize: 13}}>Metrics</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMenu('incident')} activeOpacity={1}
                    style={[styles.menuButton, menu === 'incident' ? styles.menuButtonSelected : {}]}
                    >
                        <CustomText style={{fontSize: 13}}>Incidents</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMenu('cases')} activeOpacity={1}
                    style={[styles.menuButton, menu === 'cases' ? styles.menuButtonSelected : {}]}
                    >
                        <CustomText style={{fontSize: 13}}>Cases</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMenu('notes')} activeOpacity={1}
                    style={[styles.menuButton, menu === 'notes' ? styles.menuButtonSelected : {}]}
                    >
                        <CustomText style={{fontSize: 13}}>Notes</CustomText>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {
                menu === 'metrics' ? (
                    <ScrollView contentContainerStyle={{flex: 1}}>
                        <Spacer height={36}/>
                        <View>
                            <CardContainer>
                                <CustomText style={{color: COLORS.text3}}>Risk Score</CustomText>
                                <Spacer height={8}/>
                                <View style={{width: '100%', alignItems: 'center'}}>
                                    <AnimatedCircularProgress
                                    size={100}
                                    width={15}
                                    fill={50}
                                    children={() => <CustomText type="caption">50</CustomText>}
                                    tintColor={COLORS.buttonPrimary}
                                    onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor={COLORS.buttonSecondary}
                                    />
                                </View>
                            </CardContainer>
                        </View>
                    </ScrollView>

                ) : null
            }

            {
                menu === 'incident' ? (
                    <IncidentList/>
                ) : null
            }

            {
                menu === 'cases' ? (
                    <CaseList/>
                ) : null
            }

        </MainContainer>
    )
}



const styles = StyleSheet.create({
    menuBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: 24,
        width: '100%',
        borderBottomWidth: 0.4,
        borderBottomColor: COLORS.mono,

        height: '100%',
    },

    menuButton: {
        height: '100%',
        paddingBottom: 12,
    },

    menuButtonSelected: {
        borderBottomWidth: 2,
        borderColor: COLORS.buttonPrimary,
    },

    metric: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
    },
})