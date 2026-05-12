# AI-Powered Medical Billing Platform
A full-stack demo platform built to showcase AI-driven workflows for medical insurance billing, eligibility verification, denial analytics, and appeal letter generation.

**Live Demo:** https://demo-insurance-app.vercel.app

## Overview
Healthcare providers spend tens of hours weekly on insurance-related administrative tasks — calling insurance companies, verifying patient coverage, tracking denied claims, and drafting appeal letters. This platform demonstrates how AI can automate and streamline these workflows.
The application covers three core pillars of medical billing :
1. **Pre-appointment** — Verify patient insurance coverage before they arrive
2. **Post-denial analysis** — Identify why claims are being denied and quantify lost revenue
3. **Recovery** — Generate professional appeal letters to overturn denied claims

## Features

### 🛡️ Eligibility & Benefits Verification
- **Insurance Card OCR** — Upload a photo of an insurance card and AI (Claude Vision) automatically extracts Member ID, Group Number, Plan Name, and Insurance Company
- **Manual Case Creation** — Full form with Patient Details, Insurance Details, Provider/Facility (with NPI), and Requested Service information
- **Bulk CSV Upload** — Import multiple eligibility checks at once with validation for required fields, date integrity, and format normalization
- **AI-Simulated Voice Agent Call** — Click "Place Call" to simulate an AI agent calling the insurance company. The call follows a realistic HIPAA-compliant flow:
  - Insurance rep answers
  - AI agent verifies facility name + NPI, provider name + NPI
  - Patient details confirmed (name, DOB, member ID)
  - Benefits returned: Annual Deductible, Out-of-Pocket Maximum, Copay breakdown, Coverage status
  - Whether the specific CPT code/service is covered
- **Chat-style Transcript** — Call transcript displayed with blue bubbles (AI Agent) and white bubbles (Insurance Rep)
- **Persistent Results** — Call results saved to database; revisiting a case shows previous results
- **Edit / Delete / Redo Call** — Full CRUD operations on each eligibility check
- **Search, Sort, Filter** — Search across patient name, insurance, member ID, physician; sortable column headers
- **Stats Dashboard** — Real-time counts of Pending, Verified, and Not Covered checks
- **Template Download** — Download a pre-populated CSV template with 30 sample records

### 📊 Revenue Analytics

- **Claims Data Upload** — Upload a CSV/Excel of claims data with payer, CPT codes, amounts, denial reasons
- **Denial Rate by Payer** — Bar chart showing which insurance companies deny the most claims
- **Denials by Reason** — Pie chart breaking down denial reason codes (CO-4, CO-197, PR-1, etc.)
- **Denial Rate by CPT Code** — Table showing which procedure codes have the highest denial rates
- **Underpayment Detection** — Compares actual payments against Medicare baseline rates to flag underpaid claims
- **"Fix These 3 Things" Hero Callout** — Actionable insight showing the top 3 denial reasons and estimated revenue recovery
- **Summary Stats** — Total Billed, Total Denied, Underpayments Detected, Total Recoverable Revenue
- **Excel Report Export** — Download a multi-sheet Excel workbook with Summary, By Payer, By CPT Code, By Reason, Underpayments, and All Claims sheets
- **Template Download** — Download a 100-record sample claims CSV

### 📝 Appeal Letter Generator

- **Case Management** — Create, edit, delete appeal cases with full claim details (CPT code, denial reason code, amounts, provider/facility info)
- **Bulk CSV Upload** — Import multiple denied claims for batch appeal processing
- **AI-Generated Appeal Letters** — Claude generates professional, formal appeal letters that:
  - Reference the specific claim number, patient, and denial reason
  - Provide medical justification for overturning the denial
  - Cite relevant coding guidelines and payer policies
  - Include proper business letter formatting with provider signature block
- **Copy / Download / Regenerate** — One-click copy to clipboard, download as .txt, or regenerate with updated context
- **Status Tracking** — Cases show "Pending" or "Letter Generated" status
- **Search, Sort, Filter** — Full search and sortable columns

### General Platform Features
- **Authentication** — Email/password signup and login via Supabase Auth
- **Row Level Security** — Each user only sees their own data
- **Custom UI Modals** — Clean modal dialogs instead of browser alerts/confirms
- **Responsive Design** — Fixed sidebar with scrollable content area
- **Real-time Stats** — Dashboard counters update as data changes
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

## Demo Walkthrough

### Eligibility & Benefits
1. Upload the sample CSV template (30 records) or create a manual entry with sample insurance card OCR
2. Click any row to view full patient/insurance/provider details
3. Click "Place Call" to simulate an AI agent calling the insurance company
4. View the chat-style transcript, benefit cards, copay breakdown, and coverage status

### Revenue Analytics
1. Download the sample claims template (100 records) and upload it
2. View denial rates by payer and by reason code with interactive charts
3. See the "Fix these 3 things" actionable insight with estimated revenue recovery
4. Check the underpayment detection table comparing actual payments vs Medicare baselines
5. Download the full Excel report

### Appeal Letter Generator
1. Upload the sample appeals template (30 records) or create a case manually
2. Click any case to view denial details
3. Click "Generate Appeal Letter" to get an AI-drafted professional appeal
4. Copy, download, or regenerate the letter

---

## Domain Context

This platform uses real medical billing terminology and codes:
- **CPT Codes** — Current Procedural Terminology codes (99213, 99214, 99215 for office visits; 90837 for psychotherapy)
- **CARC Codes** — Claim Adjustment Reason Codes (CO-4: Missing modifier, CO-197: Missing prior auth, PR-1: Deductible not met)
- **NPI** — National Provider Identifier (10-digit number required for HIPAA-compliant insurance verification)
- **Medicare Baseline Rates** — CMS-published fee schedules used as a benchmark for underpayment detection
---
