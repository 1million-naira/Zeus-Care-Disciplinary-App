import { COLORS } from "@/src/colors"
import MainContainer from "@/src/components/UI/Containers/MainContainer"
import CustomButton from "@/src/components/UI/CustomButton"
import CustomInput from "@/src/components/UI/CustomInput"
import CustomText from "@/src/components/UI/CustomText"
import Dropdown from "@/src/components/UI/Dropdown"
import Spacer from "@/src/components/UI/Spacer"
import { Address, CompanySource, PURPLE } from "@/src/constants"
import { supabase } from "@/src/lib/supabase"
import { CompanyInfo } from "@/src/Types/Types"
import useCompanyAuth from "@/src/zustand/useCompanyAuth"
import { FontAwesome } from "@expo/vector-icons"
import { Text } from "@rneui/base"
import { Button, Input } from "@rneui/themed"
import { FunctionsHttpError } from "@supabase/functions-js"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"

export default function CompanyAuth () {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const {step, setStep, comapnyRawInfo, setCompanyRawInfo, companyInfo, setCompanyInfo} = useCompanyAuth();

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")

    const [email, setEmail] = useState<string>("")
    const [serviceName, setServiceName] = useState<string>("")
    const [servicePostCode, setServicePostCode] = useState<string>("")


    const [verificationChoice, setVerificationChoice] = useState<'CH' | 'CQC' | null>(null)


    const [compRegNum, setCompRegNum] = useState<string>("")
    const [compRegulatorId, setCompRegulatorId] = useState<string>("")


    async function handleSubmit () {
        try{
            setLoading(true)

            if(!servicePostCode || !serviceName || !verificationChoice){
                Alert.alert('Please complete the form');
                return;
            } else{
                if(verificationChoice === 'CH'){
                    if(!compRegNum || compRegNum.trim() === ''){
                        Alert.alert('Please enter Companies House number');
                        return;
                    }
                } else{
                    if(!compRegulatorId || compRegulatorId.trim() === ''){
                        Alert.alert('Please enter Care Quality Commission ID');
                        return;
                    }
                }
            }

            setCompanyRawInfo({
                postcode: servicePostCode,
                serviceName: serviceName,
                company_number: compRegNum,
                cqcId: compRegulatorId,
            });

            console.log('Raw Info: ', comapnyRawInfo);


            const {data, error} = await supabase.functions.invoke<CompanyInfo>('register-company',
                {
                    body: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        serviceName: serviceName,
                        servicePostCode: servicePostCode,
                        id: verificationChoice === 'CH' ? compRegNum : verificationChoice === 'CQC' ? compRegulatorId : null,
                        companiesHouse: verificationChoice === 'CH' ? true : verificationChoice === 'CQC' ? false : undefined
                    }
                }
            )

            if(error && error instanceof FunctionsHttpError){
                console.log('Error: ', error)
                throw new Error(error.message)
            }

            if(!data){
                console.log('Data: ', data);
                Alert.alert('Error: "no data"');
                return;
            }

            if(data.error){
                console.log('Whahaaa', data.error);
                throw new Error(data.error)
            }

            // Alert.alert('Hi!');
            
            console.log(data)
            setCompanyInfo(data)

            console.log('Verified Info: ', companyInfo)
            // setStep()
            router.push('/auth/company-confirmation')

        } catch(error){
            console.log(error);
            if (error instanceof Error) {
                Alert.alert(error.message);
            } 
        } finally{
            setLoading(false)
        }
    }


    useEffect(() => {
        setCompRegNum(comapnyRawInfo?.company_number || '')
        setCompRegulatorId(comapnyRawInfo?.cqcId || '')
        setServiceName(comapnyRawInfo?.serviceName || '')
        setServicePostCode(comapnyRawInfo?.postcode || '')
    }, [])



    return (
        <MainContainer>
            <KeyboardAvoidingView style={styles.keyboard}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="never"
                >
                    <CustomText type="heading">Sign up your company</CustomText>

                    {/* <View style={styles.formGroup}>
                        <Text style={styles.label}>First name</Text>
                        <Input
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                            placeholder="Enter your first name"
                            // leftIcon={
                            //     // { type: "font-awesome", name: "exclamation-circle"}
                            //     <FontAwesome name="exclamation-circle" size={12}/>
                            // }
                            containerStyle={styles.inputOuter}
                            inputContainerStyle={styles.inputInner}
                            inputStyle={styles.inputText}
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Last name</Text>
                        <Input
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                            placeholder="Enter your last name"
                            // leftIcon={
                            //     // { type: "font-awesome", name: "exclamation-circle"}
                            //     <FontAwesome name="exclamation-circle" size={12}/>
                            // }
                            containerStyle={styles.inputOuter}
                            inputContainerStyle={styles.inputInner}
                            inputStyle={styles.inputText}
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View> */}

                    {/* <View style={styles.formGroup}>
                        <Text style={styles.label}>Work email</Text>
                        <Input
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="email@address.com"
                            // leftIcon={
                            //     // { type: "font-awesome", name: "exclamation-circle"}
                            //     <FontAwesome name="exclamation-circle" size={12}/>
                            // }
                            containerStyle={styles.inputOuter}
                            inputContainerStyle={styles.inputInner}
                            inputStyle={styles.inputText}
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View> */}

                    <Spacer height={16}/>
                    <CustomInput
                        label="Service Name"
                        placeholder="Enter your service name"
                        value={serviceName}
                        onChangeText={(text) => setServiceName(text)}
                        secureTextEntry={false}
                    />
                    <Spacer height={16}/>
                    <CustomInput
                        label="Service postcode"
                        placeholder="Enter your service postcode"
                        value={servicePostCode}
                        onChangeText={(text) => setServicePostCode(text)}
                        secureTextEntry={false}
                    />
                    <Spacer height={16}/>


                    <CustomText>Company ID</CustomText>
                    <Spacer height={8}/>
                    <CustomText type="caption">Choose method we'll use to check your company is active</CustomText>
                    <Spacer height={16}/>
                    <Dropdown data={[{value: 'CH', label: 'Companies House'}, {value: 'CQC', label: 'Care Quality Commission'}]} 
                    onChange={setVerificationChoice}
                    placeholder="Please select"
                    />

                    <Spacer height={16}/>
                    {
                        verificationChoice === 'CH' ? 
                        (
                            <CustomInput
                                label="Company registration number"
                                placeholder=""
                                value={compRegNum}
                                onChangeText={(text) => setCompRegNum(text)}
                                secureTextEntry={false}
                            />

                        ) 
                        : verificationChoice === 'CQC' ?

                        (
                            <CustomInput
                                label="Regulator ID (form)"
                                placeholder=""
                                value={compRegulatorId}
                                onChangeText={(text) => setCompRegulatorId(text)}
                                secureTextEntry={false}
                            />
                        ) : null
                    }


                    <Spacer height={36}/>

                    <CustomButton
                        title="Sign up"
                        disabled={loading}
                        onPress={() => handleSubmit()}
                        color={COLORS.buttonPrimary}
                    />
                    <Spacer height={16}/>
                    <CustomText type='caption' style={{textAlign: 'center'}}>OR</CustomText>
                    <Spacer height={16}/>
                    <CustomButton
                        title="Enter your details manually"
                        disabled={loading}
                        onPress={() => {}}
                        color={COLORS.buttonSecondary}
                    />

                </ScrollView>

            </KeyboardAvoidingView>
        </MainContainer>
    )
}


const styles = StyleSheet.create({

    keyboard: { flex: 1 },

});