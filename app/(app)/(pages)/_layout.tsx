
import { PURPLE } from "@/src/constants";
import { Entypo, FontAwesome, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { color } from "@rneui/base";
import { Tabs, useRouter } from "expo-router";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Drawer} from 'expo-router/drawer'
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useSession } from "@/context/SessionProvider";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import { COLORS } from "@/src/colors";
import CustomText from "@/src/components/UI/CustomText";

export default function TabLayout() {
    const {session} = useSession()
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)


    useEffect(() => {
        console.log("This is main layout")
        useProfile(session)
        .then((data) => {setAvatarUrl(data); console.log(data)})
        .catch((error) => {if(error instanceof Error) Alert.alert(error.message)})
    }, [])



    return (
        <View style={{flex:1}}>
            <Tabs screenOptions={{
                // headerShown: false,
                headerTitleStyle: {fontWeight: '300'},
                headerShadowVisible: false,
                tabBarActiveTintColor: COLORS.text1,
                tabBarItemStyle: {
                    opacity: 0.9
                },
                
                tabBarStyle: {
                    ...styles.tabContainer
                },

                tabBarLabelStyle: {
                    color: COLORS.text1,
                    fontSize: 10,
                    lineHeight: 24,
                    fontWeight: '200',
                    letterSpacing: 0.2,
                },

                // headerLeft: () => (
                //     <View style={{marginLeft: 15}}>
                //         <DefaultProfile url={!avatarUrl ? '' : avatarUrl} size={35}/>
                //     </View>

                // ),

                // headerTitle: () => (
                //     <Image source={require("@/assets/images/logos/logo-horizontal-transparent-bw.png")}
                //         style={{width: 130, height:30}}
                //     />
                // ),

                // headerRight: () => (
                //     <TouchableOpacity style={{marginRight: 15}}>
                //         <Ionicons name="help-circle-outline" size={35} color={COLORS.buttonSecondary}/>
                //     </TouchableOpacity>
                // )
            }}
            >
                
                <Tabs.Screen name="home" options={{
                    title: "Home",
                    // headerShown: true,
                tabBarIcon: ({color, size, focused}) => (
                    <Entypo name="home" size={24} color={focused ? COLORS.buttonSecondary : COLORS.main}/>
                )
                }}/>


                <Tabs.Screen name="files" options={{
                    title: "Documents", 
                    // headerShown: true,
                tabBarIcon: ({color, size, focused}) => (
                    <Ionicons name="folder-open" size={24} color={focused ? COLORS.buttonSecondary : COLORS.main}/>
                ),
                }}/>
                

                <Tabs.Screen name="(add)" options={{
                    title: "",
                    tabBarIcon: ({color, size, focused}) => (
                        // <Ionicons name="add-circle" color={PURPLE[700]} size={24}/>
                        <View
                        style={{
                            ...styles.button
                        }}
                        >
                        <FontAwesome name="plus" size={26} color="white" />
                        </View>
                    )
                }}
                // listeners={{
                //     tabPress: (e) => {
                //         e.preventDefault();
                //         router.navigate("/(app)/pages/add")
                //         console.log('Press Add default prevented')
                //     }
                // }}
                />

                <Tabs.Screen name="notifications" options={{
                    title: "Notifications",
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons name="notifications" size={24} color={focused ? COLORS.buttonSecondary : COLORS.main}/>
                    )
                    
                }}/>

                <Tabs.Screen name="settings" options={{
                    title: "Settings",
                    tabBarIcon: ({color, size, focused}) => (
                        <Ionicons name="settings" size={24} color={focused ? COLORS.buttonSecondary : COLORS.main}/>
                    )
                }}/>

                <Tabs.Screen name="employees" options={{
                    title: "Employees",
                    href: null
                }}/>


            </Tabs>
        </View>
    )

}



const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        // top: 0.1,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: COLORS.buttonSecondary,
        shadowColor: "#999494ff",
        shadowOffset: {
            width: 0.2,
            height: 0.2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        opacity: 0.9,
    },

    tabContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 90,
        backgroundColor: COLORS.favourite,
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        paddingTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    }


})