export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `You are simulating a medical billing AI agent that just completed a phone call with an insurance company to verify eligibility and benefits.

Patient: ${body.patient_name}
Date of Birth: ${body.date_of_birth}
Insurance Company: ${body.insurance_company}
Member ID: ${body.member_id}
Group Number: ${body.group_number || 'N/A'}
Plan: ${body.plan_name || 'N/A'}
Facility: ${body.facility} (NPI: ${body.facility_npi})
Provider: ${body.physician} (NPI: ${body.physician_npi})
Date of Service: ${body.date_of_service}
CPT Codes: ${body.cpt_codes || 'N/A'}

Generate a realistic eligibility verification result. Return ONLY a JSON object with no explanation or markdown:
{
  "coverage_status": "Active",
  "summary": "2-3 sentence summary of the verification call",
  "next_steps": "1-2 sentences on recommendations",
  "transcript": "Realistic 12-15 line transcript as described below",
  "benefits": {
    "annual_deductible": { "total": 5000, "remaining": 1200 },
    "out_of_pocket_max": { "total": 10000, "remaining": 6500 },
    "copay": { "office_visit": 30, "urgent_care": 50, "emergency_room": 300 },
    "coverage_level": "Individual",
    "network_status": "In-Network",
    "service_covered": "Covered"
  }
}

IMPORTANT - The transcript MUST follow this exact flow:
1. Insurance rep answers: "Thank you for calling [insurance company] provider services, how can I help you?"
2. AI agent introduces themselves: "Hi, this is [agent name] calling from [facility] to verify eligibility and benefits for an upcoming patient visit." And asks what next information is required for HIPAA verification
3. Insurance rep asks for facility name and NPI for verification
4. AI provides facility name and NPI: ${body.facility} (NPI: ${body.facility_npi})
4.5) Insurance rep asks for provider name and NPI for verification
5. AI provides provider name and NPI: ${body.physician} (NPI: ${body.physician_npi})
6. Rep confirms verification and asks for patient details
7. AI provides patient name, DOB, and member ID
8. Rep confirms patient is found and shares eligibility status, and tell if In network or out of network
9. Rep shares benefit details (deductible, OOP max, copay)
10. AI asks about coverage for the specific CPT codes
11. Rep confirms and shares details about coverage status
12. Closing

CRITICAL: The AI agent is PLACING the call TO the insurance company. The insurance rep is the one who ANSWERS. The AI agent should never say "thank you for calling" - that is what the insurance rep says when answering.

Use realistic dollar amounts. coverage_status should be "Active" or "Inactive". service_covered should be "Covered" or "Not Covered".`,
          },
        ],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return Response.json(parsed)

  } catch (err) {
    console.error('Eligibility call error:', err)
    return Response.json({ error: 'Call simulation failed' }, { status: 500 })
  }
}
