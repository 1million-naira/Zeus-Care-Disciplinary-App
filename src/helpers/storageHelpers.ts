import { supabase } from "../lib/supabase";

export function supabaseGetPublicUrl(bucket: string, path: string){

    // const { data : exists, error } = await supabase
    //     .storage
    //     .from(bucket)
    //     .exists(path)
    
    // if (!exists) return ''

    const {data} = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}