import { SessionProvider } from "@/context/SessionProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <SessionProvider>
            <Stack screenOptions={{
                headerShown: false,
            }}>
                <Stack.Screen name="auth" options={{title:'Auth' ,headerShown: false}}/>
                <Stack.Screen name="auth/register" options={{title: 'Sign Up', headerShown: false}}/>
                <Stack.Screen name="auth/company-search" options={{title:'', headerShown: true}}/>
                <Stack.Screen name="auth/company-confirmation" options={{title:'Confirm company', headerShown: true}}/>
                <Stack.Screen name="auth/country-selection" options={{title: '', headerShown: true}}/>
                <Stack.Screen name="(app)/(pages)" options={{title:'Zeus App'}}/>
            </Stack>
        </SessionProvider>
    )
}