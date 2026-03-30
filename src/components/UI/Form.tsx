import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

type Props = {
    children? : React.ReactNode;
}
export default function Form({children} : Props){
    return (
        <KeyboardAvoidingView style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView keyboardShouldPersistTaps='never'>
                {children}
            </ScrollView>

        </KeyboardAvoidingView>
    )
}