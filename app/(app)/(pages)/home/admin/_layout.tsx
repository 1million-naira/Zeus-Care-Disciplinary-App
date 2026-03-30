import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs"
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native"
import { COLORS } from "@/src/colors";
import { useSession } from "@/context/SessionProvider";


const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);


export default function TopTabayout (){
    const {session, permission, ready} = useSession();

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
            <MaterialTopTabs.Protected guard={permission === 'admin' || permission === 'manager' || permission === 'supervisor'}>
                <MaterialTopTabs.Screen name="index" options={{title: "Home"}}/>
                <MaterialTopTabs.Screen name="incident" options={{title: "Incidents"}}/>
                <MaterialTopTabs.Screen name="case" options={{title: "Cases"}}/>
                {/* <MaterialTopTabs.Screen name="employees" options={{title: "Employees"}}/> */}
            </MaterialTopTabs.Protected>
            {/* <MaterialTopTabs.Screen name="profile" options={{title: "Profile"}} redirect={true}/> */}
        </MaterialTopTabs>
    )
}

