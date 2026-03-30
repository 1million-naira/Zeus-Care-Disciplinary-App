import { COLORS } from "@/src/colors"
import MainContainer from "@/src/components/UI/Containers/MainContainer"
import CustomButton from "@/src/components/UI/CustomButton"
import CustomInput from "@/src/components/UI/CustomInput"
import CustomText from "@/src/components/UI/CustomText"
import Dropdown from "@/src/components/UI/Dropdown"
import Spacer from "@/src/components/UI/Spacer"
import { PURPLE } from "@/src/constants"
import useCompanyAuth from "@/src/zustand/useCompanyAuth"
import { FontAwesome } from "@expo/vector-icons"
import { Text } from "@rneui/base"
import { Button, Input } from "@rneui/themed"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"

export default function ConfirmCompany () {

    const [loading, setLoading] = useState(false);

    const [formDisabled, setFormDisabled] = useState(true);

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")

    const [email, setEmail] = useState<string>("")
    const [serviceName, setServiceName] = useState<string>("")

    const [addressLine1, setAddressLine1] = useState<string>("")
    const [addressLine2, setAddressLine2] = useState<string>("")

    const [servicePostCode, setServicePostCode] = useState<string>("")
    const [town, setTown] = useState<string>("")
    const [country, setCountry] = useState<string>("")

    const {setCompanyInfo, companyInfo, updateAddressField} = useCompanyAuth();
    // console.log(companyInfo?.address?.post_code);

    const [verificationChoice, setVerificationChoice] = useState<'CH' | 'CQC'>()


    const [compRegNum, setCompRegNum] = useState<string>("")
    const [compRegulatorId, setCompRegulatorId] = useState<string>("")

    async function handleSubmit () {
        console.log('Company Info: ', companyInfo)
    }


    useEffect(() => {
        setServiceName(companyInfo?.name || '')
        setCompRegNum(companyInfo?.company_number || '')
        setCompRegulatorId(companyInfo?.cqcNum|| '')
        setAddressLine1(companyInfo?.address?.address_line_1 || '')
        setAddressLine2(companyInfo?.address?.address_line_2 || '')
        setServicePostCode(companyInfo?.address?.post_code || '')
        setTown(companyInfo?.address?.city || '')
        setCountry(companyInfo?.address?.country || '')
    }, [])





    return (
        <MainContainer>
            <KeyboardAvoidingView style={styles.keyboard}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="never"
                >
                    <CustomText type="heading">Confirm your company's details</CustomText>
                    <Spacer height={16}/>
                    <CustomText>
                        We've retrieved your company information based on the details you provided.
                        Please review and confirm that everything is correct before continuing.
                    </CustomText>

                    <Spacer height={24}/>


                    <CustomButton
                        title="Edit details"
                        disabled={loading}
                        onPress={() => setFormDisabled(!formDisabled)}
                        color={formDisabled ? COLORS.buttonPrimary : COLORS.buttonSecondary}
                    />
                    <Spacer height={16}/>
                    <CustomText type="subheading">Company details</CustomText>



                    <Spacer height={8}/>
                    <CustomInput
                        label="Company Name"
                        value={serviceName}
                        onChangeText={(text) => {setServiceName(text); setCompanyInfo({...companyInfo, name: serviceName})}}
                        placeholder="Enter your service name"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />
                    <Spacer height={24}/>
                    {/* <View style={styles.formGroup}>
                        <Text style={styles.label}>Companies House Number</Text>
                        <Input
                            value={compRegNum}
                            onChangeText={(text) => {}}
                            // placeholder="Enter your service name"
                            containerStyle={styles.inputOuter}
                            inputContainerStyle={styles.inputInner}
                            inputStyle={styles.inputText}
                            placeholderTextColor={styles.placeholder.color}
                            disabled={true}
                        />
                    </View> */}

                    {/* {
                        compRegulatorId ? 
                        (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>CQC ID</Text>
                                <Input
                                    value={compRegulatorId}
                                    onChangeText={(text) => {}}
                                    // placeholder="Enter your service name"
                                    containerStyle={styles.inputOuter}
                                    inputContainerStyle={styles.inputInner}
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={styles.placeholder.color}
                                    disabled={true}
                                />
                            </View>
                        ) 
                        : null
                    } */}


                    <CustomText type="subheading">Registered Address</CustomText>
                    <Spacer height={8}/>

                    <CustomInput
                        label="Address Line 1"
                        value={addressLine1}
                        onChangeText={(text) => {setAddressLine1(text); updateAddressField('address_line_1', text)}}
                        placeholder="Address Line 1"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />

                    <Spacer height={16}/>                   
                    <CustomInput
                        label="Address Line 2"
                        value={addressLine2}
                        onChangeText={(text) => {setAddressLine2(text); updateAddressField('address_line_2', text)}}
                        placeholder="Address Line 2"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />
                    <Spacer height={16}/>
                    <CustomInput
                        label="Service postcode"
                        value={servicePostCode}
                        onChangeText={(text) => {setServicePostCode(text); updateAddressField('post_code', servicePostCode)}}
                        placeholder="Enter your service postcode"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />
                    <Spacer height={16}/>

                    <CustomInput
                        label="Town/City"
                        value={town}
                        onChangeText={(text) => {setTown(text); updateAddressField('city', town)}}
                        placeholder="Enter your town"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />
                    <Spacer height={16}/>

                    <CustomInput
                        label="Country/Region"
                        value={country}
                        onChangeText={(text) => {setCountry(text); updateAddressField('country', country)}}
                        placeholder="Enter country/region"
                        secureTextEntry={false}
                        editable={!formDisabled}
                    />


                    <Spacer height={36}/>

                    <Spacer height={16}/>
                    <CustomButton
                        title="Complete registration"
                        disabled={loading}
                        onPress={() => handleSubmit()}
                        color={COLORS.buttonPrimary}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </MainContainer>
    )
}


const styles = StyleSheet.create({
    keyboard: { flex: 1 },
    container: { backgroundColor: "#FFFFFF" },

});