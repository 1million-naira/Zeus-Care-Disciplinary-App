import { Address, CompanySource } from "../constants";

export type OptionItem = {
    value: string;
    label: string;
}


export type ReportableUser = {
    user_id: string;
    name : string;
}


export type Incident = {
    id: string,
    title: string,
    description: string,
    occured_at: Date | null,
    created_by: string,
    status : string,
    severity? : string,
}


export type Case = {
    case_id: string,
    header: string,
    status: string,
    description: string,
    outcome: string,
    hearing_datetime: Date | null,
}


export type CompanyInfo = {
    name?: string,
    type?: string | null,
    reg_date?: string,
    cqcNum?: string,
    company_number?: string,
    company_source?: CompanySource,
    address?: Address,
    error?: string | null
}


export type CaseStatus = 'open' | 'hearing_scheduled' | 'hearing_done' | 'closed' | null


export type MemberRole = 'staff' | 'viewer' | 'supervisor' | 'admin' | 'manager'

export type IncidentStatus = 'reported' | 'in_review' | 'in_investigation' | 'closed' | null