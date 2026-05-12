export const SAMPLE_ELIGIBILITY_CSV = `first_name,last_name,date_of_birth,sex,phone,insurance_company,member_id,group_number,plan_name,network_type,date_of_service,facility,facility_npi,physician,physician_npi,cpt_codes,place_of_service
John,Smith,1985-03-15,Male,555-0101,UnitedHealthcare,UHC-889012,GRP-44521,Gold PPO,PPO,2026-02-15,Metro General Hospital,1234567890,Dr. Sarah Chen,9876543210,99213,Office
Maria,Garcia,1992-07-22,Female,555-0102,Aetna,AET-556789,GRP-88234,Silver HMO,HMO,2026-02-16,Riverside Medical Center,1122334455,Dr. James Wilson,5566778899,99214,Office
Robert,Johnson,1978-11-30,Male,555-0103,Cigna,CIG-334567,GRP-77123,Platinum PPO,PPO,2026-02-17,St. Mary's Hospital,2233445566,Dr. Lisa Park,6677889900,99215,Outpatient Hospital
Emily,Davis,2001-01-08,Female,555-0104,Blue Cross,BCB-778901,GRP-55678,Bronze EPO,EPO,2026-02-18,Valley Health Center,3344556677,Dr. Michael Brown,7788990011,99213,Telehealth
William,Taylor,1968-05-19,Male,555-0105,Humana,HUM-112345,GRP-99012,Gold HMO,HMO,2026-02-19,Pacific Medical Group,4455667788,Dr. Amy Rodriguez,8899001122,90837,Office
Sarah,Martinez,1990-03-25,Female,555-0106,Kaiser Permanente,KP-445566,GRP-33210,Silver PPO,PPO,2026-02-20,Sunnyvale Community Hospital,5566778800,Dr. David Kim,9900112233,99214,Emergency Room
James,Anderson,1955-12-01,Male,555-0107,Medicare,MCR-998877,GRP-11200,Medicare Advantage,HMO,2026-02-21,Veterans Memorial Hospital,6677889911,Dr. Rachel Green,1011121314,99215,Inpatient Hospital
Linda,Thomas,1983-09-14,Female,555-0108,Anthem,ANT-667788,GRP-44300,Gold PPO,PPO,2026-02-22,Lakeside Medical Center,7788990022,Dr. Kevin Patel,1213141516,99213,Office
Carlos,Hernandez,1975-06-28,Male,555-0109,Molina Healthcare,MOL-223344,GRP-77500,Medicaid Managed,HMO,2026-02-23,Central Valley Clinic,8899001133,Dr. Susan Lee,1314151617,90834,Ambulatory Surgical Center
Patricia,Wilson,1998-02-10,Female,555-0110,Tricare,TRI-889900,GRP-66100,Prime Select,PPO,2026-02-24,Fort Sam Medical Center,9900112244,Dr. Thomas Wright,1415161718,99395,Office
David,Lee,1988-06-15,Male,555-0111,UnitedHealthcare,UHC-223344,GRP-44522,Platinum PPO,PPO,2026-02-25,Northside Medical Center,1234567891,Dr. Sarah Chen,9876543210,99214,Office
Jennifer,Brown,1995-04-20,Female,555-0112,Aetna,AET-889900,GRP-88235,Gold HMO,HMO,2026-02-26,Riverside Medical Center,1122334455,Dr. James Wilson,5566778899,90837,Office
Michael,Chen,1970-08-03,Male,555-0113,Cigna,CIG-556677,GRP-77124,Silver PPO,PPO,2026-02-27,St. Mary's Hospital,2233445566,Dr. Lisa Park,6677889900,99215,Outpatient Hospital
Amanda,White,1982-01-28,Female,555-0114,Blue Cross,BCB-990011,GRP-55679,Gold EPO,EPO,2026-02-28,Valley Health Center,3344556677,Dr. Michael Brown,7788990011,99213,Telehealth
Thomas,Garcia,1960-11-12,Male,555-0115,Humana,HUM-445566,GRP-99013,Silver HMO,HMO,2026-03-01,Pacific Medical Group,4455667788,Dr. Amy Rodriguez,8899001122,99214,Office
Rachel,Kim,1993-05-07,Female,555-0116,Kaiser Permanente,KP-112233,GRP-33211,Gold PPO,PPO,2026-03-02,Sunnyvale Community Hospital,5566778800,Dr. David Kim,9900112233,90834,Office
Steven,Moore,1972-09-19,Male,555-0117,Anthem,ANT-334455,GRP-44301,Platinum PPO,PPO,2026-03-03,Veterans Memorial Hospital,6677889911,Dr. Rachel Green,1011121314,99215,Inpatient Hospital
Lisa,Jackson,1987-12-30,Female,555-0118,Molina Healthcare,MOL-556677,GRP-77501,Medicaid Managed,HMO,2026-03-04,Lakeside Medical Center,7788990022,Dr. Kevin Patel,1213141516,99213,Office
Daniel,Martinez,1965-03-22,Male,555-0119,Tricare,TRI-778899,GRP-66101,Prime Remote,PPO,2026-03-05,Central Valley Clinic,8899001133,Dr. Susan Lee,1314151617,99214,Office
Karen,Taylor,1991-07-14,Female,555-0120,UnitedHealthcare,UHC-990011,GRP-44523,Gold PPO,PPO,2026-03-06,Fort Sam Medical Center,9900112244,Dr. Thomas Wright,1415161718,90837,Office
Brian,Nguyen,1980-10-05,Male,555-0121,Aetna,AET-112233,GRP-88236,Bronze HMO,HMO,2026-03-07,Metro General Hospital,1234567890,Dr. Sarah Chen,9876543210,99214,Emergency Room
Angela,Robinson,1997-02-18,Female,555-0122,Cigna,CIG-889900,GRP-77125,Gold PPO,PPO,2026-03-08,Riverside Medical Center,1122334455,Dr. James Wilson,5566778899,99213,Office
Mark,Thompson,1963-06-09,Male,555-0123,Blue Cross,BCB-223344,GRP-55680,Silver EPO,EPO,2026-03-09,St. Mary's Hospital,2233445566,Dr. Lisa Park,6677889900,99215,Outpatient Hospital
Nicole,Harris,1989-08-27,Female,555-0124,Humana,HUM-667788,GRP-99014,Platinum HMO,HMO,2026-03-10,Valley Health Center,3344556677,Dr. Michael Brown,7788990011,90834,Office
George,Clark,1958-04-14,Male,555-0125,Medicare,MCR-445566,GRP-11201,Medicare Supplement,PPO,2026-03-11,Pacific Medical Group,4455667788,Dr. Amy Rodriguez,8899001122,99214,Office
Stephanie,Lewis,1994-11-03,Female,555-0126,Kaiser Permanente,KP-334455,GRP-33212,Silver HMO,HMO,2026-03-12,Sunnyvale Community Hospital,5566778800,Dr. David Kim,9900112233,99213,Telehealth
Richard,Walker,1976-01-20,Male,555-0127,Anthem,ANT-556677,GRP-44302,Gold PPO,PPO,2026-03-13,Veterans Memorial Hospital,6677889911,Dr. Rachel Green,1011121314,99215,Inpatient Hospital
Michelle,Hall,1986-09-08,Female,555-0128,Molina Healthcare,MOL-778899,GRP-77502,Medicaid Managed,HMO,2026-03-14,Lakeside Medical Center,7788990022,Dr. Kevin Patel,1213141516,99214,Office
Kevin,Allen,1971-12-16,Male,555-0129,Tricare,TRI-990011,GRP-66102,Prime Select,PPO,2026-03-15,Central Valley Clinic,8899001133,Dr. Susan Lee,1314151617,90837,Ambulatory Surgical Center
Laura,Young,2000-05-30,Female,555-0130,UnitedHealthcare,UHC-556677,GRP-44524,Bronze PPO,PPO,2026-03-16,Fort Sam Medical Center,9900112244,Dr. Thomas Wright,1415161718,99395,Office`
