import {create} from 'zustand';


const useIncidentDetails = create<{
    incTitle: string | null;
    date: Date | null;
    incDescription: string | null;

    //Also store the incident users??

    setIncTitle: (data: string) => void;
    setDate: (data: Date) => void;
    setIncDescription: (data: string) => void;

    reset: () => void;
}>((set, get) => ({
    incTitle: '',
    date: null,
    incDescription: '',

    setIncTitle: (data) => {
        set({incTitle: data})
    },

    setDate: (data) => {
        set({date: data})
    },

    setIncDescription: (data) => {
        set({incDescription: data})
    },

    reset: () => {
        set({
            incTitle: '',
            date: null,
            incDescription: '',
        })
    }
}))


export default useIncidentDetails;