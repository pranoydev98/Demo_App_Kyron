'use client'
import { useState } from 'react'

const DENIAL_REASONS = [
  { code: 'CO-4', reason: 'Missing modifier' },
  { code: 'CO-16', reason: 'Missing or incomplete information' },
  { code: 'CO-18', reason: 'Duplicate claim' },
  { code: 'CO-29', reason: 'Filing deadline exceeded' },
  { code: 'CO-50', reason: 'Non-covered service' },
  { code: 'CO-197', reason: 'Missing prior authorization' },
  { code: 'PR-1', reason: 'Deductible not met' },
  { code: 'PR-2', reason: 'Coinsurance amount' },
  { code: 'PR-3', reason: 'Copay amount' },
  { code: 'CO-11', reason: 'Diagnosis inconsistent with procedure' },
  { code: 'CO-15', reason: 'Authorization number missing or invalid' },
  { code: 'CO-96', reason: 'Non-covered charge' },
]

const CPT_CODES = [
  { code: '99211', desc: 'Office Visit - Level 1' },
  { code: '99212', desc: 'Office Visit - Level 2' },
  { code: '99213', desc: 'Office Visit - Level 3' },
  { code: '99214', desc: 'Office Visit - Level 4' },
  { code: '99215', desc: 'Office Visit - Level 5' },
  { code: '90837', desc: 'Psychotherapy 60min' },
  { code: '90834', desc: 'Psychotherapy 45min' },
  { code: '99395', desc: 'Preventive Visit 18-39' },
  { code: '99396', desc: 'Preventive Visit 40-64' },
  { code: '99385', desc: 'New Patient Preventive 18-39' },
]

export default function AppealsTab() {
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [form, setForm] = useState({
    patient_name: '',
    date_of_birth: '',
    member_id: '',
    insurance_company: '',
    claim_number: '',
    date_of_service: '',
    cpt_code: '',
    denial_reason_code: '',
    amount_billed: '',
    provider_name: '',
    provider_npi: '',
    facility_name: '',
    facility_npi: '',
    additional_context: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const selectedDenial = DENIAL_REASONS.find(d => d.code === form.denial_reason_code)
  const selectedCPT = CPT_CODES.find(c => c.code === form.cpt_code)

  const handleGenerate = async () => {
    setLoading(true)
    setLetter('')
    try {
      const response = await fetch('/api/generate-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          denial_reason: selectedDenial?.reason || '',
          cpt_description: selectedCPT?.desc || '',
        }),
      })
      const result = await response.json()
      setLetter(result.letter)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    alert('Letter copied to clipboard!')
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelClass = "text-xs text-gray-500 mb-1 block font-medium"

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Appeal Letter Generator</h2>
      <p className="text-gray-500 text-sm mb-8">AI-drafted appeal letters for denied claims</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="flex flex-col gap-4">
          {/* Claim Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Claim Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Claim Number *</label>
                <input name="claim_number" value={form.claim_number} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Service *</label>
                <input type="date" name="date_of_service" value={form.date_of_service} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>CPT Code *</label>
                <select name="cpt_code" value={form.cpt_code} onChange={handleChange} className={inputClass}>
                  <option value="">Select...</option>
                  {CPT_CODES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.desc}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Amount Billed *</label>
                <input type="number" name="amount_billed" placeholder="$" value={form.amount_billed} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Denial Reason Code *</label>
              <select name="denial_reason_code" value={form.denial_reason_code} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                {DENIAL_REASONS.map(d => <option key={d.code} value={d.code}>{d.code} - {d.reason}</option>)}
              </select>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Patient Name *</label>
                <input name="patient_name" value={form.patient_name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Insurance Company *</label>
                <input name="insurance_company" value={form.insurance_company} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Member ID *</label>
                <input name="member_id" value={form.member_id} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Provider & Facility</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Provider Name *</label>
                <input name="provider_name" value={form.provider_name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Provider NPI *</label>
                <input name="provider_npi" value={form.provider_npi} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Facility Name *</label>
                <input name="facility_name" value={form.facility_name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Facility NPI *</label>
                <input name="facility_npi" value={form.facility_npi} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Additional Context</h3>
            <textarea name="additional_context" value={form.additional_context} onChange={handleChange}
              placeholder="Any additional details to support the appeal (e.g., medical necessity, prior auth was obtained but not attached, modifier was submitted correctly, etc.)"
              rows={4} className={inputClass} />
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? '✍️ Generating appeal letter...' : '✍️ Generate Appeal Letter'}
          </button>
        </div>

        {/* Right: Generated Letter */}
        <div className="flex flex-col">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
            {!letter && !loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-5xl mb-4">📝</span>
                <p className="text-sm">Fill in the claim details and click Generate</p>
                <p className="text-xs mt-1">Your AI-drafted appeal letter will appear here</p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-5xl mb-4 animate-pulse">✍️</span>
                <p className="text-sm">Drafting your appeal letter...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Generated Appeal Letter</h3>
                  <div className="flex gap-2">
                    <button onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                      📋 Copy
                    </button>
                    <button onClick={() => {
                      const blob = new Blob([letter], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url; a.download = `appeal_${form.claim_number || 'letter'}.txt`
                      a.click()
                    }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                      ⬇️ Download
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-4">
                  {letter}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}