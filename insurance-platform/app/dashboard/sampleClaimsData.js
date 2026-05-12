export const SAMPLE_CLAIMS_CSV = `claim_id,payer,cpt_code,cpt_description,amount_billed,amount_paid,status,denial_reason_code,denial_reason,date_of_service,provider
CLM-001,UnitedHealthcare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-09-03,Dr. Sarah Chen
CLM-002,Aetna,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-4,Missing modifier,2025-09-04,Dr. James Wilson
CLM-003,Cigna,99215,Office Visit - Level 5,250.00,220.00,Paid,,,2025-09-05,Dr. Lisa Park
CLM-004,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-09-06,Dr. Michael Brown
CLM-005,UnitedHealthcare,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-09-07,Dr. Amy Rodriguez
CLM-006,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-09-08,Dr. Sarah Chen
CLM-007,Cigna,99213,Office Visit - Level 3,125.00,105.00,Paid,,,2025-09-09,Dr. James Wilson
CLM-008,Humana,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-09-10,Dr. Lisa Park
CLM-009,Blue Cross,90837,Psychotherapy 60min,175.00,0.00,Denied,CO-4,Missing modifier,2025-09-11,Dr. Michael Brown
CLM-010,UnitedHealthcare,99214,Office Visit - Level 4,185.00,160.00,Paid,,,2025-09-12,Dr. Amy Rodriguez
CLM-011,Aetna,99215,Office Visit - Level 5,250.00,0.00,Denied,PR-1,Deductible not met,2025-09-13,Dr. Sarah Chen
CLM-012,Cigna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-09-14,Dr. James Wilson
CLM-013,Humana,99213,Office Visit - Level 3,125.00,125.00,Paid,,,2025-09-15,Dr. Lisa Park
CLM-014,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-09-16,Dr. Michael Brown
CLM-015,UnitedHealthcare,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-09-17,Dr. Amy Rodriguez
CLM-016,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-09-18,Dr. Sarah Chen
CLM-017,Cigna,99215,Office Visit - Level 5,250.00,230.00,Paid,,,2025-09-19,Dr. James Wilson
CLM-018,Humana,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-16,Missing information,2025-09-20,Dr. Lisa Park
CLM-019,Blue Cross,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-4,Missing modifier,2025-09-21,Dr. Michael Brown
CLM-020,UnitedHealthcare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-09-22,Dr. Amy Rodriguez
CLM-021,Aetna,90837,Psychotherapy 60min,175.00,0.00,Denied,CO-197,Missing prior authorization,2025-09-23,Dr. Sarah Chen
CLM-022,Cigna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-09-24,Dr. James Wilson
CLM-023,Humana,99215,Office Visit - Level 5,250.00,250.00,Paid,,,2025-09-25,Dr. Lisa Park
CLM-024,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-09-26,Dr. Michael Brown
CLM-025,UnitedHealthcare,99213,Office Visit - Level 3,125.00,110.00,Paid,,,2025-09-27,Dr. Amy Rodriguez
CLM-026,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-10-01,Dr. Sarah Chen
CLM-027,Cigna,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-10-02,Dr. James Wilson
CLM-028,Humana,99214,Office Visit - Level 4,185.00,0.00,Denied,PR-1,Deductible not met,2025-10-03,Dr. Lisa Park
CLM-029,Blue Cross,99215,Office Visit - Level 5,250.00,0.00,Denied,CO-4,Missing modifier,2025-10-04,Dr. Michael Brown
CLM-030,UnitedHealthcare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-10-05,Dr. Amy Rodriguez
CLM-031,Aetna,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-16,Missing information,2025-10-06,Dr. Sarah Chen
CLM-032,Cigna,99214,Office Visit - Level 4,185.00,155.00,Paid,,,2025-10-07,Dr. James Wilson
CLM-033,Humana,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-10-08,Dr. Lisa Park
CLM-034,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-10-09,Dr. Michael Brown
CLM-035,UnitedHealthcare,99215,Office Visit - Level 5,250.00,225.00,Paid,,,2025-10-10,Dr. Amy Rodriguez
CLM-036,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-10-11,Dr. Sarah Chen
CLM-037,Cigna,99213,Office Visit - Level 3,125.00,0.00,Denied,PR-1,Deductible not met,2025-10-12,Dr. James Wilson
CLM-038,Humana,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-10-13,Dr. Lisa Park
CLM-039,Blue Cross,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-10-14,Dr. Michael Brown
CLM-040,UnitedHealthcare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-10-15,Dr. Amy Rodriguez
CLM-041,Kaiser Permanente,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-10-16,Dr. David Kim
CLM-042,Anthem,99213,Office Visit - Level 3,125.00,125.00,Paid,,,2025-10-17,Dr. Kevin Patel
CLM-043,Molina Healthcare,99215,Office Visit - Level 5,250.00,0.00,Denied,CO-11,Diagnosis inconsistent with procedure,2025-10-18,Dr. Susan Lee
CLM-044,Tricare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-10-19,Dr. Thomas Wright
CLM-045,Kaiser Permanente,90837,Psychotherapy 60min,175.00,145.00,Paid,,,2025-10-20,Dr. David Kim
CLM-046,Anthem,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-10-21,Dr. Kevin Patel
CLM-047,Molina Healthcare,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-16,Missing information,2025-10-22,Dr. Susan Lee
CLM-048,Tricare,99215,Office Visit - Level 5,250.00,250.00,Paid,,,2025-10-23,Dr. Thomas Wright
CLM-049,Kaiser Permanente,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-10-24,Dr. David Kim
CLM-050,Anthem,90834,Psychotherapy 45min,150.00,150.00,Paid,,,2025-10-25,Dr. Kevin Patel
CLM-051,UnitedHealthcare,99395,Preventive Visit 18-39,195.00,195.00,Paid,,,2025-10-26,Dr. Sarah Chen
CLM-052,Aetna,99396,Preventive Visit 40-64,210.00,0.00,Denied,CO-96,Non-covered charge,2025-10-27,Dr. James Wilson
CLM-053,Cigna,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-10-28,Dr. Lisa Park
CLM-054,Blue Cross,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-4,Missing modifier,2025-10-29,Dr. Michael Brown
CLM-055,Humana,99215,Office Visit - Level 5,250.00,0.00,Denied,CO-11,Diagnosis inconsistent with procedure,2025-10-30,Dr. Amy Rodriguez
CLM-056,UnitedHealthcare,90834,Psychotherapy 45min,150.00,140.00,Paid,,,2025-10-31,Dr. Sarah Chen
CLM-057,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-11-01,Dr. James Wilson
CLM-058,Cigna,99395,Preventive Visit 18-39,195.00,195.00,Paid,,,2025-11-02,Dr. Lisa Park
CLM-059,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-11-03,Dr. Michael Brown
CLM-060,Humana,99213,Office Visit - Level 3,125.00,125.00,Paid,,,2025-11-04,Dr. Amy Rodriguez
CLM-061,Kaiser Permanente,99214,Office Visit - Level 4,185.00,160.00,Paid,,,2025-11-05,Dr. David Kim
CLM-062,Anthem,99215,Office Visit - Level 5,250.00,0.00,Denied,PR-1,Deductible not met,2025-11-06,Dr. Kevin Patel
CLM-063,Molina Healthcare,90837,Psychotherapy 60min,175.00,0.00,Denied,CO-4,Missing modifier,2025-11-07,Dr. Susan Lee
CLM-064,Tricare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-11-08,Dr. Thomas Wright
CLM-065,UnitedHealthcare,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-18,Duplicate claim,2025-11-09,Dr. Sarah Chen
CLM-066,Aetna,99213,Office Visit - Level 3,125.00,105.00,Paid,,,2025-11-10,Dr. James Wilson
CLM-067,Cigna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-11-11,Dr. Lisa Park
CLM-068,Blue Cross,90834,Psychotherapy 45min,150.00,150.00,Paid,,,2025-11-12,Dr. Michael Brown
CLM-069,Humana,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-11-13,Dr. Amy Rodriguez
CLM-070,Kaiser Permanente,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-16,Missing information,2025-11-14,Dr. David Kim
CLM-071,Anthem,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-11-15,Dr. Kevin Patel
CLM-072,Molina Healthcare,99215,Office Visit - Level 5,250.00,0.00,Denied,CO-11,Diagnosis inconsistent with procedure,2025-11-16,Dr. Susan Lee
CLM-073,Tricare,90837,Psychotherapy 60min,175.00,175.00,Paid,,,2025-11-17,Dr. Thomas Wright
CLM-074,UnitedHealthcare,99396,Preventive Visit 40-64,210.00,210.00,Paid,,,2025-11-18,Dr. Sarah Chen
CLM-075,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-11-19,Dr. James Wilson
CLM-076,Cigna,99213,Office Visit - Level 3,125.00,125.00,Paid,,,2025-11-20,Dr. Lisa Park
CLM-077,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-29,Filing deadline exceeded,2025-11-21,Dr. Michael Brown
CLM-078,Humana,99215,Office Visit - Level 5,250.00,220.00,Paid,,,2025-11-22,Dr. Amy Rodriguez
CLM-079,Kaiser Permanente,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-11-23,Dr. David Kim
CLM-080,Anthem,90837,Psychotherapy 60min,175.00,0.00,Denied,CO-197,Missing prior authorization,2025-11-24,Dr. Kevin Patel
CLM-081,Molina Healthcare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-11-25,Dr. Susan Lee
CLM-082,Tricare,99213,Office Visit - Level 3,125.00,0.00,Denied,PR-1,Deductible not met,2025-11-26,Dr. Thomas Wright
CLM-083,UnitedHealthcare,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-11-27,Dr. Sarah Chen
CLM-084,Aetna,99395,Preventive Visit 18-39,195.00,195.00,Paid,,,2025-11-28,Dr. James Wilson
CLM-085,Cigna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-11-29,Dr. Lisa Park
CLM-086,Blue Cross,99215,Office Visit - Level 5,250.00,250.00,Paid,,,2025-11-30,Dr. Michael Brown
CLM-087,Humana,90834,Psychotherapy 45min,150.00,0.00,Denied,CO-16,Missing information,2025-12-01,Dr. Amy Rodriguez
CLM-088,Kaiser Permanente,99213,Office Visit - Level 3,125.00,125.00,Paid,,,2025-12-02,Dr. David Kim
CLM-089,Anthem,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-12-03,Dr. Kevin Patel
CLM-090,Molina Healthcare,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-11,Diagnosis inconsistent with procedure,2025-12-04,Dr. Susan Lee
CLM-091,Tricare,99215,Office Visit - Level 5,250.00,250.00,Paid,,,2025-12-05,Dr. Thomas Wright
CLM-092,UnitedHealthcare,90837,Psychotherapy 60min,175.00,150.00,Paid,,,2025-12-06,Dr. Sarah Chen
CLM-093,Aetna,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-4,Missing modifier,2025-12-07,Dr. James Wilson
CLM-094,Cigna,99213,Office Visit - Level 3,125.00,0.00,Denied,PR-1,Deductible not met,2025-12-08,Dr. Lisa Park
CLM-095,Blue Cross,99214,Office Visit - Level 4,185.00,0.00,Denied,CO-197,Missing prior authorization,2025-12-09,Dr. Michael Brown
CLM-096,Humana,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-12-10,Dr. Amy Rodriguez
CLM-097,Kaiser Permanente,99396,Preventive Visit 40-64,210.00,0.00,Denied,CO-96,Non-covered charge,2025-12-11,Dr. David Kim
CLM-098,Anthem,99214,Office Visit - Level 4,185.00,155.00,Paid,,,2025-12-12,Dr. Kevin Patel
CLM-099,Molina Healthcare,99213,Office Visit - Level 3,125.00,0.00,Denied,CO-4,Missing modifier,2025-12-13,Dr. Susan Lee
CLM-100,Tricare,99214,Office Visit - Level 4,185.00,185.00,Paid,,,2025-12-14,Dr. Thomas Wright`
