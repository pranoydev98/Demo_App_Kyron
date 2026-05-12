'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

const DENIAL_REASONS = [
  { code: 'CO-4', reason: 'Missing modifier' },
  { code: 'CO-11', reason: 'Diagnosis inconsistent with procedure' },
  { code: 'CO-16', reason: 'Missing or incomplete information' },
  { code: 'CO-18', reason: 'Duplicate claim' },
  { code: 'CO-29', reason: 'Filing deadline exceeded' },
  { code: 'CO-50', reason: 'Non-covered service' },
  { code: 'CO-96', reason: 'Non-covered charge' },
  { code: 'CO-197', reason: 'Missing prior authorization' },
  { code: 'PR-1', reason: 'Deductible not met' },
  { code: 'PR-2', reason: 'Coinsurance amount' },
  { code: 'PR-3', reason: 'Copay amount' },
  { code: 'CO-15', reason: 'Authorization number missing or invalid' },
]

const CPT_CODES = [
  { code: '99211', desc: 'Office Visit - Level 1' },
  { code: '99212', desc: 'Office Visit - Level 2' },
  { code: '99213', desc: 'Office Visit - Level 3' },
  { code: '99214', desc: 'Office Visit - Level 4' },
  { code: '99215', desc: 'Office Visit - Level 5' },
  { code: '90834', desc: 'Psychotherapy 45min' },
  { code: '90837', desc: 'Psychotherapy 60min' },
  { code: '99395', desc: 'Preventive Visit 18-39' },
  { code: '99396', desc: 'Preventive Visit 40-64' },
]

export default function AppealsTab() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [tabKey, setTabKey] = useState(0)

  useEffect(() => { fetchCases() }, [tabKey])

  const fetchCases = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('appeal_cases')
      .select('*')
      .order('created_at', { ascending: false })
    setCases(data || [])
    setLoading(false)
  }

  if (selectedCase) {
    return <AppealDetail caseData={selectedCase} onBack={() => { setSelectedCase(null); fetchCases() }} />
  }

  if (showForm) {
    return <AppealForm onBack={() => setShowForm(false)} onCreated={() => { setShowForm(false); fetchCases() }} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Appeal Letter Generator</h2>
          <p className="text-gray-500 text-sm mt-1">AI-drafted appeal letters for denied claims</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => {
            const headers = 'patient_name,date_of_birth,member_id,insurance_company,claim_number,date_of_service,cpt_code,amount_billed,denial_reason_code,denial_reason,provider_name,provider_npi,facility_name,facility_npi,additional_context'
            const samples = `John Smith,1985-03-15,UHC-889012,UnitedHealthcare,CLM-2001,2025-11-03,99214,185.00,CO-4,Missing modifier,Dr. Sarah Chen,9876543210,Metro General Hospital,1234567890,Modifier 25 was included in original submission
Maria Garcia,1992-07-22,AET-556789,Aetna,CLM-2002,2025-11-04,99213,125.00,CO-197,Missing prior authorization,Dr. James Wilson,5566778899,Riverside Medical Center,1122334455,Prior auth was obtained - ref number PA-88432
Robert Johnson,1978-11-30,CIG-334567,Cigna,CLM-2003,2025-11-05,99215,250.00,CO-16,Missing or incomplete information,Dr. Lisa Park,6677889900,St. Mary's Hospital,2233445566,All required documentation was submitted with original claim
Emily Davis,2001-01-08,BCB-778901,Blue Cross,CLM-2004,2025-11-06,90837,175.00,CO-11,Diagnosis inconsistent with procedure,Dr. Michael Brown,7788990011,Valley Health Center,3344556677,Patient diagnosis F41.1 supports medical necessity for psychotherapy
William Taylor,1968-05-19,HUM-112345,Humana,CLM-2005,2025-11-07,99214,185.00,CO-18,Duplicate claim,Dr. Amy Rodriguez,8899001122,Pacific Medical Group,4455667788,This is not a duplicate - dates of service differ from original claim`
            const blob = new Blob([headers + '\n' + samples], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = 'appeals_template.csv'; a.click()
          }}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
            ⬇️ Template
          </button>
          <button onClick={() => document.getElementById('appeal-csv-upload').click()}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
            📁 Upload CSV
          </button>
          <input id="appeal-csv-upload" type="file" accept=".csv,.xlsx" className="hidden"
            onChange={(e) => handleAppealBulkUpload(e, fetchCases)} />
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition">
            + New Appeal Case
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Patient</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Insurance</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Claim #</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">CPT</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Denial Reason</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : cases.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No appeal cases yet. Create one or upload a CSV.</td></tr>
            ) : (
              cases.map(c => (
                <tr key={c.id} onClick={() => setSelectedCase(c)}
                  className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer transition">
                  <td className="px-4 py-3 font-medium">{c.patient_name}</td>
                  <td className="px-4 py-3">{c.insurance_company}</td>
                  <td className="px-4 py-3">{c.claim_number}</td>
                  <td className="px-4 py-3">{c.cpt_code}</td>
                  <td className="px-4 py-3">{c.denial_reason_code} - {c.denial_reason}</td>
                  <td className="px-4 py-3">${c.amount_billed}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === 'Letter Generated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function handleAppealBulkUpload(e, onDone) {
  const file = e.target.files[0]
  if (!file) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const reader = new FileReader()
  reader.onload = async (evt) => {
    try {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { raw: false })

      const mapped = rows.map(row => ({
        user_id: user.id,
        patient_name: row['patient_name'] || '',
        date_of_birth: row['date_of_birth'] || null,
        member_id: row['member_id'] || '',
        insurance_company: row['insurance_company'] || '',
        claim_number: row['claim_number'] || '',
        date_of_service: row['date_of_service'] || null,
        cpt_code: row['cpt_code'] || '',
        amount_billed: parseFloat(row['amount_billed']) || 0,
        denial_reason_code: row['denial_reason_code'] || '',
        denial_reason: row['denial_reason'] || '',
        provider_name: row['provider_name'] || '',
        provider_npi: row['provider_npi'] || '',
        facility_name: row['facility_name'] || '',
        facility_npi: row['facility_npi'] || '',
        additional_context: row['additional_context'] || '',
        status: 'Pending',
      }))

      const requiredFields = ['patient_name', 'member_id', 'insurance_company', 'claim_number', 'date_of_service', 'cpt_code', 'amount_billed', 'denial_reason_code', 'denial_reason', 'provider_name', 'provider_npi', 'facility_name', 'facility_npi','additional_context']
      const valid = mapped.filter(r => requiredFields.every(f => r[f]))
      const invalid = mapped.filter(r => requiredFields.some(f => !r[f]))

      if (valid.length === 0) {
        alert('No valid rows found. Check required fields.')
        return
      }
      if (invalid.length > 0) {
        const proceed = confirm(`${invalid.length} row(s) missing required fields will be skipped. Upload ${valid.length} valid row(s)?`)
        if (!proceed) return
      }

      // Normalize dates
      valid.forEach(r => {
        if (r.date_of_birth) { const d = new Date(r.date_of_birth); if (!isNaN(d)) r.date_of_birth = d.toISOString().split('T')[0] }
        if (r.date_of_service) { const d = new Date(r.date_of_service); if (!isNaN(d)) r.date_of_service = d.toISOString().split('T')[0] }
      })

      const { error } = await supabase.from('appeal_cases').insert(valid)
      if (error) alert('Upload error: ' + error.message)
      else { alert(`Successfully uploaded ${valid.length} appeal cases!`); onDone() }
    } catch (err) {
      alert('Failed to parse file: ' + err.message)
    }
  }
  reader.readAsArrayBuffer(file)
  e.target.value = ''
}

function AppealForm({ onBack, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    patient_name: '', date_of_birth: '', member_id: '', insurance_company: '',
    claim_number: '', date_of_service: '', cpt_code: '', amount_billed: '',
    denial_reason_code: '', provider_name: '', provider_npi: '',
    facility_name: '', facility_npi: '', additional_context: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const selectedDenial = DENIAL_REASONS.find(d => d.code === form.denial_reason_code)

  const handleSubmit = async () => {
    const required = [
      ['patient_name', 'Patient Name'], ['date_of_birth', 'Date of Birth'],
      ['member_id', 'Member ID'], ['insurance_company', 'Insurance Company'],
      ['claim_number', 'Claim Number'], ['date_of_service', 'Date of Service'],
      ['cpt_code', 'CPT Code'], ['amount_billed', 'Amount Billed'],
      ['denial_reason_code', 'Denial Reason'], ['provider_name', 'Provider Name'],
      ['provider_npi', 'Provider NPI'], ['facility_name', 'Facility Name'],
      ['facility_npi', 'Facility NPI'],['additional_context', 'Additional Context']
    ]
    const missing = required.filter(([key]) => !form[key]?.toString().trim())
    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.map(([_, l]) => l).join(', ')}`)
      return
    }
    if (new Date(form.date_of_birth) >= new Date(form.date_of_service)) {
      setError('Date of Birth must be before Date of Service')
      return
    }

    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('appeal_cases').insert({
      ...form,
      date_of_birth: form.date_of_birth || null,
      date_of_service: form.date_of_service || null,
      amount_billed: parseFloat(form.amount_billed) || 0,
      denial_reason: selectedDenial?.reason || '',
      user_id: user.id,
    })

    if (error) setError(error.message)
    else onCreated()
    setLoading(false)
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelClass = "text-xs text-gray-500 mb-1 block font-medium"

  return (
    <div className="max-w-3xl">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-6">← Back to list</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">New Appeal Case</h2>
      <p className="text-gray-500 text-sm mb-8">Enter the denied claim details</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Claim Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Claim Number *</label><input name="claim_number" value={form.claim_number} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Date of Service *</label><input type="date" name="date_of_service" value={form.date_of_service} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>CPT Code *</label>
            <select name="cpt_code" value={form.cpt_code} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              {CPT_CODES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.desc}</option>)}
            </select>
          </div>
          <div><label className={labelClass}>Amount Billed *</label><input type="number" name="amount_billed" placeholder="$" value={form.amount_billed} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Denial Reason Code *</label>
          <select name="denial_reason_code" value={form.denial_reason_code} onChange={handleChange} className={inputClass}>
            <option value="">Select...</option>
            {DENIAL_REASONS.map(d => <option key={d.code} value={d.code}>{d.code} - {d.reason}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Patient Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Patient Name *</label><input name="patient_name" value={form.patient_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Date of Birth *</label><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className={labelClass}>Insurance Company *</label><input name="insurance_company" value={form.insurance_company} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Member ID *</label><input name="member_id" value={form.member_id} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Provider & Facility</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Provider Name *</label><input name="provider_name" value={form.provider_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Provider NPI *</label><input name="provider_npi" value={form.provider_npi} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className={labelClass}>Facility Name *</label><input name="facility_name" value={form.facility_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Facility NPI *</label><input name="facility_npi" value={form.facility_npi} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Additional Context *</h3>
        <textarea name="additional_context" value={form.additional_context} onChange={handleChange}
          placeholder="Please provide additional details to support the appeal (e.g., prior auth was obtained, modifier was included, documentation attached...)"
          rows={4} className={inputClass} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 mb-8">
        {loading ? 'Creating...' : 'Create Appeal Case'}
      </button>
    </div>
  )
}

function AppealDetail({ caseData, onBack }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...caseData })
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [letter, setLetter] = useState(caseData.appeal_letter || '')

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this appeal case?')) return
    await supabase.from('appeal_cases').delete().eq('id', caseData.id)
    onBack()
  }

  const handleSave = async () => {
    setSaving(true)
    const selectedDenial = DENIAL_REASONS.find(d => d.code === editForm.denial_reason_code)
    const { error } = await supabase.from('appeal_cases').update({
      patient_name: editForm.patient_name,
      date_of_birth: editForm.date_of_birth || null,
      member_id: editForm.member_id,
      insurance_company: editForm.insurance_company,
      claim_number: editForm.claim_number,
      date_of_service: editForm.date_of_service || null,
      cpt_code: editForm.cpt_code,
      amount_billed: parseFloat(editForm.amount_billed) || 0,
      denial_reason_code: editForm.denial_reason_code,
      denial_reason: selectedDenial?.reason || editForm.denial_reason,
      provider_name: editForm.provider_name,
      provider_npi: editForm.provider_npi,
      facility_name: editForm.facility_name,
      facility_npi: editForm.facility_npi,
      additional_context: editForm.additional_context,
    }).eq('id', caseData.id)

    if (!error) {
      Object.assign(caseData, editForm)
      if (DENIAL_REASONS.find(d => d.code === editForm.denial_reason_code)) {
        caseData.denial_reason = DENIAL_REASONS.find(d => d.code === editForm.denial_reason_code).reason
      }
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setLetter('')
    try {
      const response = await fetch('/api/generate-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...caseData,
          cpt_description: CPT_CODES.find(c => c.code === caseData.cpt_code)?.desc || '',
        }),
      })
      const result = await response.json()
      setLetter(result.letter)

      await supabase.from('appeal_cases').update({
        appeal_letter: result.letter,
        status: 'Letter Generated',
      }).eq('id', caseData.id)
      caseData.status = 'Letter Generated'

    } catch (err) {
      console.error(err)
    }
    setGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(letter)
    alert('Letter copied to clipboard!')
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-4xl">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-6">← Back to list</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{caseData.patient_name}</h2>
          <p className="text-gray-500 text-sm mt-1">{caseData.insurance_company} · Claim #{caseData.claim_number}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            caseData.status === 'Letter Generated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {caseData.status}
          </span>
          <button onClick={() => { setIsEditing(!isEditing); setEditForm({ ...caseData }) }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
            {isEditing ? '✕ Cancel' : '✏️ Edit'}
          </button>
          <button onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition">
            🗑️ Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Claim Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Claim Number</label><input name="claim_number" value={editForm.claim_number || ''} onChange={handleEditChange} className={inputClass} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Date of Service</label><input type="date" name="date_of_service" value={editForm.date_of_service || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">CPT Code</label>
                <select name="cpt_code" value={editForm.cpt_code || ''} onChange={handleEditChange} className={inputClass}>
                  <option value="">Select...</option>
                  {CPT_CODES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.desc}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-gray-500 mb-1 block">Amount Billed</label><input type="number" name="amount_billed" value={editForm.amount_billed || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
            <div className="mt-4">
              <label className="text-xs text-gray-500 mb-1 block">Denial Reason</label>
              <select name="denial_reason_code" value={editForm.denial_reason_code || ''} onChange={handleEditChange} className={inputClass}>
                <option value="">Select...</option>
                {DENIAL_REASONS.map(d => <option key={d.code} value={d.code}>{d.code} - {d.reason}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Patient Name</label><input name="patient_name" value={editForm.patient_name || ''} onChange={handleEditChange} className={inputClass} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Date of Birth</label><input type="date" name="date_of_birth" value={editForm.date_of_birth || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Insurance Company</label><input name="insurance_company" value={editForm.insurance_company || ''} onChange={handleEditChange} className={inputClass} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Member ID</label><input name="member_id" value={editForm.member_id || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Provider & Facility</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Provider Name</label><input name="provider_name" value={editForm.provider_name || ''} onChange={handleEditChange} className={inputClass} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Provider NPI</label><input name="provider_npi" value={editForm.provider_npi || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Facility Name</label><input name="facility_name" value={editForm.facility_name || ''} onChange={handleEditChange} className={inputClass} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Facility NPI</label><input name="facility_npi" value={editForm.facility_npi || ''} onChange={handleEditChange} className={inputClass} /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4">Additional Context</h3>
            <textarea name="additional_context" value={editForm.additional_context || ''} onChange={handleEditChange} rows={4} className={inputClass} />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Claim Information</h3>
              <InfoRow label="Claim Number" value={caseData.claim_number} />
              <InfoRow label="Date of Service" value={caseData.date_of_service} />
              <InfoRow label="CPT Code" value={`${caseData.cpt_code} - ${CPT_CODES.find(c => c.code === caseData.cpt_code)?.desc || ''}`} />
              <InfoRow label="Amount Billed" value={`$${caseData.amount_billed}`} />
              <InfoRow label="Denial Reason" value={`${caseData.denial_reason_code} - ${caseData.denial_reason}`} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Patient Information</h3>
              <InfoRow label="Patient Name" value={caseData.patient_name} />
              <InfoRow label="Date of Birth" value={caseData.date_of_birth} />
              <InfoRow label="Insurance" value={caseData.insurance_company} />
              <InfoRow label="Member ID" value={caseData.member_id} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-700 mb-3">Provider & Facility</h3>
              <InfoRow label="Provider" value={caseData.provider_name} />
              <InfoRow label="Provider NPI" value={caseData.provider_npi} />
              <InfoRow label="Facility" value={caseData.facility_name} />
              <InfoRow label="Facility NPI" value={caseData.facility_npi} />
            </div>
            {caseData.additional_context && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-3">Additional Context</h3>
                <p className="text-sm text-gray-600">{caseData.additional_context}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Generate Letter Section */}
      {!isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Appeal Letter</h3>
          <p className="text-sm text-blue-600 mb-6">
            Generate an AI-drafted appeal letter for {caseData.patient_name}'s denied claim
          </p>

          {!letter ? (
            <button onClick={handleGenerate} disabled={generating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {generating ? '✍️ Generating appeal letter...' : '✍️ Generate Appeal Letter'}
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button onClick={handleGenerate} disabled={generating}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 text-blue-600 hover:bg-blue-50 transition">
                    🔄 Regenerate
                  </button>
                  <button onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                    📋 Copy
                  </button>
                  <button onClick={() => {
                    const blob = new Blob([letter], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url; a.download = `appeal_${caseData.claim_number || 'letter'}.txt`; a.click()
                  }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                    ⬇️ Download
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-4">
                {letter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}