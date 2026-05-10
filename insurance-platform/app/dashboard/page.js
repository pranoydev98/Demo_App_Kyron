'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
      {/* Sidebar */}
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

function EligibilityTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Eligibility & Benefits</h2>
      <p className="text-gray-500 text-sm">Verify patient coverage before appointments</p>
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Revenue Analytics</h2>
      <p className="text-gray-500 text-sm">Denial patterns and underpayment detection</p>
    </div>
  )
}

function AppealsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Appeal Letter Generator</h2>
      <p className="text-gray-500 text-sm">AI-drafted appeal letters for denied claims</p>
    </div>
  )
}