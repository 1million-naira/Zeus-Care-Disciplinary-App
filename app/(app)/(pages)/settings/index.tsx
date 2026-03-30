import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomText from "@/src/components/UI/CustomText";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import Spacer from "@/src/components/UI/Spacer";
import { supabase } from "@/src/lib/supabase";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {

    const router = useRouter();

    const {session, ready} = useSession();
    const [loading, setLoading] = useState<boolean>(false)
    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [name, setName] = useState<string>('')

    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
    const toggleNotifications = () => {setNotificationsEnabled(!notificationsEnabled)}

    useEffect(() => {
        if(session){
            getInfo()
        }
    }, [])

    async function signOut(){
        const {error} = await supabase.auth.signOut()
        if (error) {
            Alert.alert(error.message);
        }        
        router.replace("/auth")
    }

    async function getInfo(){
        try{
            setLoading(true)
            if(!session?.user) throw new Error("No user on session!")


        } catch(error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }

        } finally{
            setLoading(false)
        }
    }
    return (
        <MainContainer>
            <View style={{alignItems: 'center'}}>
                <DefaultProfile url={avatarUrl}/>
            </View>

            <View style={{marginTop: 12}}>
                <CustomText type='subheading'>Account</CustomText>
                <CardContainer style={styles.settings_box} activeOpacity={0.6} onPress={() => {console.log('Settings click'); router.push('/(app)/(pages)/settings/profile')}}>
                    <CustomText>Edit profile</CustomText>
                    <View style={{position: 'absolute', left: '100%',}}>
                        <FontAwesome6 name='angle-right' size={15} color={COLORS.buttonPrimary}/>
                    </View>
                </CardContainer>

                <CardContainer style={styles.settings_box} activeOpacity={0.6} onPress={() => {console.log('Settings click')}}>
                    <CustomText>Change password</CustomText>
                    <View style={{position: 'absolute', left: '100%',}}>
                        <FontAwesome6 name='angle-right' size={15} color={COLORS.buttonPrimary}/>
                    </View>
                </CardContainer>

                <CardContainer style={styles.settings_box} activeOpacity={1} onPress={() => {console.log('Settings click')}}>
                    <CustomText>Enable notifications</CustomText>
            
                    <Switch trackColor={{false: COLORS.inputBackground, true: COLORS.buttonSecondary}}
                        onChange={() => {console.log('Switch changed')}}
                        onValueChange={toggleNotifications}
                        value={notificationsEnabled}
                        style={{position: 'absolute', left: '85%', transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    />
                </CardContainer>
            </View>

            <View style={{marginTop: 12}}>
                <CustomText type='subheading'>Application</CustomText>
                <CardContainer style={styles.settings_box} activeOpacity={0.6} onPress={() => signOut()}>
                    <CustomText>Sign out</CustomText>
                    <View style={{position: 'absolute', left: '100%',}}>
                        <FontAwesome6 name='angle-right' size={15} color={COLORS.buttonPrimary}/>
                    </View>
                </CardContainer>

            </View>



            {/* <Spacer height={20}/>
            <TouchableOpacity style={styles.button} activeOpacity={0.7}
                onPress={() => signOut()}
            >
                <AntDesign name="logout" size={24} color='#8f7898ff'/>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>   */}
        </MainContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
    },

    info: {
        display: 'flex',
        flexDirection: 'row',
    },

    heading: {
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        // marginLeft: 0,
        // borderBottomWidth: 1,
        // borderColor: '#c8c3c3ff',
        // paddingVertical: 5,
        // paddingHorizontal: 8,
        color: "#6f6a6aff"
    },

    settings_box: {
        position: 'relative',
        width: '100%',
        // backgroundColor: COLORS.favourite,
        // borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 45,
        borderWidth: 1,
        justifyContent: 'center',
        marginTop: 10,
    },

    settings_container: {
        // marginHorizontal: 'auto',
        backgroundColor: '#dfdbe9ff',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        padding: 8,
    },

    settings: {
        display: 'flex',
        flexDirection: 'column',
    },

    settings_options: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        // borderWidth: 1,
    },

    settings_options_text: {
        fontSize: 15,
        color: "#615b5bff",
    },

    button: {
        backgroundColor: '#dfdbe9ff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },

    buttonText: {
        fontSize: 15,
        color: "#615b5bff",
    },


})