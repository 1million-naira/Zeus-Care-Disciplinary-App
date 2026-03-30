import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSession } from "@/context/SessionProvider";
import { Redirect } from "expo-router";


export default function Home() {
    const {session, ready, permission} = useSession();

    if(!session || !session.user){
        return <Redirect href={'/auth'}/>
        
    }

    if(permission === 'admin' || permission === 'manager' || permission === 'supervisor'){
        console.log('Admin login')
        return  <Redirect href={'/(app)/(pages)/home/admin'}/>
    
    } 
    
    if(permission === 'staff'){
        console.log('User login')
        return <Redirect href={'/(app)/(pages)/home/user'}/>
    }

    return <Redirect href={'/auth'}/>

    // return (
    //     <View>
    //         {
    //             !session || !session.user ? <Redirect href={'/auth'}/> :
    //             (permission === 'admin' || permission === 'manager' || permission === 'supervisor') ? 
    //             <Redirect href={'/(app)/(pages)/home/(admin)'}/> : 
    //             permission === 'staff' ? <Redirect href={'/(app)/(pages)/home/(user)'}/> : 
    //             <Redirect href={'/auth'}/> 
    //         }
    //     </View>
    // )
}