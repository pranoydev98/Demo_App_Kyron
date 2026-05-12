'use client'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { SAMPLE_CLAIMS_CSV } from './sampleClaimsData'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']

// Medicare baseline rates for underpayment detection
const MEDICARE_RATES = {
  '99213': 110, '99214': 165, '99215': 225,
  '90837': 155, '99395': 195, '99396': 210,
}

export default function AnalyticsTab() {
  const [claims, setClaims] = useState([])
  const [loaded, setLoaded] = useState(false)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { raw: false })
      setClaims(rows.map(r => ({
        ...r,
        amount_billed: parseFloat(r.amount_billed) || 0,
        amount_paid: parseFloat(r.amount_paid) || 0,
      })))
      setLoaded(true)
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CLAIMS_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'claims_template.csv'; a.click()
  }

if (!loaded) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Revenue Analytics</h2>
      <p className="text-gray-500 text-sm mb-8">Upload claims data to analyze denial patterns and detect underpayments</p>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <span className="text-5xl mb-4 block">📊</span>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Claims Data</h3>
        <p className="text-sm text-gray-400 mb-6">CSV or Excel with columns: claim_id, payer, cpt_code, amount_billed, amount_paid, status, denial_reason_code, denial_reason</p>
        <div className="flex gap-3 justify-center">
          <button onClick={downloadTemplate}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition">
            ⬇️ Download Template
          </button>
          <label className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition">
            📁 Upload Claims Data
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>
    </div>
  )
}

  // Compute analytics
  const totalClaims = claims.length
  const denied = claims.filter(c => c.status === 'Denied')
  const paid = claims.filter(c => c.status === 'Paid')
  const totalBilled = claims.reduce((s, c) => s + c.amount_billed, 0)
  const totalPaid = claims.reduce((s, c) => s + c.amount_paid, 0)
  const totalDenied = denied.reduce((s, c) => s + c.amount_billed, 0)
  const denialRate = ((denied.length / totalClaims) * 100).toFixed(1)

  // Underpayment detection
  const underpaid = paid.filter(c => {
    const medicare = MEDICARE_RATES[c.cpt_code]
    return medicare && c.amount_paid < medicare * 0.95
  }).map(c => ({
    ...c,
    expected: MEDICARE_RATES[c.cpt_code],
    shortfall: MEDICARE_RATES[c.cpt_code] - c.amount_paid,
  }))
  const totalUnderpaid = underpaid.reduce((s, c) => s + c.shortfall, 0)

  // Denial by payer
  const payerMap = {}
  claims.forEach(c => {
    if (!payerMap[c.payer]) payerMap[c.payer] = { total: 0, denied: 0, amount: 0 }
    payerMap[c.payer].total++
    if (c.status === 'Denied') { payerMap[c.payer].denied++; payerMap[c.payer].amount += c.amount_billed }
  })
  const denialByPayer = Object.entries(payerMap).map(([payer, d]) => ({
    payer, rate: ((d.denied / d.total) * 100).toFixed(1), denied: d.denied, total: d.total, amount: d.amount,
  })).sort((a, b) => b.rate - a.rate)

  // Denial by CPT
  const cptMap = {}
  claims.forEach(c => {
    if (!cptMap[c.cpt_code]) cptMap[c.cpt_code] = { total: 0, denied: 0, amount: 0, desc: c.cpt_description }
    cptMap[c.cpt_code].total++
    if (c.status === 'Denied') { cptMap[c.cpt_code].denied++; cptMap[c.cpt_code].amount += c.amount_billed }
  })
  const denialByCPT = Object.entries(cptMap).map(([code, d]) => ({
    code, desc: d.desc, rate: ((d.denied / d.total) * 100).toFixed(1), denied: d.denied, total: d.total, amount: d.amount,
  })).sort((a, b) => b.rate - a.rate)

  // Denial by reason
  const reasonMap = {}
  denied.forEach(c => {
    const key = c.denial_reason || 'Unknown'
    if (!reasonMap[key]) reasonMap[key] = { count: 0, amount: 0, code: c.denial_reason_code }
    reasonMap[key].count++
    reasonMap[key].amount += c.amount_billed
  })
  const denialByReason = Object.entries(reasonMap).map(([reason, d]) => ({
    reason, code: d.code, count: d.count, amount: d.amount,
  })).sort((a, b) => b.amount - a.amount)

  // Top fixes
  const topFixes = denialByReason.slice(0, 3).map(r => ({
    fix: r.reason,
    code: r.code,
    recovery: r.amount,
    claims: r.count,
  }))
  const totalRecoverable = topFixes.reduce((s, f) => s + f.recovery, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Revenue Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">{totalClaims} claims analyzed</p>
        </div>
      <div className="flex gap-3">
  <button onClick={downloadTemplate}
    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
    ⬇️ Template
  </button>
  <label className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition cursor-pointer">
    📁 Upload New Data
    <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleUpload} />
  </label>
</div>
        
      </div>

      

      {/* Hero Callouts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Total Billed</p>
          <p className="text-2xl font-bold text-gray-800">${totalBilled.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-5">
          <p className="text-xs text-red-400 mb-1">Total Denied</p>
          <p className="text-2xl font-bold text-red-600">${totalDenied.toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-1">{denialRate}% denial rate</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
          <p className="text-xs text-orange-400 mb-1">Underpayments Detected</p>
          <p className="text-2xl font-bold text-orange-600">${totalUnderpaid.toLocaleString()}</p>
          <p className="text-xs text-orange-400 mt-1">{underpaid.length} claims</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-5">
          <p className="text-xs text-green-400 mb-1">Recoverable Revenue</p>
          <p className="text-2xl font-bold text-green-600">${(totalDenied + totalUnderpaid).toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">with fixes below</p>
        </div>
      </div>

      {/* Top Fixes Hero */}
      <div className="bg-blue-600 rounded-xl p-6 mb-6 text-white">
        <h3 className="font-bold text-lg mb-1">🔧 Fix these {topFixes.length} things → recover ${totalRecoverable.toLocaleString()}/month</h3>
        <div className="flex flex-col gap-2 mt-4">
          {topFixes.map((fix, i) => (
            <div key={i} className="flex items-center justify-between bg-blue-700 rounded-lg px-4 py-3">
              <div>
                <span className="font-medium">{fix.fix}</span>
                <span className="text-blue-200 text-xs ml-2">({fix.code})</span>
              </div>
              <div className="text-right">
                <span className="font-bold">${fix.recovery.toLocaleString()}</span>
                <span className="text-blue-200 text-xs ml-2">{fix.claims} claims</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Denial Rate by Payer */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Denial Rate by Payer</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={denialByPayer}>
              <XAxis dataKey="payer" tick={{ fontSize: 11 }} />
              <YAxis unit="%" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => `${val}%`} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {denialByPayer.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Denial by Reason */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Denials by Reason</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={denialByReason} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={90} label={({ reason, count }) => `${reason} (${count})`}>
                {denialByReason.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Denial by CPT Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Denial Rate by CPT Code</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">CPT Code</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Description</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Total Claims</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Denied</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Denial Rate</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">$ at Risk</th>
            </tr>
          </thead>
          <tbody>
            {denialByCPT.map(row => (
              <tr key={row.code} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">{row.code}</td>
                <td className="px-4 py-2">{row.desc}</td>
                <td className="px-4 py-2">{row.total}</td>
                <td className="px-4 py-2 text-red-600">{row.denied}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.rate > 50 ? 'bg-red-100 text-red-700' : row.rate > 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>{row.rate}%</span>
                </td>
                <td className="px-4 py-2 font-medium">${row.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Underpayment Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Underpayment Detection</h3>
          <span className="text-xs text-gray-400">Compared against Medicare baseline rates</span>
        </div>
        {underpaid.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No underpayments detected</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Claim ID</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Payer</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">CPT</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Billed</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Paid</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Expected</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Shortfall</th>
              </tr>
            </thead>
            <tbody>
              {underpaid.map(row => (
                <tr key={row.claim_id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">{row.claim_id}</td>
                  <td className="px-4 py-2">{row.payer}</td>
                  <td className="px-4 py-2">{row.cpt_code}</td>
                  <td className="px-4 py-2">${row.amount_billed}</td>
                  <td className="px-4 py-2">${row.amount_paid}</td>
                  <td className="px-4 py-2">${row.expected}</td>
                  <td className="px-4 py-2 text-red-600 font-bold">${row.shortfall.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}