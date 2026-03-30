import { useSession } from "@/context/SessionProvider";
import { COLORS } from "@/src/colors";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import DefaultProfile from "@/src/components/UI/DefaultProfile";
import EmployeeList from "@/src/components/UI/EmployeeList";
import Spacer from "@/src/components/UI/Spacer";
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers";
import { supabase } from "@/src/lib/supabase";
import { MemberRole } from "@/src/Types/Types";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Employee = {
    id: string
    avatar_url: string | null
    name: string
    role: MemberRole
}


export default function Employees (){

    const {session} = useSession();
    const router = useRouter();


    async function getCount(status: MemberRole | null, searchText: string){
        try{
            let query = supabase
                .from('memberships')
                .select('*', {count: 'exact', head: true})
                .eq('company_id', session?.user.user_metadata.company_id)
                .ilike('title', `${searchText}%`)

            if(status !== null){
                query = query.eq('status', status)
            }

            const {count, error : countError} = await query;

            if(countError || !count) {console.log(countError); throw countError};

            return count;

        } catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }
    }


    async function getEmployees(page: number, filter: MemberRole | null, searchText: string){
        try{
            if(!session || !session.user)throw new Error("Invalid session!");

            const {data, error} = await supabase
                .rpc('get_members', {p_company: session?.user.user_metadata.company_id ,p_offset: page*10-10, p_role: filter, p_text: searchText})
            
            if(error) {console.log('Error'); throw error}

            if(data){
                console.log('Employee data: ', data)
                return data;
            }
        } catch (error){
            if(error instanceof Error){
                console.log(error)
                Alert.alert(error.message)

            }
        }
    }

    return (
        <MainContainer>
            <EmployeeList getCount={getCount} getData={getEmployees}/>
        </MainContainer>
    )
}