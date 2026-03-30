import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{}}>
            <Stack.Screen name='index' options={{headerShown: false, title: 'Settings'}}/>
            <Stack.Screen name='profile' options={{title: 'Profile'}}/>
        </Stack>
    )
}