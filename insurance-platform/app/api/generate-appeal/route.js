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
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are an expert medical billing specialist writing a formal appeal letter for a denied insurance claim.
Claim Details:
- Claim Number: ${body.claim_number}
- Date of Service: ${body.date_of_service}
- CPT Code: ${body.cpt_code} (${body.cpt_description})
- Amount Billed: $${body.amount_billed}
- Denial Reason: ${body.denial_reason_code} - ${body.denial_reason}

Patient:
- Name: ${body.patient_name}
- DOB: ${body.date_of_birth}
- Member ID: ${body.member_id}
- Insurance: ${body.insurance_company}

Provider:
- Name: ${body.provider_name} (NPI: ${body.provider_npi})
- Facility: ${body.facility_name} (NPI: ${body.facility_npi})

Additional Context: ${body.additional_context || 'None provided'}

Write a professional, formal appeal letter that:
1. Is addressed to the insurance company's appeals department
2. Clearly references the claim number, patient, and denial reason
3. Provides a strong medical justification for why the denial should be overturned
4. Cites relevant medical coding guidelines or payer policies where applicable
5. Requests a specific action (reconsideration, reprocessing, etc.)
6. Includes a professional closing with the provider's signature block

Return ONLY the letter text, no JSON, no markdown formatting. Use proper business letter format.`,
          },
        ],
      }),
    })

    const data = await response.json()
    const letter = data.content[0].text.trim()
    return Response.json({ letter })

  } catch (err) {
    console.error('Appeal generation error:', err)
    return Response.json({ error: 'Failed to generate appeal letter' }, { status: 500 })
  }
}