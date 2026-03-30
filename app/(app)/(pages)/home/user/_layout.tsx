import { COLORS } from "@/src/colors";
import { useSession } from "@/context/SessionProvider";
import { MaterialTopTabs } from "../admin/_layout";
import { Dimensions } from "react-native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {Feather} from "@expo/vector-icons"

export default function TopTabayout (){
    const {session, permission} = useSession();

    const widthTabBar = Dimensions.get('window').width / 2;

    return(
        <MaterialTopTabs screenOptions={{
            // tabBarIndicatorContainerStyle: {
            //     paddingHorizontal: 4,
            // },

            tabBarIndicatorStyle: {
                backgroundColor: COLORS.buttonSecondary,
                height: 2,
                borderRadius: 12,
            },

            tabBarStyle: {
                backgroundColor: COLORS.favourite,
                flexDirection: 'row',
                justifyContent: 'center',
            },
            // tabBarItemStyle: {
            //     width: widthTabBar,
            // },
            tabBarLabelStyle: {
                color: COLORS.text1,
                fontSize: 12,
                lineHeight: 24,
                fontWeight: '300',
                letterSpacing: 0.1,
            },
            swipeEnabled: false,
        }}>
            <MaterialTopTabs.Protected guard={permission === 'staff'}>
                <MaterialTopTabs.Screen name="index" options={{
                    title: "Home",
                    // tabBarShowLabel: false,
                    tabBarIcon: ({color, focused}) => (
                    <Entypo name="home" size={24} color={focused ? COLORS.buttonSecondary : COLORS.lightPurple}/>
                )
                }}
                />
                <MaterialTopTabs.Screen name="messages" options={{
                    title: "Messages",
                    // tabBarShowLabel: false,
                    tabBarIcon: ({color, focused}) => (
                    <MaterialIcons name="message" size={24} color={focused ? COLORS.buttonSecondary : COLORS.lightPurple}/>
                )
                }}
                />
            </MaterialTopTabs.Protected>
        </MaterialTopTabs>
    )
}