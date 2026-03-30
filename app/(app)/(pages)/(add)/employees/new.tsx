import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DateTimeInputNative from "@/src/components/UI/DateTimeInputNative";
import Form from "@/src/components/UI/Form";
import Spacer from "@/src/components/UI/Spacer";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

type Invite = {
    code: string;
}

export default function InviteEmployee(){

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const {session} = useSession();
    const [expire, setExpire] = useState<Date>();
    const [maxUses, setMaxUses] = useState<string>('');

    async function createInvite(){
        try{
            // setLoading(true);

            // const {data, error} = await supabase
            //     .from('company_invites')
            //     .insert({max_uses: maxUses, expires_at: expire})
            //     .select();

            // if(error) throw error;
            // if(!data) throw new Error('Error creating employee invite');

            // let invite : Invite = data[0];
            // console.log(invite);

            // router.push({pathname: '/(app)/(pages)/(add)/employees/new-code', params: {code: invite.code}})
            router.push({pathname: '/(app)/(pages)/(add)/employees/new-code', params: {code: 'AH583D'}})
            

        } catch(error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainContainer>
            <Form>
                <CustomText type='caption'>Once confirmed we will 
                    create a code which you can send to your employees.
                </CustomText>
                <Spacer height={8}/>
                <CustomText type='caption'>
                    They can enter this code whilst signing up to join your company.
                </CustomText>
                <Spacer height={24}/>

                <CustomText type='subheading' style={{textAlign: 'center'}}>Create an invite</CustomText>

                <Spacer height={24}/>
                <CustomText style={{fontStyle: 'italic'}}>Invited created by: {session?.user.user_metadata.full_name} (You)</CustomText>
                <Spacer height={12}/>


                {/* <CustomInput
                    label='Invite created by'
                    value={session?.user.user_metadata.full_name}
                    editable={false}
                /> */}
                

                <CustomInput keyboardType='number-pad' 
                    placeholder='Max'
                    label='Maximum uses of invite'
                    value={maxUses}
                    onChangeText={setMaxUses}
                />

                <DateTimeInputNative label='When should the invite expire?' 
                value={expire} onChange={setExpire}/>

                <Spacer height={48}/>

                <CustomButton title="Confirm" 
                color={COLORS.buttonPrimary}
                onPress={() => {createInvite()}}
                disabled={loading}
                />

            </Form>
        </MainContainer>
    )
}