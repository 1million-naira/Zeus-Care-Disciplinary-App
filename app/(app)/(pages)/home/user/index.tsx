import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomText from "@/src/components/UI/CustomText";
import Spacer from "@/src/components/UI/Spacer";
import { activities } from "@/src/data";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";


export default function StaffHome(){
    const iconsForActivities = {
        'incident' : <FontAwesome6 name="triangle-exclamation" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>,
        'case' : <FontAwesome6 name="briefcase" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>,
        'note' : <FontAwesome6 name="envelope-open-text" color={COLORS.buttonSecondary} size={15} style={{opacity: 0.7}}/>
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