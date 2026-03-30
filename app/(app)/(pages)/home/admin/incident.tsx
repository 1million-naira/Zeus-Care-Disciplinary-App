import { useSession } from "@/context/SessionProvider";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import IncidentList from "@/src/components/UI/IncidentList";
import { supabase } from "@/src/lib/supabase";
import { IncidentStatus } from "@/src/Types/Types";
import { Alert } from "react-native";


type Incident = {
    id: string,
    title: string,
    description: string,
    occured_at: Date | null,
    created_by: string,
    status : string,
}


export default function Incidents (){
    const {session} = useSession();

    async function getCount(searchText: string, status : IncidentStatus) {
        try{
            let query = supabase
                .from('incident')
                .select('*', {count: 'exact', head: true})
                .eq('company_id', session?.user.user_metadata.company_id)
                .ilike('title', `${searchText}%`)

            if(status !== null){
                query = query.eq('status', status)
            }

            const {count, error : countError} = await query;

            if(countError || !count) throw countError;

            return count;

        } catch (error){
            if(error instanceof Error){
                Alert.alert(error.message)
            }
        }
    }

    async function getIncidents(searchText: string, status : IncidentStatus, page: number) {
        try{
            let query = supabase
                .from('incident')
                .select(`id, title, description, occured_at, created_by, status`)
                .eq('company_id', session?.user.user_metadata.company_id)
                .ilike('title', `${searchText}%`)
                .range(page * 10 - 10, page * 10 - 1);
            
            if(status !== null){
                query = query.eq('status', status);
            }

            const {data, error} = await query;
            if (error) throw error;

            if (data){
                console.log('Fetched incidents: ', data)
                return data;
            }

        } catch(error){
            if (error instanceof Error){
                console.log("Error fetching incidents: ", error.message)
                Alert.alert(error.message)
            }
        }
    }

    return (
        <MainContainer>
            <IncidentList getCount={getCount} getData={getIncidents}
            />
        </MainContainer>
    )
}