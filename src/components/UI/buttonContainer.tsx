import { Button } from "@rneui/themed";
import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ButtonContainer() {

    const router = useRouter();
    return (
        <View style={styles.buttonContainer}>
            <Button title='Add Case' onPress={() => {router.push("./Add-case")}}/>
            <Button title='Add Conduct Note' onPress={() => {}}/>
            <Button title='Report an Incident' onPress={() => {}}/>
        </View>
    )

}
const styles = StyleSheet.create(
    {
        buttonContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'absolute',
            bottom: 50,
            right: 50,
        },
    }
);