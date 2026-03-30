import { useSession } from "@/context/SessionProvider";
import { Stack } from "expo-router";

export default function EmployeeLayout(){
    const {session, permission, ready} = useSession();

    return(
        <Stack screenOptions={{
            headerShadowVisible: false,
            headerBackVisible: true,
        }}>
            <Stack.Protected guard={permission === 'admin' || permission === 'manager' || permission === 'supervisor'}>
                <Stack.Screen name="index" options={{title: "Employees", headerShown: false, headerBackVisible: true}}/>
                <Stack.Screen name="[id]" options={{title: ""}}/>
            </Stack.Protected>
        </Stack>
    )
}