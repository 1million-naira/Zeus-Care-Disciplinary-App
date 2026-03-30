import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type Context = {
    session: Session | null; 
    ready: boolean;
    permission: 'admin' | 'staff' | 'manager' | 'supervisor' | 'viewer' | null;
}

const SessionContext = createContext<Context>({session: null, ready: false, permission: null})

async function getUserPermission(session: Session){
    if(!session){
        return;
    }
    
    try{
        const {data, error} = await supabase
            .rpc('get_role', {p_company: session.user.user_metadata.company_id});

        if(error) throw error;
        
        if(data){
            return data as Context['permission']
        }

    } catch(error){
        return;
    } finally{

    }
}

export function SessionProvider({children}: {children: React.ReactNode}){
    const [session, setSession] = useState<Session | null>(null)
    const [ready, setReady] = useState(false)
    const [permission, setPermission] = useState<'admin' | 'staff' | 'manager' | 'supervisor' | 'viewer' | null>(null)

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({data: {session}}) => {
            if (!mounted) return;
            setSession(session ?? null);
            setReady(true);
        });

        const {data: sub} = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setSession(session ?? null);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if(!session){
            return;
        }

        setReady(false)

        getUserPermission(session)
        .then((result) => setPermission(result || null))
        .catch(() => setPermission(null))
        .finally(() => setReady(true))

    }, [session])


    return (
        <SessionContext.Provider value={{session, ready, permission}}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext)