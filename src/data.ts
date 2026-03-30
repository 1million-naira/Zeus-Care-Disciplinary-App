type File = {
    name: string,
    type: 'PDF' | 'DOCX' | 'IMAGE' | 'VIDEO'
    size: number,
    created: Date,
}

export const files: File[] = [
  {
    name: "IncidentReport_2025-01-14",
    type: "PDF",
    size: 312_540,   // ~312 KB
    created: new Date("2025-01-14T09:22:00Z"),
  },
  {
    name: "StaffStatement_JSmith",
    type: "DOCX",
    size: 98_120,    // ~98 KB
    created: new Date("2025-01-15T13:05:00Z"),
  },
  {
    name: "CCTV_FrontHallway_Clip",
    type: "VIDEO",
    size: 23_584_002, // ~23.5 MB
    created: new Date("2025-01-14T09:30:00Z"),
  },
  {
    name: "MedicationRoom_Photo1",
    type: "IMAGE",
    size: 2_104_330,  // ~2.1 MB
    created: new Date("2025-01-14T10:12:00Z"),
  },
  {
    name: "FollowUpReport_2025-01-20",
    type: "PDF",
    size: 410_880,   // ~410 KB
    created: new Date("2025-01-20T08:41:00Z"),
  }
];


export type Activity = {
    id: string;
    reference_id: string;
    subject: string;
    created_by: string;
    type: 'incident' | 'case' | 'note';
    action: 'created' | 'received';
    created_at: Date;
};

export const activities: Activity[] = [
  {
    id: 'a1',
    reference_id: 'INC-301',
    subject: 'Missed morning medication visit for Mrs Taylor',
    created_by: 'Sarah Ahmed',
    type: 'incident',
    action: 'created',
    created_at: new Date('2026-02-20T07:45:00Z'),
  },
  {
    id: 'a2',
    reference_id: 'CASE-112',
    subject: 'Safeguarding concern raised for Mr Hughes',
    created_by: 'Daniel Foster',
    type: 'case',
    action: 'received',
    created_at: new Date('2026-02-20T09:20:00Z'),
  },
  {
    id: 'a3',
    reference_id: 'NOTE-54',
    subject: 'Family updated on mobility assessment outcome',
    created_by: 'Emily Carter',
    type: 'note',
    action: 'created',
    created_at: new Date('2026-02-21T11:05:00Z'),
  },
  {
    id: 'a4',
    reference_id: 'INC-302',
    subject: 'Fall reported in Oakview Care Home lounge',
    created_by: 'James O’Connor',
    type: 'incident',
    action: 'received',
    created_at: new Date('2026-02-21T14:40:00Z'),
  },
  {
    id: 'a5',
    reference_id: 'CASE-113',
    subject: 'Review opened for increased night support hours',
    created_by: 'Priya Shah',
    type: 'case',
    action: 'created',
    created_at: new Date('2026-02-22T10:15:00Z'),
  },
  {
    id: 'a6',
    reference_id: 'NOTE-55',
    subject: 'Care plan updated with new dietary requirements',
    created_by: 'Mark Bennett',
    type: 'note',
    action: 'received',
    created_at: new Date('2026-02-23T08:55:00Z'),
  },
  {
    id: 'a7',
    reference_id: 'INC-303',
    subject: 'Late arrival logged for domiciliary evening visit',
    created_by: 'Laura McKenzie',
    type: 'incident',
    action: 'created',
    created_at: new Date('2026-02-24T18:25:00Z'),
  },
  {
    id: 'a8',
    reference_id: 'CASE-114',
    subject: 'Complaint received regarding meal quality',
    created_by: 'Thomas Reed',
    type: 'case',
    action: 'received',
    created_at: new Date('2026-02-25T13:10:00Z'),
  },
];
