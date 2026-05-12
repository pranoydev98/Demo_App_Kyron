# AI-Powered Medical Billing Platform
A full-stack demo platform built to showcase AI-driven workflows for medical insurance billing, eligibility verification, denial analytics, and appeal letter generation.

**Live Demo:** https://demo-insurance-app.vercel.app

## Overview
Healthcare providers spend hours weekly on insurance-related administrative tasks, This platform demonstrates on how AI can automate and streamline these workflows.
The application covers few important aspects of medical billing :
1. **Pre-appointment** — Verify patient insurance coverage before they arrive
2. **Post-denial analysis** — Identify why claims are being denied and quantify lost revenue
3. **Recovery** — Generate professional appeal letters to overturn denied claims

## Features

### 🛡️ Eligibility & Benefits Verification
- **Insurance Card OCR**
- **Manual Case Creation**
- **Bulk CSV Upload**
- **AI-Simulated Voice Agent Call**
- **Chat-style Transcript**
- **Persistent Results**
- **Edit / Delete / Redo Call**
- **Search, Sort, Filter**
- **Stats Dashboard**
- **Template Download**

### 📊 Revenue Analytics
- **Claims Data Upload**
- **Denial Rate by Payer**
- **Denials by Reason**
- **Denial Rate by CPT Code**
- **Underpayment Detection**
- **"Fix These 3 Things" Callout**
- **Summary Stats**
- **Excel Report Export**
- **Template Download**

### 📝 Appeal Letter Generator
- **Case Management**
- **Bulk CSV Upload**
- **AI-Generated Appeal Letters**
- **Copy / Download / Regenerate**
- **Status Tracking**
- **Search, Sort, Filter**

### General Platform Features
- **Authentication**
- **Row Level Security**
- **Custom UI Modals**
- **Responsive Design**
- **Real-time Stats**
---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | Supabase Auth (email/password) |
| AI / OCR | Anthropic Claude API (Vision for OCR, Text for call simulation & letter generation) |
| Charts | Recharts |
| File Parsing | SheetJS (xlsx), PapaParse |
| Deployment | Vercel |

## Project Structure
```
insurance-platform/
├── app/
│   ├── api/
│   │   ├── ocr/route.js              # Insurance card OCR via Claude Vision
│   │   ├── eligibility-call/route.js  # Simulated eligibility verification call
│   │   └── generate-appeal/route.js   # AI appeal letter generation
│   ├── dashboard/
│   │   ├── page.js                    # Main dashboard with Eligibility tab
│   │   ├── AnalyticsTab.js            # Revenue Analytics tab
│   │   ├── AppealsTab.js              # Appeal Letter Generator tab
│   │   ├── Modal.js                   # Reusable modal component
│   │   ├── sampleEligibilityData.js   # 30-row sample eligibility CSV data
│   │   ├── sampleAppealsData.js       # 30-row sample appeals CSV data
│   │   └── sampleClaimsData.js        # 100-row sample claims CSV data
│   ├── login/page.js                  # Login/Signup page
│   ├── layout.js                      # Root layout
│   ├── page.js                        # Root redirect (auth check)
│   └── globals.css                    # Global styles
├── lib/
│   ├── supabase.js                    # Supabase client (browser)
│   └── supabase-server.js             # Supabase client (server)
├── .env.local                         # Environment variables (not committed)
└── package.json
```

---
## Database Schema
### `eligibility_checks`
Stores patient eligibility verification cases and AI call results.
Key fields: patient info (name, DOB, sex), insurance info (company, member ID, group number, plan), provider/facility (name, NPI), service details (date, CPT codes), and AI-populated fields (call summary, transcript, benefits breakdown, coverage status).
### `appeal_cases`
Stores denied claim cases and generated appeal letters.
Key fields: patient info, claim details (number, CPT code, amount billed), denial info (reason code, reason), provider/facility details, additional context, and the generated appeal letter.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Anthropic API key (for Claude)

### Setup

1. Clone the repository
```bash
git clone https://github.com/pranoydev98/Demo_App_Kyron.git
cd Demo_App_Kyron/insurance-platform
npm install
```

2. Create a `.env.local` file
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

3. Set up Supabase tables (run in SQL Editor):
   - Create `eligibility_checks` table with patient, insurance, provider, service, and AI result columns
   - Create `appeal_cases` table with claim, patient, provider, and letter columns
   - Enable Row Level Security on both tables
   - Disable email confirmation in Auth settings for development

4. Run the development server
```bash
npm run dev
```

5. Open : http://localhost:3000
---
