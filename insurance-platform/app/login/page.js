'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-200 mb-1">The Insurance App</h1>
          <p className="text-blue-200 text-sm">AI-Powered Billing Platform</p>
        </div>
        <div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
            <p className="text-white text-lg font-medium mb-2">🛡️ Eligibility Verification</p>
            <p className="text-blue-200 text-sm">Upload insurance cards and patient Info, verify coverage with AI agents</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
            <p className="text-white text-lg font-medium mb-2">📊 Revenue Analytics</p>
            <p className="text-blue-200 text-sm">Identify denial patterns, detect underpayments, recover lost revenue</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white text-lg font-medium mb-2">📝 Appeal Letter Generator</p>
            <p className="text-blue-200 text-sm">AI-drafted professional appeal letters in seconds, not hours</p>
          </div>
        </div>
        <p className="text-blue-300 text-xs"></p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-blue-600">The Insurance App</h1>
            <p className="text-gray-400 text-sm">AI-Powered Billing Platform</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p className="text-gray-500 text-sm mb-8">{isSignUp ? 'Get started with "The Insurance App"' : 'Sign in to your dashboard'}</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Email</label>
              <input type="email" placeholder="you@clinic.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-gray-400 hover:text-gray-600">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button onClick={handleAuth} disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 mt-6">
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 ml-1 hover:underline font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}