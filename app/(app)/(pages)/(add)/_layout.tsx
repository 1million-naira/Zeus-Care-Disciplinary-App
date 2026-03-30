import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function addLayout() {
    return (
        <Stack screenOptions={{
            // headerShown: false
            headerStyle: {
                // backgroundColor: '#eee2f0ff',
            },
            headerShadowVisible: false
        }}>
            <Stack.Screen name="index" options={{title:'', headerShown: false}}/>
            <Stack.Screen name="incident/new" options={{title:'Report an incident'}}/>
            <Stack.Screen name="incident/users" options={{title:'Who is involved?'}}/>
            <Stack.Screen name="note/new" options={{title: 'Create a note'}}/>

            {/* Protect these routes */}
            <Stack.Screen name="case/new" options={{title: 'Create a case'}}/>
            <Stack.Screen name="employees/new" options={{title: 'Invite employees'}}/>
            <Stack.Screen name="employees/new-code" options={{title: 'Invite code'}}/>
        </Stack>
    )
}