export const PURPLE = {
    900: "#4B2D73",
    700: "#6C4BFF",
    500: "#8C75FF",
    200: "#EAE6FF",
    100: "#f8f6ffff"
};

export type SuggestedIncidentOutcome =
  | 'no_action_required'
  | 'reported_to_cqc'
  | 'training_provided'
  | 'verbal_warning'
  | 'first_written_warning'
  | 'final_written_warning'
  | 'dismissal'
  | 'awaiting_investigation'
  | 'closed_actions_complete';



export const INCIDENT_OUTCOME_OPTIONS = [
  { value: 'no_action_required', label: 'No Action Required' },
  { value: 'reported_to_cqc', label: 'Reported to CQC' },
  { value: 'training_provided', label: 'Training Provided' },
  { value: 'verbal_warning', label: 'Verbal Warning' },
  { value: 'first_written_warning', label: 'First Written Warning' },
  { value: 'final_written_warning', label: 'Final Written Warning' },
  { value: 'dismissal', label: 'Dismissal' },
  { value: 'awaiting_investigation', label: 'Awaiting Investigation' },
  { value: 'closed_actions_complete', label: 'Closed – Actions Complete' }
];



export const STATUS_LABELS = {
    'open': 'Open',
    'hearing_scheduled': 'Hearing Scheduled',
    'hearing_done': 'Hearing Done',
    'closed': 'Closed',
    null: ''
}


export const INCIDENT_STATUS_LABELS = {
    'reported': 'Reported',
    'in_review': 'In Review',
    'in_investigation': 'In Investigation',
    'closed': 'Closed'
}



export type CompanySource = 
| 'cqc'
| 'companies_house'


export type Address = {
    address_line_1?: string,
    address_line_2?: string,
    city?: string | null,
    region?: string | null,
    country?: string | null
    post_code?: string | null,
}
