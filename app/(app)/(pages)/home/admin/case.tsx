import { useSession } from "@/context/SessionProvider";
import CaseList from "@/src/components/UI/CaseList";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import { supabase } from "@/src/lib/supabase";
import { Case, CaseStatus} from "@/src/Types/Types";
import { Alert } from "react-native";


export default function Cases (){

    const {session} = useSession();



    async function getCount(searchText : string, status: CaseStatus) : Promise<number | undefined> {
        try{
            let query = supabase
                    .from('disciplinary_case')
                    .select('*', {count: 'exact', head: true})
                    .eq('company_id', session?.user.user_metadata.company_id)
                    .ilike('header', `${searchText}%`);

            if(status !== null){
                query = query.eq('status', status);
            }


            const {count, error: countError} = await query;
        
            if (countError || !count) throw countError;
            return count;
    
        } catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }
    }

    async function getCases(searchText : string, status: CaseStatus, page : number) : Promise<Case[] | undefined> {
        try{
            let query = supabase
                .from('disciplinary_case')
                .select(`case_id, header, status, description, hearing_datetime, outcome`)
                .eq('company_id', session?.user.user_metadata.company_id)
                .ilike('header', `${searchText}%`)
                .range(page * 10 - 10, page * 10 - 1);

            if(status !== null){
                query = query.eq('status', status);
            }
            const {data, error} = await query;

            if (error) throw error;

            if (data){
                console.log("Fetched cases: ", data)
                return data;
            }

        } catch(error){
            if (error instanceof Error){
                console.log("Error fetching cases: ", error.message)
                Alert.alert(error.message)
            }

        }
    }




    return (
        <MainContainer>
            <CaseList getCount={getCount} getData={getCases}
            />
        </MainContainer>
    )
}
