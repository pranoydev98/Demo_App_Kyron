'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import AnalyticsTab from './AnalyticsTab'
import AppealsTab from './AppealsTab'

const TABS = [
  { key: 'eligibility', label: 'Eligibility & Benefits', icon: '🛡️' },
  { key: 'analytics', label: 'Revenue Analytics', icon: '📊' },
  { key: 'appeals', label: 'Appeal Letter Generator', icon: '📝' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('eligibility')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-blue-600 mb-1">The Insurance App</h1>
        <p className="text-xs text-gray-400 mb-8">AI Powered Billing Platform</p>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === tab.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400 mb-2 truncate">{user?.email}</p>
          <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700">Sign Out</button>
        </div>
      </div> */}

      {/* Sidebar */}
<div className="w-64 bg-white border-r border-gray-200 flex flex-col">
  <div className="p-6 border-b border-gray-100">
    <h1 className="text-xl font-bold text-blue-600">Kyron Medical</h1>
    <p className="text-xs text-gray-400 mt-0.5">AI-Powered Billing Platform</p>
  </div>

  <nav className="flex flex-col gap-1 p-4 flex-1">
    {TABS.map(tab => (
      <button key={tab.key} onClick={() => setActiveTab(tab.key)}
        className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          activeTab === tab.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
        }`}>
        <span>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </nav>

  <div className="p-4 border-t border-gray-100">
    <p className="text-xs text-gray-400 mb-2 truncate">{user?.email}</p>
    <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700 font-medium">Sign Out</button>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'eligibility' && <EligibilityTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'appeals' && <AppealsTab />}
      </div>
    </div>
  )
}

async function handleBulkUpload(e, onDone) {
  const file = e.target.files[0]
  if (!file) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const reader = new FileReader()
  reader.onload = async (evt) => {
    try {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: 'yyyy-mm-dd' })

      const mapped = rows.map(row => ({
        user_id: user.id,
        first_name: row['Patient_First_Name*'] || row['first_name'] || '',
        last_name: row['Patient_Last_Name*'] || row['last_name'] || '',
        date_of_birth: row['Patient_Date_of_Birth*'] || row['date_of_birth'] || null,
        sex: row['Gender*'] || row['sex'] || '',
        phone: row['Patient_Phone_Number'] || row['phone'] || '',
        insurance_company: row['Insurance_Name_1*'] || row['insurance_company'] || '',
        member_id: row['Member_ID_1*'] || row['member_id'] || '',
        group_number: row['Group_Number_1'] || row['group_number'] || '',
        plan_name: row['plan_name'] || '',
        network_type: row['Network_Type_1'] || row['network_type'] || '',
        date_of_service: row['Date_of_Service_Start*'] || row['date_of_service'] || null,
        facility: row['Ordering_Facility_Name'] || row['facility'] || '',
        facility_npi: row['Ordering_Facility_NPI'] || row['facility_npi'] || '',
        physician: row['Provider_Name*'] || row['physician'] || '',
        physician_npi: row['Provider_NPI*'] || row['physician_npi'] || '',
        cpt_codes: row['CPT_Code_1*'] || row['cpt_codes'] || '',
        place_of_service: row['Place_Of_Service_1'] || row['place_of_service'] || '',
        status: 'Pending',
      })).filter(r => r.first_name && r.last_name)

      if (mapped.length === 0) {
        alert('No valid rows found. Check your column headers.')
        return
      }

      const { error } = await supabase.from('eligibility_checks').insert(mapped)
      if (error) alert('Upload error: ' + error.message)
      else {
        alert(`Successfully uploaded ${mapped.length} records!`)
        onDone()
      }
    } catch (err) {
      alert('Failed to parse file: ' + err.message)
    }
  }
  reader.readAsArrayBuffer(file)
  e.target.value = ''
}

function EligibilityTab() {
  const [checks, setChecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState(null)

  useEffect(() => {
    fetchChecks()
  }, [])

  const fetchChecks = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('eligibility_checks')
      .select('*')
      .order('created_at', { ascending: false })
    setChecks(data || [])
    setLoading(false)
  }

  // If a check is selected, show detail view
  if (selectedCheck) {
    return <EligibilityDetail check={selectedCheck} onBack={() => { setSelectedCheck(null); fetchChecks() }} />
  }

  // If form is open, show new check form
  if (showForm) {
    return <EligibilityForm onBack={() => setShowForm(false)} onCreated={() => { setShowForm(false); fetchChecks() }} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Eligibility & Benefits</h2>
          <p className="text-gray-500 text-sm mt-1">Verify patient coverage before appointments</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => document.getElementById('csv-upload').click()}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
            📁 Upload CSV
          </button>
          <input id="csv-upload" type="file" accept=".csv,.xlsx" className="hidden"
            onChange={(e) => handleBulkUpload(e, fetchChecks)} />
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition">
            + New Check
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Patient</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">DOB</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Insurance</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Member ID</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Date of Service</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Physician</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : checks.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No eligibility checks yet. Create one or upload a CSV.</td></tr>
            ) : (
              checks.map(check => (
                <tr key={check.id} onClick={() => setSelectedCheck(check)}
                  className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer transition">
                  <td className="px-4 py-3 font-medium">{check.first_name} {check.last_name}</td>
                  <td className="px-4 py-3">{check.date_of_birth}</td>
                  <td className="px-4 py-3">{check.insurance_company}</td>
                  <td className="px-4 py-3">{check.member_id}</td>
                  <td className="px-4 py-3">{check.date_of_service}</td>
                  <td className="px-4 py-3">{check.physician}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      check.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      check.status === 'Not Covered' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {check.status}
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

function EligibilityForm({ onBack, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', date_of_birth: '', sex: '', phone: '',
    insurance_company: '', member_id: '', group_number: '', plan_name: '', network_type: '',
    date_of_service: '', facility: '', facility_npi: '', physician: '', physician_npi: '', cpt_codes: '', place_of_service: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOCR = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setOcrLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/ocr', { method: 'POST', body: formData })
      const result = await response.json()
      setForm(prev => ({
        ...prev,
        insurance_company: result.insurance_company || prev.insurance_company,
        member_id: result.member_id || prev.member_id,
        group_number: result.group_number || prev.group_number,
        plan_name: result.plan_name || prev.plan_name,
      }))
    } catch {
      setError('OCR failed. Fill in manually.')
    }
    setOcrLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('eligibility_checks').insert({
      ...form,
      date_of_birth: form.date_of_birth || null,
      date_of_service: form.date_of_service || null,
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
      <h2 className="text-2xl font-bold text-gray-800 mb-1">New Eligibility Check</h2>
      <p className="text-gray-500 text-sm mb-8">Upload an insurance card or fill in details manually</p>

      {/* OCR Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-1">Insurance Card OCR</h3>
        <p className="text-xs text-gray-400 mb-4">Upload a card to auto-fill insurance fields</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition">
          <span className="text-3xl mb-2">📄</span>
          <span className="text-sm text-gray-500">{ocrLoading ? 'Processing card...' : 'Click to upload insurance card'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleOCR} disabled={ocrLoading} />
        </label>
      </div>

      {/* Patient Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Patient Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>First Name *</label><input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Last Name *</label><input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div><label className={labelClass}>Date of Birth *</label><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Sex *</label>
            <select name="sex" value={form.sex} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      {/* Insurance Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Insurance Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Insurance Company *</label><input name="insurance_company" value={form.insurance_company} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Member ID *</label><input name="member_id" value={form.member_id} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div><label className={labelClass}>Group Number</label><input name="group_number" value={form.group_number} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Plan Name</label><input name="plan_name" value={form.plan_name} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Network Type</label><input name="network_type" value={form.network_type} onChange={handleChange} className={inputClass} /></div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Requested Service</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Date of Service *</label><input type="date" name="date_of_service" value={form.date_of_service} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className={labelClass}>Facility Name *</label><input name="facility" value={form.facility} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Facility NPI *</label><input name="facility_npi" value={form.facility_npi} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className={labelClass}>Provider Name *</label><input name="physician" value={form.physician} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Provider NPI *</label><input name="physician_npi" value={form.physician_npi} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><label className={labelClass}>CPT Codes</label><input name="cpt_codes" placeholder="e.g. 99213, 99214" value={form.cpt_codes} onChange={handleChange} className={inputClass} /></div>
          <div>
            <label className={labelClass}>Place of Service</label>
            <select name="place_of_service" value={form.place_of_service} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option>Office</option><option>Outpatient Hospital</option><option>Inpatient Hospital</option>
              <option>Emergency Room</option><option>Telehealth</option><option>Ambulatory Surgical Center</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 mb-8">
        {loading ? 'Creating...' : 'Create Eligibility Check'}
      </button>
    </div>
  )
}

function EligibilityDetail({ check, onBack }) {
  const [callLoading, setCallLoading] = useState(false)
  const [callResult, setCallResult] = useState(
    check.call_summary ? {
      summary: check.call_summary,
      next_steps: check.call_next_steps,
      transcript: check.call_transcript,
      benefits: check.annual_deductible_total ? {
        annual_deductible: { total: check.annual_deductible_total, remaining: check.annual_deductible_remaining },
        out_of_pocket_max: { total: check.oop_max_total, remaining: check.oop_max_remaining },
        copay: { office_visit: check.copay_office, urgent_care: check.copay_urgent, emergency_room: check.copay_emergency },
        coverage_level: check.coverage_level,
        network_status: check.network_status,
        service_covered: check.service_covered,
      } : null,
      coverage_status: check.coverage_status,
    } : null
  )

  const handlePlaceCall = async () => {
    setCallLoading(true)
    try {
      const response = await fetch('/api/eligibility-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: `${check.first_name} ${check.last_name}`,
          date_of_birth: check.date_of_birth,
          insurance_company: check.insurance_company,
          member_id: check.member_id,
          group_number: check.group_number,
          plan_name: check.plan_name,
          cpt_codes: check.cpt_codes,
          facility: check.facility,
          facility_npi: check.facility_npi,
          physician: check.physician,
          physician_npi: check.physician_npi,
          date_of_service: check.date_of_service,
        }),
      })
      const result = await response.json()
      setCallResult(result)

      // Save results to Supabase
      await supabase.from('eligibility_checks').update({
        status: result.coverage_status === 'Active' ? 'Verified' : 'Not Covered',
        call_summary: result.summary,
        call_next_steps: result.next_steps,
        call_transcript: result.transcript,
        coverage_status: result.coverage_status,
        annual_deductible_total: result.benefits?.annual_deductible?.total,
        annual_deductible_remaining: result.benefits?.annual_deductible?.remaining,
        oop_max_total: result.benefits?.out_of_pocket_max?.total,
        oop_max_remaining: result.benefits?.out_of_pocket_max?.remaining,
        copay_office: result.benefits?.copay?.office_visit,
        copay_urgent: result.benefits?.copay?.urgent_care,
        copay_emergency: result.benefits?.copay?.emergency_room,
        coverage_level: result.benefits?.coverage_level,
        network_status: result.benefits?.network_status,
        service_covered: result.benefits?.service_covered,
      }).eq('id', check.id)

    } catch (err) {
      console.error(err)
    }
    setCallLoading(false)
  }

  return (
    <div className="max-w-4xl">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-6">← Back to list</button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{check.first_name} {check.last_name}</h2>
          <p className="text-gray-500 text-sm mt-1">{check.insurance_company} · {check.member_id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          check.status === 'Verified' ? 'bg-green-100 text-green-700' :
          check.status === 'Not Covered' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {check.status}
        </span>
      </div>

      {/* Patient + Insurance Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Patient Information</h3>
          <InfoRow label="Name" value={`${check.first_name} ${check.last_name}`} />
          <InfoRow label="Date of Birth" value={check.date_of_birth} />
          <InfoRow label="Sex" value={check.sex} />
          <InfoRow label="Phone" value={check.phone} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Insurance Information</h3>
          <InfoRow label="Company" value={check.insurance_company} />
          <InfoRow label="Member ID" value={check.member_id} />
          <InfoRow label="Group Number" value={check.group_number} />
          <InfoRow label="Plan Name" value={check.plan_name} />
          <InfoRow label="Network Type" value={check.network_type} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Provider & Facility</h3>
          <InfoRow label="Provider" value={check.physician} />
          <InfoRow label="Provider NPI" value={check.physician_npi} />
          <InfoRow label="Facility" value={check.facility} />
          <InfoRow label="Facility NPI" value={check.facility_npi} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Service Details</h3>
          <InfoRow label="Date of Service" value={check.date_of_service} />
          <InfoRow label="CPT Codes" value={check.cpt_codes} />
          <InfoRow label="Place of Service" value={check.place_of_service} />
        </div>
      </div>

      {/* Voice AI Agent */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800">Voice AI Agent</h3>
        <p className="text-sm text-blue-600 mb-6">
          Verify eligibility and benefits for {check.first_name} with {check.insurance_company}
        </p>

        {!callResult && (
          <button onClick={handlePlaceCall} disabled={callLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {callLoading ? '📞 Calling insurance...' : '📞 Place Call'}
          </button>
        )}

        {callResult && (
          <div className="flex flex-col gap-4">
            {/* Coverage Status */}
            <div className={`rounded-lg p-4 text-center font-bold text-lg ${
              callResult.coverage_status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              Coverage Status: {callResult.coverage_status}
            </div>

            {/* Benefits Cards */}
            {callResult.benefits && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3">Annual Deductible</h4>
                    <InfoRow label="Total Amount" value={`$${callResult.benefits.annual_deductible.total?.toLocaleString()}`} bold />
                    <InfoRow label="Remaining" value={`$${callResult.benefits.annual_deductible.remaining?.toLocaleString()}`} highlight />
                  </div>
                  <div className="bg-orange-50 rounded-lg p-5 border border-orange-100">
                    <h4 className="font-bold text-gray-800 mb-3">Out-of-Pocket Maximum</h4>
                    <InfoRow label="Total Amount" value={`$${callResult.benefits.out_of_pocket_max.total?.toLocaleString()}`} bold />
                    <InfoRow label="Remaining" value={`$${callResult.benefits.out_of_pocket_max.remaining?.toLocaleString()}`} highlight />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 mb-1">Office Visit Copay</p>
                    <p className="text-xl font-bold">${callResult.benefits.copay?.office_visit}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 mb-1">Urgent Care Copay</p>
                    <p className="text-xl font-bold">${callResult.benefits.copay?.urgent_care}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 mb-1">Emergency Room Copay</p>
                    <p className="text-xl font-bold">${callResult.benefits.copay?.emergency_room}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <InfoRow label="Coverage Level" value={callResult.benefits.coverage_level} />
                    <InfoRow label="Network Status" value={callResult.benefits.network_status} />
                  </div>
                  <div className={`rounded-lg p-4 border ${
                    callResult.benefits.service_covered === 'Covered' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <p className="text-xs text-gray-500 mb-1">Requested Service</p>
                    <p className={`text-lg font-bold ${
                      callResult.benefits.service_covered === 'Covered' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {callResult.benefits.service_covered}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Call Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Call Summary</h4>
              <p className="text-sm text-gray-600">{callResult.summary}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Next Steps</h4>
              <p className="text-sm text-gray-600">{callResult.next_steps}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Call Transcript</h4>
              <div className="text-sm text-gray-600 whitespace-pre-line">{callResult.transcript}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value, bold, highlight }) {
  if (!value) return null
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-400">{label}</span>
      <span className={`text-right ${highlight ? 'text-orange-500 font-bold' : bold ? 'font-bold' : 'text-gray-700 font-medium'}`}>{value}</span>
    </div>
  )
}