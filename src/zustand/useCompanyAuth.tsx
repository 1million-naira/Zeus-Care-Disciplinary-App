import {create} from 'zustand';
import { CompanyInfo } from '../Types/Types';


type CompanyRawInfo = {
    company_number?: string | null, 
    cqcId?: string | null, 
    postcode?: string, 
    serviceName?: string
}

type Login = {
    firsNname: string, 
    lastName: string, 
    email: string
}

const useCompanyAuth = create<{
    step: number;
    comapnyRawInfo: CompanyRawInfo | null;
    companyInfo: CompanyInfo | null;
    login:  Login | null;

    setStep: () => void;
    setCompanyRawInfo: (data: CompanyRawInfo) => void;
    setCompanyInfo: (data: CompanyInfo) => void;
    setLogin: (data: Login) => void;
    updateAddressField: (field: string, data: string) => void;

    reset: () => void
}>(
    (set, get) => ({
        step: 1,
        comapnyRawInfo: null,
        companyInfo: null,
        login: null,

        setStep: () => {
            set( {step: get().step + 1} )
        },

        setCompanyRawInfo: (data) => {
            set( {comapnyRawInfo: data} )
        },

        setCompanyInfo: (data) => {
            set( {companyInfo: data} )
        },

        setLogin: (data) => {
            set( {login: data} )
        },

        updateAddressField: (field, data) => {
            set((state) => ({companyInfo : {...state.companyInfo, address: {...state.companyInfo?.address, [field] : data}}}))
        },

        reset: () => set({
            step: 1,
            comapnyRawInfo: null,
            companyInfo: null,
            login: null
        })
    })
)

export default useCompanyAuth;