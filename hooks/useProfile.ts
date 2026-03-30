import { useSession } from "@/context/SessionProvider";
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers";
import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";


// const {session} = useSession()

export async function useProfile(session : Session | null) : Promise<string | null>{
    if(!session){
        throw new Error("The session does not exist");
    }

    console.log(session)

    const {data: profile, error: profileError} = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', session.user.id)
        .single()

    if (profileError) throw new Error(profileError.message);

    if(!profile.avatar_url) return ''

    return supabaseGetPublicUrl('avatars', profile.avatar_url)
}