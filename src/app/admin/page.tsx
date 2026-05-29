'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store'
import { checkIsAdmin } from '@/hooks/useAdmin'
import { Flame, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // If already logged in and admin, redirect
  useEffect(() => {
    if (user) {
      checkIsAdmin(user.uid).then(ok => {
        if (ok) router.replace('/admin/dashboard')
      })
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const isAdmin = await checkIsAdmin(result.user.uid)
      if (!isAdmin) {
        await auth.signOut()
        setError('Access denied. You are not an admin.')
        setLoading(false)
        return
      }
      router.replace('/admin/dashboard')
    } catch (err: any) {
      setError('Invalid credentials. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, #2A1200 0%, #0A0A0A 70%)' }}>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#FF6B00]/15 ring-1 ring-[#FFD700]/30 grid place-items-center mb-4">
            <Flame size={28} className="text-[#FFD700]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#FFD700]">Pattasu Plaza</h1>
          <p className="text-xs text-[#8D6E63] mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#13100C] rounded-2xl border border-[#2A2015] p-6 shadow-2xl">
          <h2 className="text-base font-semibold text-[#FFF8F0] mb-1">Sign in</h2>
          <p className="text-xs text-[#8D6E63] mb-5">Admin access only</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#BCAAA4]">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@pattasuplaza.com"
                required
                className="w-full bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg px-3 py-2.5 text-sm text-[#FFF8F0] placeholder:text-[#8D6E63] focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#BCAAA4]">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#FFF8F0] placeholder:text-[#8D6E63] focus:outline-none transition"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#BCAAA4]">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#F44336] bg-[#F44336]/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#D14600] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,107,0,0.35)]"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8D6E63] mt-4">
          © {new Date().getFullYear()} Pattasu Plaza · Admin Portal
        </p>
      </div>
    </div>
  )
}
