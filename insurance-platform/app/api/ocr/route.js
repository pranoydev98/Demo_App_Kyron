export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = file.type || 'image/jpeg'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: `This is a health insurance card. Extract the following fields and return ONLY a JSON object with no explanation or markdown:
{
  "insurance_company": "",
  "member_id": "",
  "group_number": "",
  "plan_name": "",
  "insurance_phone": "",
  "group_name": "",
  "insurance_start_date": "",
  "insurance_end_date": ""
}
For insurance_company, use the PRIMARY issuer name (the most prominent company name on the card).
For dates, format as YYYY-MM-DD.
If a field is not visible on the card, leave it as an empty string.`,
              },
            ],
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
    console.error('OCR error:', err)
    return Response.json({ error: 'OCR failed' }, { status: 500 })
  }
}